"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  demoCurrentUser,
  demoDashboardData,
  demoDeleteGear,
  demoDeleteLog,
  demoSaveGear,
  demoSaveLog,
  demoSaveMedia,
  demoSignIn,
  demoSignOut,
  demoSignUp,
} from "@/lib/demo-store";
import { getSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { fileToDataUrl } from "@/lib/utils";
import type {
  AppMode,
  CampLog,
  CampLogInput,
  DashboardData,
  GearInput,
  GearItem,
  LogMedia,
  UserProfile,
} from "@/lib/types";

type AppContextValue = {
  hydrated: boolean;
  loading: boolean;
  error?: string;
  mode: AppMode;
  user: UserProfile | null;
  data: DashboardData;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  saveGear: (input: GearInput, id?: string) => Promise<string>;
  deleteGear: (id: string) => Promise<void>;
  saveLog: (
    input: CampLogInput,
    id?: string,
    files?: File[],
  ) => Promise<string>;
  deleteLog: (id: string) => Promise<void>;
  getLogById: (id: string) => CampLog | undefined;
  getGearById: (id: string) => GearItem | undefined;
  getMediaForLog: (logId: string) => LogMedia[];
};

const defaultData: DashboardData = { logs: [], gear: [], media: [] };
const AppContext = createContext<AppContextValue | null>(null);

function mapUser(profile: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): UserProfile {
  return {
    id: profile.id,
    email: profile.email ?? "",
    displayName:
      typeof profile.user_metadata?.display_name === "string"
        ? profile.user_metadata.display_name
        : (profile.email ?? "").split("@")[0],
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [data, setData] = useState<DashboardData>(defaultData);
  const mode: AppMode = hasSupabaseEnv ? "supabase" : "demo";

  async function refresh() {
    try {
      setLoading(true);
      setError(undefined);

      if (!hasSupabaseEnv) {
        const currentUser = demoCurrentUser();
        setUser(
          currentUser
            ? {
                id: currentUser.id,
                email: currentUser.email,
                displayName: currentUser.displayName,
              }
            : null,
        );
        setData(currentUser ? demoDashboardData(currentUser.id) : defaultData);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        return;
      }

      const [{ data: sessionData }, logsRes, gearRes, mediaRes] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from("camp_logs").select("*").order("camp_date", { ascending: false }),
        supabase.from("gear_items").select("*").order("created_at", { ascending: false }),
        supabase.from("log_media").select("*").order("sort_order", { ascending: true }),
      ]);

      const current = sessionData.session?.user;
      if (!current) {
        setUser(null);
        setData(defaultData);
        return;
      }

      const linksRes = await supabase.from("log_gear_items").select("*");
      const gearIdsByLog = new Map<string, string[]>();
      for (const row of linksRes.data ?? []) {
        const list = gearIdsByLog.get(row.log_id) ?? [];
        list.push(row.gear_item_id);
        gearIdsByLog.set(row.log_id, list);
      }

      const mediaWithUrls = await Promise.all(
        (mediaRes.data ?? []).map(async (item) => {
          const signed = await supabase.storage
            .from("camp-media")
            .createSignedUrl(item.storage_path, 60 * 60 * 24 * 365);

          return {
            id: item.id,
            logId: item.log_id,
            userId: item.user_id,
            storagePath: item.storage_path,
            publicUrl: signed.data?.signedUrl ?? item.public_url ?? "",
            caption: item.caption ?? "",
            sortOrder: item.sort_order,
            createdAt: item.created_at,
          };
        }),
      );

      setUser(mapUser(current));
      setData({
        logs: (logsRes.data ?? []).map((item) => ({
          id: item.id,
          userId: item.user_id,
          title: item.title,
          campDate: item.camp_date,
          locationName: item.location_name,
          weather: item.weather,
          campsiteType: item.campsite_type,
          notes: item.notes ?? "",
          gearItemIds: gearIdsByLog.get(item.id) ?? [],
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        })),
        gear: (gearRes.data ?? []).map((item) => ({
          id: item.id,
          userId: item.user_id,
          name: item.name,
          category: item.category,
          brand: item.brand ?? "",
          memo: item.memo ?? "",
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        })),
        media: mediaWithUrls,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unexpected error");
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!hasSupabaseEnv) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!hydrated || loading) {
      return;
    }

    const authPath = pathname.startsWith("/login") || pathname.startsWith("/signup");
    if (!user && pathname !== "/" && !authPath) {
      router.push("/login");
      return;
    }

    if (user && authPath) {
      router.push("/dashboard");
    }
  }, [hydrated, loading, pathname, router, user]);

  async function signIn(email: string, password: string) {
    setError(undefined);
    if (!hasSupabaseEnv) {
      const nextUser = await demoSignIn(email, password);
      setUser({
        id: nextUser.id,
        email: nextUser.email,
        displayName: nextUser.displayName,
      });
      setData(demoDashboardData(nextUser.id));
      router.push("/dashboard");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const { error: authError } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      throw authError;
    }
    router.push("/dashboard");
  }

  async function signUp(email: string, password: string, name?: string) {
    setError(undefined);
    if (!hasSupabaseEnv) {
      const nextUser = await demoSignUp(email, password, name);
      setUser({
        id: nextUser.id,
        email: nextUser.email,
        displayName: nextUser.displayName,
      });
      setData(demoDashboardData(nextUser.id));
      router.push("/dashboard");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const { error: authError } = await supabase!.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });
    if (authError) {
      throw authError;
    }
    router.push("/login");
  }

  async function signOut() {
    if (!hasSupabaseEnv) {
      demoSignOut();
      setUser(null);
      setData(defaultData);
      router.push("/");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    await supabase!.auth.signOut();
    setUser(null);
    setData(defaultData);
    router.push("/");
  }

  async function saveGear(input: GearInput, id?: string) {
    if (!user) {
      throw new Error("You must be signed in.");
    }

    if (!hasSupabaseEnv) {
      const savedId = demoSaveGear(user.id, input, id);
      setData(demoDashboardData(user.id));
      return savedId;
    }

    const supabase = getSupabaseBrowserClient()!;
    if (id) {
      const { error: updateError } = await supabase
        .from("gear_items")
        .update({
          name: input.name,
          category: input.category,
          brand: input.brand,
          memo: input.memo,
        })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      await refresh();
      return id;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("gear_items")
      .insert({
        user_id: user.id,
        name: input.name,
        category: input.category,
        brand: input.brand,
        memo: input.memo,
      })
      .select("id")
      .single();

    if (insertError) {
      throw insertError;
    }

    await refresh();
    return inserted.id;
  }

  async function deleteGear(id: string) {
    if (!user) {
      return;
    }

    if (!hasSupabaseEnv) {
      demoDeleteGear(id);
      setData(demoDashboardData(user.id));
      return;
    }

    const supabase = getSupabaseBrowserClient()!;
    const { error: deleteError } = await supabase.from("gear_items").delete().eq("id", id);
    if (deleteError) {
      throw deleteError;
    }
    await refresh();
  }

  async function saveLog(input: CampLogInput, id?: string, files?: File[]) {
    if (!user) {
      throw new Error("You must be signed in.");
    }

    if (!hasSupabaseEnv) {
      const savedId = demoSaveLog(user.id, input, id);
      if (files?.length) {
        const converted = await Promise.all(
          files.map(async (file) => ({
            name: file.name,
            dataUrl: await fileToDataUrl(file),
          })),
        );
        demoSaveMedia(user.id, savedId, converted);
      }
      setData(demoDashboardData(user.id));
      return savedId;
    }

    const supabase = getSupabaseBrowserClient()!;
    let logId = id;
    if (id) {
      const { error: updateError } = await supabase
        .from("camp_logs")
        .update({
          title: input.title,
          camp_date: input.campDate,
          location_name: input.locationName,
          weather: input.weather,
          campsite_type: input.campsiteType,
          notes: input.notes,
        })
        .eq("id", id);
      if (updateError) {
        throw updateError;
      }
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("camp_logs")
        .insert({
          user_id: user.id,
          title: input.title,
          camp_date: input.campDate,
          location_name: input.locationName,
          weather: input.weather,
          campsite_type: input.campsiteType,
          notes: input.notes,
        })
        .select("id")
        .single();

      if (insertError) {
        throw insertError;
      }
      logId = inserted.id;
    }

    if (!logId) {
      throw new Error("Failed to save log.");
    }

    await supabase.from("log_gear_items").delete().eq("log_id", logId);
    if (input.gearItemIds.length) {
      const { error: linkError } = await supabase.from("log_gear_items").insert(
        input.gearItemIds.map((gearId) => ({
          log_id: logId,
          gear_item_id: gearId,
        })),
      );
      if (linkError) {
        throw linkError;
      }
    }

    if (files?.length) {
      for (const [index, file] of files.entries()) {
        const path = `${user.id}/${logId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("camp-media")
          .upload(path, file, { upsert: false });
        if (uploadError) {
          throw uploadError;
        }

        const { error: mediaError } = await supabase.from("log_media").insert({
          log_id: logId,
          user_id: user.id,
          storage_path: path,
          sort_order: index,
        });
        if (mediaError) {
          throw mediaError;
        }
      }
    }

    await refresh();
    return logId;
  }

  async function deleteLog(id: string) {
    if (!user) {
      return;
    }

    if (!hasSupabaseEnv) {
      demoDeleteLog(id);
      setData(demoDashboardData(user.id));
      return;
    }

    const supabase = getSupabaseBrowserClient()!;
    const media = data.media.filter((item) => item.logId === id);
    if (media.length) {
      await supabase.storage
        .from("camp-media")
        .remove(media.map((item) => item.storagePath));
    }
    const { error: deleteError } = await supabase.from("camp_logs").delete().eq("id", id);
    if (deleteError) {
      throw deleteError;
    }
    await refresh();
  }

  const value: AppContextValue = {
    hydrated,
    loading,
    error,
    mode,
    user,
    data,
    signIn,
    signUp,
    signOut,
    refresh,
    saveGear,
    deleteGear,
    saveLog,
    deleteLog,
    getLogById: (id) => data.logs.find((item) => item.id === id),
    getGearById: (id) => data.gear.find((item) => item.id === id),
    getMediaForLog: (logId) =>
      data.media.filter((item) => item.logId === logId),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}

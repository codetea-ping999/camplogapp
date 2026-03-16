import {
  CampLog,
  CampLogInput,
  DashboardData,
  GearInput,
  GearItem,
  LogMedia,
  UserProfile,
} from "@/lib/types";

const STORAGE_KEY = "camplog-demo-store-v1";

type DemoStore = {
  users: Array<UserProfile & { password: string }>;
  currentUserId?: string;
  logs: CampLog[];
  gear: GearItem[];
  media: LogMedia[];
};

const starterUser: UserProfile & { password: string } = {
  id: "demo-user",
  email: "demo@camplog.app",
  displayName: "Trail Demo",
  password: "password123",
};

const starterStore: DemoStore = {
  users: [starterUser],
  currentUserId: starterUser.id,
  logs: [
    {
      id: "starter-log",
      userId: starterUser.id,
      title: "Frosty Lakeside Morning",
      campDate: "2026-03-10",
      locationName: "Lake Motosu, Yamanashi",
      weather: "sunny",
      campsiteType: "free",
      notes: "Coffee at dawn, cast-iron skillet breakfast, calm wind after midnight.",
      gearItemIds: ["starter-gear-1", "starter-gear-2"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  gear: [
    {
      id: "starter-gear-1",
      userId: starterUser.id,
      name: "Alpha TC Tent",
      category: "Tent",
      brand: "Nord Hearth",
      memo: "Main shelter for 2 nights.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "starter-gear-2",
      userId: starterUser.id,
      name: "Compact Fire Pit",
      category: "Fire",
      brand: "Ember Fold",
      memo: "Used for steak and coffee boil.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  media: [],
};

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function canUseStorage() {
  return typeof window !== "undefined";
}

export function loadDemoStore() {
  if (!canUseStorage()) {
    return starterStore;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(starterStore));
    return starterStore;
  }

  return JSON.parse(raw) as DemoStore;
}

function saveDemoStore(store: DemoStore) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function demoSignIn(email: string, password: string) {
  const store = loadDemoStore();
  const user = store.users.find(
    (entry) => entry.email === email && entry.password === password,
  );

  if (!user) {
    throw new Error("Invalid email or password for demo mode.");
  }

  store.currentUserId = user.id;
  saveDemoStore(store);
  return user;
}

export async function demoSignUp(email: string, password: string, name?: string) {
  const store = loadDemoStore();
  const existing = store.users.find((entry) => entry.email === email);
  if (existing) {
    throw new Error("This demo account already exists.");
  }

  const user = {
    id: createId("user"),
    email,
    password,
    displayName: name?.trim() || email.split("@")[0],
  };

  store.users.push(user);
  store.currentUserId = user.id;
  saveDemoStore(store);
  return user;
}

export function demoCurrentUser() {
  const store = loadDemoStore();
  if (!store.currentUserId) {
    return null;
  }

  return (
    store.users.find((entry) => entry.id === store.currentUserId) ?? null
  );
}

export function demoSignOut() {
  const store = loadDemoStore();
  store.currentUserId = undefined;
  saveDemoStore(store);
}

export function demoDashboardData(userId: string): DashboardData {
  const store = loadDemoStore();
  return {
    logs: store.logs.filter((item) => item.userId === userId),
    gear: store.gear.filter((item) => item.userId === userId),
    media: store.media.filter((item) => item.userId === userId),
  };
}

export function demoSaveGear(userId: string, input: GearInput, id?: string) {
  const store = loadDemoStore();
  const now = new Date().toISOString();

  if (id) {
    store.gear = store.gear.map((item) =>
      item.id === id
        ? { ...item, ...input, updatedAt: now }
        : item,
    );
    saveDemoStore(store);
    return id;
  }

  const newItem: GearItem = {
    id: createId("gear"),
    userId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  store.gear.unshift(newItem);
  saveDemoStore(store);
  return newItem.id;
}

export function demoDeleteGear(id: string) {
  const store = loadDemoStore();
  store.gear = store.gear.filter((item) => item.id !== id);
  store.logs = store.logs.map((log) => ({
    ...log,
    gearItemIds: log.gearItemIds.filter((gearId) => gearId !== id),
  }));
  saveDemoStore(store);
}

export function demoSaveLog(userId: string, input: CampLogInput, id?: string) {
  const store = loadDemoStore();
  const now = new Date().toISOString();

  if (id) {
    store.logs = store.logs.map((item) =>
      item.id === id
        ? { ...item, ...input, updatedAt: now }
        : item,
    );
    saveDemoStore(store);
    return id;
  }

  const newItem: CampLog = {
    id: createId("log"),
    userId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  store.logs.unshift(newItem);
  saveDemoStore(store);
  return newItem.id;
}

export function demoDeleteLog(id: string) {
  const store = loadDemoStore();
  store.logs = store.logs.filter((item) => item.id !== id);
  store.media = store.media.filter((item) => item.logId !== id);
  saveDemoStore(store);
}

export function demoSaveMedia(
  userId: string,
  logId: string,
  files: Array<{ name: string; dataUrl: string }>,
) {
  const store = loadDemoStore();
  const created = files.map((file, index) => ({
    id: createId("media"),
    logId,
    userId,
    storagePath: `${userId}/${logId}/${file.name}`,
    publicUrl: file.dataUrl,
    sortOrder: index,
    createdAt: new Date().toISOString(),
  }));

  store.media.push(...created);
  saveDemoStore(store);
}

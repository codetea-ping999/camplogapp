"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Backpack,
  Flame,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/logs", label: "Camp Logs", icon: Flame },
  { href: "/gear", label: "Gear", icon: Backpack },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut, user, mode } = useApp();

  return (
    <div className="grain min-h-screen pb-24">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 md:px-6 lg:px-8">
        <aside className="panel hidden w-72 shrink-0 rounded-[32px] p-5 md:flex md:flex-col">
          <Link href="/dashboard" className="mb-10 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-accent text-slate-950">
              <Flame className="size-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-white">CampLog</p>
              <p className="text-sm text-muted">Trail memories, organized.</p>
            </div>
          </Link>
          <div className="mb-6 rounded-[26px] border border-white/8 bg-black/15 p-4">
            <p className="text-xs uppercase tracking-[0.26em] text-accent-strong">
              Current profile
            </p>
            <p className="mt-3 text-lg font-semibold text-white">{user?.displayName}</p>
            <p className="text-sm text-muted">{user?.email}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-ember">
              {mode === "demo" ? "Demo data active" : "Supabase linked"}
            </p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-accent text-slate-950"
                      : "text-muted hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-3">
            <Link href="/logs/new">
              <Button className="w-full">
                <Plus className="size-4" />
                New Log
              </Button>
            </Link>
            <div className="flex gap-3">
              <InstallPrompt />
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => signOut()}
              >
                <LogOut className="size-4" />
                Log Out
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
      <nav className="panel fixed right-4 bottom-4 left-4 z-40 flex rounded-[28px] px-2 py-2 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-3 text-[11px] font-semibold transition",
                active ? "bg-accent text-slate-950" : "text-muted",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

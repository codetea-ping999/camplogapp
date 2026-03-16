"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ProtectedPage } from "@/components/layout/protected-page";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers/app-provider";

export default function SettingsPage() {
  const { mode, user, signOut, refresh } = useApp();

  return (
    <ProtectedPage>
      <AppShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Settings"
            title="Account and environment"
            description="CampLog can run against Supabase or in local preview mode when environment variables are missing."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="rounded-[30px] space-y-4">
              <p className="text-sm uppercase tracking-[0.22em] text-accent-strong">Account</p>
              <div>
                <p className="text-xl font-semibold text-white">{user?.displayName}</p>
                <p className="text-sm text-muted">{user?.email}</p>
              </div>
              <Button variant="outline" onClick={() => signOut()}>
                Log Out
              </Button>
            </Card>
            <Card className="rounded-[30px] space-y-4">
              <p className="text-sm uppercase tracking-[0.22em] text-accent-strong">Backend mode</p>
              <p className="text-xl font-semibold text-white">
                {mode === "demo" ? "Demo Preview Mode" : "Supabase Connected Mode"}
              </p>
              <p className="text-sm leading-6 text-muted">
                {mode === "demo"
                  ? "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to switch to Supabase-backed auth, database, and storage."
                  : "App reads and writes directly through Supabase Auth, Postgres, and Storage."}
              </p>
              <Button variant="secondary" onClick={() => refresh()}>
                Refresh Data
              </Button>
            </Card>
          </div>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}

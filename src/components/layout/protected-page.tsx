"use client";

import { useApp } from "@/components/providers/app-provider";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { hydrated, loading, user } = useApp();

  if (!hydrated || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-full border border-border bg-white/5 px-5 py-3 text-sm text-muted">
          Loading CampLog...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

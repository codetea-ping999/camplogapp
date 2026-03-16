"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedPage } from "@/components/layout/protected-page";
import { CampLogCard } from "@/components/logs/camp-log-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { useApp } from "@/components/providers/app-provider";

export default function LogsPage() {
  const { data, getMediaForLog } = useApp();

  return (
    <ProtectedPage>
      <AppShell>
        <div className="space-y-8">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Camp Logs"
              title="Your trip archive"
              description="A searchable wall of site conditions, cooking notes, and linked loadouts."
            />
            <Link href="/logs/new">
              <Button>
                <Plus className="size-4" />
                New Log
              </Button>
            </Link>
          </div>
          {data.logs.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {data.logs.map((log) => (
                <CampLogCard
                  key={log.id}
                  log={log}
                  gearCount={log.gearItemIds.length}
                  mediaCount={getMediaForLog(log.id).length}
                />
              ))}
            </div>
          ) : (
            <Card className="rounded-[30px]">
              <p className="text-lg font-semibold text-white">Nothing logged yet.</p>
              <p className="mt-2 text-sm text-muted">
                Create your first camp memory to start building your archive.
              </p>
            </Card>
          )}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}

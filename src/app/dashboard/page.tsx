"use client";

import Link from "next/link";
import { ArrowRight, Backpack, Camera, Flame, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedPage } from "@/components/layout/protected-page";
import { CampLogCard } from "@/components/logs/camp-log-card";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers/app-provider";

export default function DashboardPage() {
  const { data, user, getMediaForLog } = useApp();

  return (
    <ProtectedPage>
      <AppShell>
        <div className="space-y-8">
          <div className="panel rounded-[32px] p-7 md:p-8">
            <SectionHeader
              eyebrow="Basecamp"
              title={`Welcome back, ${user?.displayName ?? "Camper"}.`}
              description="A quick view of recent camp nights, attached photos, and the gear you keep reaching for."
            />
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <Card className="rounded-[26px] bg-[linear-gradient(180deg,rgba(109,184,141,0.16),rgba(255,255,255,0.02))]">
                <Flame className="mb-4 size-5 text-accent-strong" />
                <p className="text-sm text-muted">Camp logs</p>
                <p className="mt-2 text-4xl font-semibold text-white">{data.logs.length}</p>
              </Card>
              <Card className="rounded-[26px] bg-[linear-gradient(180deg,rgba(239,141,79,0.15),rgba(255,255,255,0.02))]">
                <Backpack className="mb-4 size-5 text-ember" />
                <p className="text-sm text-muted">Registered gear</p>
                <p className="mt-2 text-4xl font-semibold text-white">{data.gear.length}</p>
              </Card>
              <Card className="rounded-[26px] bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))]">
                <Camera className="mb-4 size-5 text-white" />
                <p className="text-sm text-muted">Photos stored</p>
                <p className="mt-2 text-4xl font-semibold text-white">{data.media.length}</p>
              </Card>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Recent Trips"
              title="Latest camp logs"
              description="Each log keeps together place, weather, site type, notes, media, and linked gear."
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
              {data.logs.slice(0, 4).map((log) => (
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
              <p className="text-lg font-semibold text-white">No camp logs yet.</p>
              <p className="mt-2 text-sm text-muted">
                Start with your next trip and build a field-ready archive.
              </p>
            </Card>
          )}

          <Link
            href="/logs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-strong"
          >
            Browse all logs
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}

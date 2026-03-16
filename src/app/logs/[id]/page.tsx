"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit3, MapPin, TentTree } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedPage } from "@/components/layout/protected-page";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { useApp } from "@/components/providers/app-provider";
import { formatDate, toTitleCase } from "@/lib/utils";

export default function LogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { getLogById, getMediaForLog, getGearById } = useApp();
  const { id } = use(params);
  const log = getLogById(id);

  if (!log) {
    notFound();
  }

  const media = getMediaForLog(log.id);
  const gear = log.gearItemIds
    .map((gearId) => getGearById(gearId))
    .filter(Boolean);

  return (
    <ProtectedPage>
      <AppShell>
        <div className="space-y-8">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow={formatDate(log.campDate)}
              title={log.title}
              description={log.notes || "No notes written for this trip yet."}
            />
            <Link href={`/logs/${log.id}/edit`}>
              <Button variant="outline">
                <Edit3 className="size-4" />
                Edit
              </Button>
            </Link>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className="rounded-[30px] space-y-5">
              <div className="grid gap-3 text-sm text-muted md:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <MapPin className="mb-3 size-4 text-accent-strong" />
                  <p className="text-xs uppercase tracking-[0.24em]">Location</p>
                  <p className="mt-2 text-base font-semibold text-white">{log.locationName}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <TentTree className="mb-3 size-4 text-accent-strong" />
                  <p className="text-xs uppercase tracking-[0.24em]">Conditions</p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {toTitleCase(log.weather)} / {toTitleCase(log.campsiteType)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Used gear</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {gear.length ? (
                    gear.map((item) => (
                      <span
                        key={item!.id}
                        className="rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm text-accent-strong"
                      >
                        {item!.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No gear linked.</p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="rounded-[30px]">
              <p className="mb-4 text-sm font-semibold text-white">Attached photos</p>
              {media.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {media.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-2xl border border-white/8">
                      <div className="relative aspect-[4/3] bg-black/20">
                        <Image
                          src={item.publicUrl}
                          alt={item.caption || log.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No photos uploaded yet.</p>
              )}
            </Card>
          </div>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}

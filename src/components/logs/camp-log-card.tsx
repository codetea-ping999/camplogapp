import Link from "next/link";
import { MapPin, TentTree, CloudSun, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDate, toTitleCase } from "@/lib/utils";
import type { CampLog } from "@/lib/types";

export function CampLogCard({
  log,
  mediaCount,
  gearCount,
}: {
  log: CampLog;
  mediaCount: number;
  gearCount: number;
}) {
  return (
    <Link href={`/logs/${log.id}`}>
      <Card className="h-full rounded-[30px] p-0 transition hover:-translate-y-1 hover:border-accent/30 hover:bg-[#12231c]/90">
        <div className="border-b border-white/8 px-6 py-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-accent-strong">
                {formatDate(log.campDate)}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">
                {log.title}
              </h3>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted">
              {toTitleCase(log.campsiteType)}
            </div>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-muted">
            {log.notes || "No notes yet."}
          </p>
        </div>
        <div className="grid gap-3 px-6 py-5 text-sm text-muted">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-accent-strong" />
            {log.locationName}
          </div>
          <div className="flex items-center gap-2">
            <CloudSun className="size-4 text-accent-strong" />
            {toTitleCase(log.weather)}
          </div>
          <div className="flex items-center gap-2">
            <TentTree className="size-4 text-accent-strong" />
            {gearCount} gear linked
          </div>
          <div className="flex items-center gap-2">
            <Camera className="size-4 text-accent-strong" />
            {mediaCount} photos attached
          </div>
        </div>
      </Card>
    </Link>
  );
}

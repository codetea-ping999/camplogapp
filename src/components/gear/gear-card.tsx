import Link from "next/link";
import { Backpack, BadgeInfo } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { GearItem } from "@/lib/types";

export function GearCard({ item, usageCount }: { item: GearItem; usageCount: number }) {
  return (
    <Link href={`/gear/${item.id}/edit`}>
      <Card className="h-full rounded-[28px] transition hover:-translate-y-1 hover:border-accent/30">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-accent-strong">
              {item.category}
            </p>
            <h3 className="font-display text-xl font-semibold text-white">{item.name}</h3>
            <p className="text-sm text-muted">{item.brand || "Brand not set"}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-3 text-accent-strong">
            <Backpack className="size-5" />
          </div>
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
          {item.memo || "No memo saved for this gear yet."}
        </p>
        <div className="mt-5 flex items-center gap-2 text-sm text-muted">
          <BadgeInfo className="size-4 text-ember" />
          Used in {usageCount} camp log{usageCount === 1 ? "" : "s"}
        </div>
      </Card>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedPage } from "@/components/layout/protected-page";
import { GearCard } from "@/components/gear/gear-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { useApp } from "@/components/providers/app-provider";

export default function GearPage() {
  const { data } = useApp();

  return (
    <ProtectedPage>
      <AppShell>
        <div className="space-y-8">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Gear Locker"
              title="Owned gear"
              description="Keep a reusable list of shelter, fire, cooking, and comfort gear to attach to each trip."
            />
            <Link href="/gear/new">
              <Button>
                <Plus className="size-4" />
                Add Gear
              </Button>
            </Link>
          </div>

          {data.gear.length ? (
            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {data.gear.map((item) => (
                <GearCard
                  key={item.id}
                  item={item}
                  usageCount={data.logs.filter((log) => log.gearItemIds.includes(item.id)).length}
                />
              ))}
            </div>
          ) : (
            <Card className="rounded-[30px]">
              <p className="text-lg font-semibold text-white">No gear saved yet.</p>
              <p className="mt-2 text-sm text-muted">
                Add the tents, fire gear, cookware, and sleep system you actually own.
              </p>
            </Card>
          )}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}

"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedPage } from "@/components/layout/protected-page";
import { GearForm } from "@/components/gear/gear-form";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { useApp } from "@/components/providers/app-provider";

export default function EditGearPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { getGearById } = useApp();
  const { id } = use(params);
  const item = getGearById(id);

  if (!item) {
    notFound();
  }

  return (
    <ProtectedPage>
      <AppShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Edit Gear"
            title={item.name}
            description="Update categorization, notes, or replace older pack details."
          />
          <Card className="rounded-[32px] p-6 md:p-8">
            <GearForm item={item} />
          </Card>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}

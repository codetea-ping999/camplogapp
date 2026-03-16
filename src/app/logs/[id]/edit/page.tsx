"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedPage } from "@/components/layout/protected-page";
import { CampLogForm } from "@/components/logs/camp-log-form";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { useApp } from "@/components/providers/app-provider";

export default function EditLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { getLogById } = useApp();
  const { id } = use(params);
  const log = getLogById(id);

  if (!log) {
    notFound();
  }

  return (
    <ProtectedPage>
      <AppShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Edit Log"
            title={log.title}
            description="Update weather, notes, used gear, and add more photos."
          />
          <Card className="rounded-[32px] p-6 md:p-8">
            <CampLogForm log={log} />
          </Card>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}

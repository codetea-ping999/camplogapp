import { AppShell } from "@/components/layout/app-shell";
import { ProtectedPage } from "@/components/layout/protected-page";
import { CampLogForm } from "@/components/logs/camp-log-form";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

export default function NewLogPage() {
  return (
    <ProtectedPage>
      <AppShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="New Entry"
            title="Record a new camp log"
            description="Capture the trip date, location, weather, site style, gear, and photos in one pass."
          />
          <Card className="rounded-[32px] p-6 md:p-8">
            <CampLogForm />
          </Card>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}

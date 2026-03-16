import { AppShell } from "@/components/layout/app-shell";
import { ProtectedPage } from "@/components/layout/protected-page";
import { GearForm } from "@/components/gear/gear-form";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

export default function NewGearPage() {
  return (
    <ProtectedPage>
      <AppShell>
        <div className="space-y-8">
          <SectionHeader
            eyebrow="New Gear"
            title="Add gear to your locker"
            description="Register the equipment you own once, then attach it to any future camp log."
          />
          <Card className="rounded-[32px] p-6 md:p-8">
            <GearForm />
          </Card>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, Backpack, CloudMoon, Flame, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/components/providers/app-provider";

export default function HomePage() {
  const { user, mode } = useApp();

  return (
    <main className="grain min-h-screen overflow-hidden">
      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 md:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(121,187,142,0.16),_transparent_42%)]" />
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent-strong">
              Outdoor memory system
            </div>
            <div className="space-y-5">
              <h1 className="text-balance font-display text-5xl font-semibold tracking-tight text-white md:text-7xl">
                Track every campfire, site, meal, and gear setup in one place.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted">
                CampLog is a dark, offline-friendly field journal for campers who
                want fast logging, gear recall, and photo-backed trip notes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={user ? "/dashboard" : "/login"}>
                <Button className="px-6 py-3 text-base">
                  {user ? "Open Dashboard" : "Get Started"}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="px-6 py-3 text-base">
                  Create Account
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted">
              <span className="inline-flex items-center gap-2">
                <CloudMoon className="size-4 text-accent-strong" />
                Offline-ready PWA
              </span>
              <span className="inline-flex items-center gap-2">
                <Flame className="size-4 text-accent-strong" />
                Supabase Auth + Storage
              </span>
              <span className="inline-flex items-center gap-2">
                <Backpack className="size-4 text-accent-strong" />
                Gear linked to every log
              </span>
            </div>
          </div>
          <div className="grid gap-5">
            <Card className="rounded-[32px] p-0">
              <div className="rounded-[32px] border border-white/8 bg-[linear-gradient(140deg,rgba(34,67,54,0.92),rgba(13,24,19,0.82))] p-6">
                <div className="mb-24 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-accent-strong">
                      Current mode
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {mode === "demo" ? "Demo Preview" : "Supabase Connected"}
                    </p>
                  </div>
                  <Mountain className="size-10 text-accent-strong" />
                </div>
                <div className="grid gap-3 text-sm text-white/80">
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    Capture weather, site type, and detailed setup notes.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    Attach fire and cooking photos to each camp log.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    Recall exactly which gear worked on each trip.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

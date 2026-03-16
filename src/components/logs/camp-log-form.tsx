"use client";

import { useState } from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { campLogSchema } from "@/lib/schemas";
import { campsiteOptions, weatherOptions } from "@/lib/constants";
import type { CampLog, CampLogInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/components/providers/app-provider";

export function CampLogForm({ log }: { log?: CampLog }) {
  type CampLogFormValues = z.input<typeof campLogSchema>;
  const router = useRouter();
  const { data, saveLog, deleteLog, getMediaForLog } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>();
  const existingMedia = log ? getMediaForLog(log.id) : [];
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CampLogFormValues>({
    resolver: zodResolver(campLogSchema),
    defaultValues: log || {
      title: "",
      campDate: new Date().toISOString().slice(0, 10),
      locationName: "",
      weather: "sunny",
      campsiteType: "free",
      notes: "",
      gearItemIds: [],
    },
  });

  const selectedGearIds = watch("gearItemIds");

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(async (values) => {
        setSubmitting(true);
        setFormError(undefined);
        try {
          const uploadFiles = Array.from(fileInputRef.current?.files ?? []);
          const id = await saveLog(values as CampLogInput, log?.id, uploadFiles);
          router.push(`/logs/${id}`);
        } catch (caught) {
          setFormError(caught instanceof Error ? caught.message : "Unexpected error");
        } finally {
          setSubmitting(false);
        }
      })}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block space-y-2 md:col-span-2">
          <span className="text-sm text-muted">Title</span>
          <Input placeholder="Sunrise by the ridge" {...register("title")} />
          {errors.title ? <p className="text-sm text-rose-300">{errors.title.message}</p> : null}
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-muted">Camp date</span>
          <Input type="date" {...register("campDate")} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-muted">Location</span>
          <Input placeholder="Narusawa, Yamanashi" {...register("locationName")} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-muted">Weather</span>
          <Select {...register("weather")}>
            {weatherOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#102019]">
                {option.label}
              </option>
            ))}
          </Select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-muted">Site type</span>
          <Select {...register("campsiteType")}>
            {campsiteOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#102019]">
                {option.label}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-muted">Notes</span>
        <Textarea placeholder="Firewood, meal, weather shift, setup learnings..." {...register("notes")} />
      </label>

      <div className="space-y-3">
        <p className="text-sm text-muted">Used gear</p>
        <div className="grid gap-3 md:grid-cols-2">
          {data.gear.map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-3 rounded-2xl border border-border bg-white/5 px-4 py-3"
            >
              <input
                type="checkbox"
                value={item.id}
                defaultChecked={selectedGearIds?.includes(item.id)}
                {...register("gearItemIds")}
                className="mt-1 size-4 rounded border-border accent-[#6db88d]"
              />
              <span className="space-y-1">
                <span className="block text-sm font-semibold text-white">{item.name}</span>
                <span className="block text-xs uppercase tracking-[0.22em] text-muted">
                  {item.category}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-muted">Photos</span>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
        />
        <p className="text-xs text-muted">
          {files.length
            ? `${files.length} new file(s) selected.`
            : existingMedia.length
              ? `${existingMedia.length} photo(s) already attached.`
              : "Attach campfire or cooking shots to this log."}
        </p>
      </label>

      {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button disabled={submitting} type="submit">
          {submitting ? "Saving..." : log ? "Update Log" : "Save Log"}
        </Button>
        {log ? (
          <Button
            type="button"
            variant="danger"
            onClick={async () => {
              if (!window.confirm("Delete this camp log?")) {
                return;
              }
              await deleteLog(log.id);
              router.push("/logs");
            }}
          >
            Delete Log
          </Button>
        ) : null}
      </div>
    </form>
  );
}

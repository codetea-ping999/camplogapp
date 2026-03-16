"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gearSchema } from "@/lib/schemas";
import { gearCategories } from "@/lib/constants";
import type { GearInput, GearItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/components/providers/app-provider";

export function GearForm({ item }: { item?: GearItem }) {
  const router = useRouter();
  const { saveGear, deleteGear } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GearInput>({
    resolver: zodResolver(gearSchema),
    defaultValues: item ?? {
      name: "",
      category: gearCategories[0],
      brand: "",
      memo: "",
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        setSubmitting(true);
        setFormError(undefined);
        try {
          await saveGear(values, item?.id);
          router.push("/gear");
        } catch (caught) {
          setFormError(caught instanceof Error ? caught.message : "Unexpected error");
        } finally {
          setSubmitting(false);
        }
      })}
    >
      <label className="block space-y-2">
        <span className="text-sm text-muted">Gear name</span>
        <Input placeholder="Compact folding stove" {...register("name")} />
        {errors.name ? <p className="text-sm text-rose-300">{errors.name.message}</p> : null}
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-muted">Category</span>
        <Select {...register("category")}>
          {gearCategories.map((option) => (
            <option key={option} value={option} className="bg-[#102019]">
              {option}
            </option>
          ))}
        </Select>
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-muted">Brand</span>
        <Input placeholder="Optional brand" {...register("brand")} />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-muted">Memo</span>
        <Textarea placeholder="Pack notes, maintenance, and preferred use." {...register("memo")} />
      </label>
      {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button disabled={submitting} type="submit">
          {submitting ? "Saving..." : item ? "Update Gear" : "Save Gear"}
        </Button>
        {item ? (
          <Button
            type="button"
            variant="danger"
            onClick={async () => {
              if (!window.confirm("Delete this gear item?")) {
                return;
              }
              await deleteGear(item.id);
              router.push("/gear");
            }}
          >
            Delete Gear
          </Button>
        ) : null}
      </div>
    </form>
  );
}

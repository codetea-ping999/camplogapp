import { z } from "zod";

export const authSchema = z.object({
  name: z.string().min(2, "Display name is too short.").optional(),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const gearSchema = z.object({
  name: z.string().min(2, "Gear name is required."),
  category: z.string().min(2, "Select a category."),
  brand: z.string().optional(),
  memo: z.string().optional(),
});

export const campLogSchema = z.object({
  title: z.string().min(2, "Title is required."),
  campDate: z.string().min(1, "Date is required."),
  locationName: z.string().min(2, "Location is required."),
  weather: z.enum(["sunny", "cloudy", "rainy", "snowy", "windy", "foggy"]),
  campsiteType: z.enum(["free", "sectioned", "auto", "glamping", "other"]),
  notes: z.string().optional(),
  gearItemIds: z.array(z.string()).default([]),
});

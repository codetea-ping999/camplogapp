export type Weather =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "snowy"
  | "windy"
  | "foggy";

export type CampsiteType =
  | "free"
  | "sectioned"
  | "auto"
  | "glamping"
  | "other";

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
};

export type GearItem = {
  id: string;
  userId: string;
  name: string;
  category: string;
  brand?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type LogMedia = {
  id: string;
  logId: string;
  userId: string;
  storagePath: string;
  publicUrl: string;
  caption?: string;
  sortOrder: number;
  createdAt: string;
};

export type CampLog = {
  id: string;
  userId: string;
  title: string;
  campDate: string;
  locationName: string;
  weather: Weather;
  campsiteType: CampsiteType;
  notes?: string;
  gearItemIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type DashboardData = {
  logs: CampLog[];
  gear: GearItem[];
  media: LogMedia[];
};

export type CampLogInput = Omit<
  CampLog,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type GearInput = Omit<
  GearItem,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type AppMode = "demo" | "supabase";

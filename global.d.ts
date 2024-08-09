import type { z } from "zod";

export {};

declare global {
  type DragonData = {
    id: string;
    name: string;
    owner: string;
    start: string;
    hatch: string;
    grow: string;
    death: string;
    views: number;
    unique: number;
    clicks: number;
    gender: "Male" | "Female";
    acceptaid: boolean;
    hoursleft: number;
    parent_f: string;
    parent_m: string;
  };

  type ScrollView = DragonData & {
    inHatchery: boolean;
  };

  type HatcheryDragon = {
    code: string;
    username: string;
  };

  type UserSettings = z.infer<typeof userSettingsSchema>;

  type UserRole = "owner" | "user";
}

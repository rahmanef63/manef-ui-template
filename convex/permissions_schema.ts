import { Infer, v } from "convex/values";
import { roles } from "../shared/types/roles";

export const vPermission = v.union(
  v.literal("Manage Team"),
  v.literal("Delete Team"),
  v.literal("Read Members"),
  v.literal("Manage Members"),
  v.literal("Contribute"),
  v.literal("Manage Menu")
);
export type Permission = Infer<typeof vPermission>;

export const vRole = v.union(
  ...(roles.map((role) => v.literal(role)) as [any, ...any[]])
);
export type Role = Infer<typeof vRole>;

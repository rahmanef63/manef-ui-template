import type { Id } from "@manef/db/dataModel";

export const roles = ["Admin", "Member"] as const;

export type Role = (typeof roles)[number];

export interface RoleSummary {
  _id: Id<"roles">;
  name: Role;
  isDefault: boolean;
}

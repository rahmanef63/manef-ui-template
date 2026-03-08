import type { Id } from "@/shared/types/convex";
import type { Role } from "@/shared/types/roles";

export interface InviteSummary {
  _id: Id<"invites">;
  email: string;
  inviterEmail: string;
  team: string;
  role: Role;
}

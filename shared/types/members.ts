import type { Id } from "@/shared/types/convex";
import type { Role } from "@/shared/types/roles";

export interface MemberSummary {
  _id: Id<"members">;
  fullName: string;
  email: string;
  pictureUrl?: string | null;
  initials: string;
  roleId: Id<"roles">;
}

export interface MemberInviteSummary {
  _id: Id<"invites">;
  email: string;
  role: Role;
}

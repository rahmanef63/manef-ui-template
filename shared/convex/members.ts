import { makeFunctionReference } from "convex/server";
import { paginationOptsValidator } from "convex/server";
import type { Infer } from "convex/values";
import type { Id } from "@/shared/types/convex";
import type { MemberInviteSummary, MemberSummary } from "@/shared/types/members";

export const listMembersRef = makeFunctionReference<
  "query",
  {
    workspaceId: Id<"workspaces">;
    search: string;
    paginationOpts: Infer<typeof paginationOptsValidator>;
  },
  {
    page: MemberSummary[];
    isDone: boolean;
    continueCursor: string;
  }
>("users/workspaces/members:list");

export const updateMemberRef = makeFunctionReference<
  "mutation",
  { memberId: Id<"members">; roleId: Id<"roles"> },
  void
>("users/workspaces/members:update");

export const deleteMemberRef = makeFunctionReference<
  "mutation",
  { memberId: Id<"members"> },
  void
>("users/workspaces/members:deleteMember");

export const listMemberInvitesRef = makeFunctionReference<
  "query",
  { workspaceId?: Id<"workspaces"> },
  MemberInviteSummary[] | null
>("users/workspaces/members/invites:list");

export const deleteMemberInviteRef = makeFunctionReference<
  "mutation",
  { inviteId: Id<"invites"> },
  void
>("users/workspaces/members/invites:deleteInvite");

export const sendMemberInviteRef = makeFunctionReference<
  "action",
  { workspaceId: Id<"workspaces">; email: string; roleId: Id<"roles"> },
  null
>("users/workspaces/members/invites:send");

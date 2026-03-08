import { makeFunctionReference } from "convex/server";
import { paginationOptsValidator } from "convex/server";
import type { Infer } from "convex/values";
import type { Id } from "@/shared/types/convex";
import type { MemberInviteSummary, MemberSummary } from "@/shared/types/members";

export const listMembersRef = makeFunctionReference<
  "query",
  {
    teamId: Id<"teams">;
    search: string;
    paginationOpts: Infer<typeof paginationOptsValidator>;
  },
  {
    page: MemberSummary[];
    isDone: boolean;
    continueCursor: string;
  }
>("users/teams/members:list");

export const updateMemberRef = makeFunctionReference<
  "mutation",
  { memberId: Id<"members">; roleId: Id<"roles"> },
  void
>("users/teams/members:update");

export const deleteMemberRef = makeFunctionReference<
  "mutation",
  { memberId: Id<"members"> },
  void
>("users/teams/members:deleteMember");

export const listMemberInvitesRef = makeFunctionReference<
  "query",
  { teamId?: Id<"teams"> },
  MemberInviteSummary[] | null
>("users/teams/members/invites:list");

export const deleteMemberInviteRef = makeFunctionReference<
  "mutation",
  { inviteId: Id<"invites"> },
  void
>("users/teams/members/invites:deleteInvite");

export const sendMemberInviteRef = makeFunctionReference<
  "action",
  { teamId: Id<"teams">; email: string; roleId: Id<"roles"> },
  null
>("users/teams/members/invites:send");

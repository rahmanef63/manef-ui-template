import { makeFunctionReference } from "convex/server";
import type { Id } from "@/shared/types/convex";
import type { InviteSummary } from "@/shared/types/invites";

export const listInvitesRef = makeFunctionReference<
  "query",
  Record<string, never>,
  InviteSummary[] | null
>("user_invites:list");

export const getInviteRef = makeFunctionReference<
  "query",
  { inviteId: Id<"invites"> },
  InviteSummary | null
>("user_invites:get");

export const acceptInviteRef = makeFunctionReference<
  "mutation",
  { inviteId: Id<"invites"> },
  string
>("user_invites:accept");

export const deleteInviteRef = makeFunctionReference<
  "mutation",
  { inviteId: Id<"invites"> },
  void
>("user_invites:deleteInvite");

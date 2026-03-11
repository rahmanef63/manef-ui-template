// @ts-nocheck
import { typedApi } from "@/shared/convex/api";

export const listInvitesRef = typedApi.user_invites.list;
export const getInviteRef = typedApi.user_invites.get;
export const acceptInviteRef = typedApi.user_invites.accept;
export const deleteInviteRef = typedApi.user_invites.deleteInvite;

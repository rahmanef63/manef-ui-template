// @ts-nocheck
import { typedApi } from "@/shared/convex/api";

export const listMembersRef = typedApi.users.workspaces.members.list;
export const updateMemberRef = typedApi.users.workspaces.members.update;
export const deleteMemberRef = typedApi.users.workspaces.members.deleteMember;
export const listMemberInvitesRef = typedApi.users.workspaces.members.invites.list;
export const deleteMemberInviteRef = typedApi.users.workspaces.members.invites.deleteInvite;
export const sendMemberInviteRef = typedApi.users.workspaces.members.invites.send;

import { Infer, v } from "convex/values";
import { MutationCtx, QueryCtx } from "./types";
import { Id } from "./_generated/dataModel";

export type { Permission, Role } from "./permissions_schema";
import { Permission, Role } from "./permissions_schema";

export async function getPermission(ctx: QueryCtx, name: Permission) {
  return (await ctx.table("permissions").getX("name", name))._id;
}

export async function getRole(ctx: QueryCtx, name: Role) {
  return await ctx.table("roles").getX("name", name);
}

export async function viewerWithPermission(
  ctx: QueryCtx,
  teamId: Id<"teams">,
  name: Permission
) {
  const member = await ctx
    .table("members", "teamUser", (q: any) =>
      q.eq("teamId", teamId).eq("userId", ctx.viewerX()._id)
    )
    .unique();
  if (
    member === null ||
    !(await member
      .edge("role")
      .edge("permissions")
      .has(await getPermission(ctx, name)))
  ) {
    return null;
  }
  return member;
}

export async function viewerHasPermission(
  ctx: QueryCtx,
  teamId: Id<"teams">,
  name: Permission
) {
  const member = await viewerWithPermission(ctx, teamId, name);
  return member !== null;
}

export async function viewerWithPermissionX(
  ctx: MutationCtx,
  teamId: Id<"teams">,
  name: Permission
) {
  const member = await viewerWithPermission(ctx, teamId, name);
  if (member === null) {
    throw new Error(`Viewer does not have the permission "${name}"`);
  }
  return member;
}

export async function viewerHasPermissionX(
  ctx: MutationCtx,
  teamId: Id<"teams">,
  name: Permission
) {
  await viewerWithPermissionX(ctx, teamId, name);
  return true;
}

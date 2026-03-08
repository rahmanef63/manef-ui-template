import { v } from "convex/values";
import { mutation, query } from "../functions";
import { getRole, viewerHasPermissionX } from "../permissions";
import { Ent, QueryCtx } from "../types";
import { slugify } from "../utils";
import { createMember } from "./teams/members";

export async function defaultToAccessTeamSlug(viewer: Ent<"users">) {
  return (
    await viewer.edge("members").map((member: any) => member.edge("team").doc())
  ).filter((team) => team.isPersonal)[0]!
    .slug;
}

export const list = query({
  args: {},
  async handler(ctx) {
    if (ctx.viewer === null) {
      return null;
    }
    return await ctx.viewer
      .edge("members")
      .map(async (member: any) => {
        const team = await member.edge("team");
        return {
          _id: team._id,
          name: team.name,
          slug: team.slug,
          isPersonal: team.isPersonal,
          pictureUrl: team.isPersonal ? ctx.viewer!.pictureUrl : null,
          isDeleted: false,
        };
      })
      .filter((member: any) => !member.isDeleted);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, { name }) {
    const slug = await getUniqueSlug(ctx, name);
    const teamId = await ctx
      .table("teams")
      .insert({ name, isPersonal: false, slug });
    await createMember(ctx, {
      teamId,
      user: ctx.viewerX(),
      roleId: (await getRole(ctx, "Admin"))._id,
    });
    return slug;
  },
});

export const update = mutation({
  args: {
    teamId: v.id("teams"),
    name: v.string(),
  },
  async handler(ctx, { teamId, name }) {
    await viewerHasPermissionX(ctx, teamId, "Manage Team");
    const team = await ctx.table("teams").getX(teamId);
    await team.patch({ name });
  },
});

export const deleteTeam = mutation({
  args: {
    teamId: v.id("teams"),
  },
  async handler(ctx, { teamId }) {
    await viewerHasPermissionX(ctx, teamId, "Delete Team");
    const team = await ctx.table("teams").getX(teamId);
    await team.delete();
    if (team.isPersonal) {
      await ctx.viewerX().delete();
    }
  },
});

export async function getUniqueSlug(ctx: QueryCtx, name: string) {
  const base = slugify(name);
  let slug;
  let n = 0;
  for (; ;) {
    slug = n === 0 ? base : `${base}-${n}`;
    const existing = await ctx.table("teams").get("slug", slug);
    if (existing === null) {
      break;
    }
    n++;
  }
  return slug;
}

import { internalMutation, mutation } from "./functions";
import { getRole } from "./permissions";
import { defaultToAccessWorkspaceSlug, getUniqueSlug } from "./users/workspaces";
import { createMember } from "./users/workspaces/members";

export const store = mutation({
  args: {},
  handler: async (ctx): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    const fallbackEmail = process.env.AUTH_ADMIN_EMAIL ?? "admin@example.com";
    const email = identity?.email ?? fallbackEmail;
    const tokenIdentifier = identity?.tokenIdentifier ?? `session:${email}`;

    const existingUser = await ctx
      .table("users")
      .get("tokenIdentifier", tokenIdentifier);
    if (existingUser !== null) {
      return defaultToAccessWorkspaceSlug(existingUser);
    }
    let user = await ctx.table("users").get("email", email);
    const nameFallback = emailUserName(email);
    const userFields = {
      fullName: identity?.name ?? nameFallback,
      tokenIdentifier,
      email,
      pictureUrl: identity?.pictureUrl,
      firstName: identity?.givenName,
      lastName: identity?.familyName,
    };
    if (user !== null) {
      await user.patch(userFields);
    } else {
      user = await ctx.table("users").insert(userFields).get();
    }
    const name = `${user.firstName ?? nameFallback}'s Workspace`;
    const slug = await getUniqueSlug(ctx, identity?.nickname ?? name);
    const workspaceId = await ctx
      .table("workspaces")
      .insert({ name, slug, isPersonal: true });
    await createMember(ctx, {
      workspaceId,
      user,
      roleId: (await getRole(ctx, "Admin"))._id,
    });
    return slug;
  },
});

function emailUserName(email: string) {
  return email.split("@")[0];
}

// export const foo = internalMutation({
//   args: {},
//   handler: async (ctx) => {
//     await ctx.table("as", "b", (q) => q.eq("_creationTime" as any, 3 as any));
//   },
// });

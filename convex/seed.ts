import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const populateDatabase = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Seed user: rahmanef63@gmail.com
        let user = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", "rahmanef63@gmail.com"))
            .first();

        let userId;
        if (!user) {
            userId = await ctx.db.insert("users", {
                email: "rahmanef63@gmail.com",
                fullName: "rahman",
                tokenIdentifier: "dummy-token-id-123", // Assuming some dummy auth token for development
            });
            console.log("Seeded user:", userId);
        } else {
            userId = user._id;
            console.log("User already exists:", userId);
        }

        // 2. Seed Role: Admin
        let role = await ctx.db
            .query("roles")
            .withIndex("name", (q) => q.eq("name", "Admin"))
            .first();

        let roleId;
        if (!role) {
            roleId = await ctx.db.insert("roles", {
                name: "Admin" as any, // bypassing vRole check explicitly if necessary, but "Admin" should work depending on permissions_schema
                isDefault: true,
            });
            console.log("Seeded role Admin:", roleId);
        } else {
            roleId = role._id;
            console.log("Role Admin already exists:", roleId);
        }

        // 3. Seed Workspace: Main
        let workspace = await ctx.db
            .query("workspaces")
            .withIndex("slug", (q) => q.eq("slug", "main"))
            .first();

        let workspaceId;
        if (!workspace) {
            workspaceId = await ctx.db.insert("workspaces", {
                slug: "main",
                name: "Main Workspace",
                isPersonal: false,
            });
            console.log("Seeded workspace:", workspaceId);
        } else {
            workspaceId = workspace._id;
            console.log("Workspace already exists:", workspaceId);
        }

        // 4. Link User to Workspace as Admin
        let member = await ctx.db
            .query("members")
            .withIndex("workspaceUser", (q) =>
                q.eq("workspaceId", workspaceId).eq("userId", userId)
            )
            .first();

        if (!member) {
            await ctx.db.insert("members", {
                userId: userId,
                workspaceId: workspaceId,
                roleId: roleId,
                searchable: "rahman",
            });
            console.log("Seeded member relationship");
        } else {
            console.log("Member relationship already exists");
        }

        // 5. Seed Agent: Main
        let agent = await ctx.db
            .query("agents")
            .withIndex("by_agentId", (q) => q.eq("agentId", "main"))
            .first();

        if (!agent) {
            const now = Date.now();
            await ctx.db.insert("agents", {
                agentId: "main",
                name: "Main Agent",
                type: "orchestrator", // default type
                tenantId: "main",
                createdAt: now,
                updatedAt: now,
                isActive: "true",
            });
            console.log("Seeded main agent");
        } else {
            console.log("Main agent already exists");
        }

        return "Database seeded successfully!";
    },
});

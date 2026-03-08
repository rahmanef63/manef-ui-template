import { query, mutation, action } from "../../_generated/server";
import { v } from "convex/values";
import { api } from "../../_generated/api";

/**
 * Returns a list of users.
 */
export const getUsers = query({
    args: {},
    returns: v.array(
        v.object({
            _id: v.any(), // users table may not exist yet, keeping loose
            name: v.string(),
            email: v.string(),
            role: v.string(),
            status: v.string(),
            lastActive: v.number(),
        })
    ),
    handler: async (ctx) => {
        // Fallback dummy logic if users table isn't populated
        // In real life, query "users" table
        const users = await ctx.db.query("userProfiles" as any).order("desc").take(50).catch(() => []);

        if (!users || users.length === 0) {
            return [
                {
                    _id: "demo1" as any,
                    name: "Admin User",
                    email: "admin@openclaw.com",
                    role: "Admin",
                    status: "active",
                    lastActive: Date.now() - 3600000,
                },
                {
                    _id: "demo2" as any,
                    name: "Test Member",
                    email: "member@openclaw.com",
                    role: "Member",
                    status: "invited",
                    lastActive: Date.now() - 86000000,
                }
            ];
        }

        return users.map((u: any) => ({
            _id: u._id,
            name: u.name || "Unknown",
            email: u.email || "",
            role: u.role || "Member",
            status: u.status || "active",
            lastActive: u.updatedAt || Date.now(),
        }));
    },
});

/**
 * Invites a new user.
 */
export const inviteUser = mutation({
    args: {
        email: v.string(),
        role: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        // Mock insert logic
        console.log("Inviting user", args.email, "as", args.role);
        return null;
    },
});

/**
 * Bans a user (mock action).
 */
export const banUser = action({
    args: { userId: v.string() },
    returns: v.null(),
    handler: async (ctx, args) => {
        console.log(`Banning user ${args.userId}...`);
        return null;
    },
});

import { query, mutation, action } from "../../_generated/server";
import { v } from "convex/values";
import { api } from "../../_generated/api";

export const getTenantItems = query({
    args: { tenantId: v.string() },
    returns: v.array(
        v.object({
            _id: v.id("tenantCrudItems"),
            key: v.string(),
            value: v.string(),
            createdAt: v.number(),
            updatedAt: v.number(),
        })
    ),
    handler: async (ctx, args) => {
        const items = await ctx.db
            .query("tenantCrudItems")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .order("desc")
            .take(50);
        return items.map((i) => ({
            _id: i._id,
            key: i.key,
            value: i.value,
            createdAt: i.createdAt,
            updatedAt: i.updatedAt,
        }));
    },
});

export const setTenantItem = mutation({
    args: {
        tenantId: v.string(),
        key: v.string(),
        value: v.string(),
    },
    returns: v.id("tenantCrudItems"),
    handler: async (ctx, args) => {
        // Simple insert for illustration
        return await ctx.db.insert("tenantCrudItems", {
            tenantId: args.tenantId,
            key: args.key,
            value: args.value,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

export const processCoreItem = action({
    args: { itemId: v.id("tenantCrudItems") },
    returns: v.null(),
    handler: async (ctx, args) => {
        console.log(`Processing core item: ${args.itemId}`);
        return null;
    },
});

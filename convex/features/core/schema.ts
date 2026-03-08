import { defineTable } from "convex/server";
import { v } from "convex/values";

export const coreSchema = {
    tenantCrudItems: defineTable({
        createdAt: v.float64(),
        createdBy: v.optional(v.string()),
        deletedAt: v.optional(v.float64()),
        key: v.string(),
        metadata: v.optional(v.any()),
        tenantId: v.string(),
        updatedAt: v.float64(),
        value: v.string(),
    })
        .index("by_tenant", ["tenantId"])
        .index("by_tenant_deleted", ["tenantId", "deletedAt"])
        .index("by_tenant_key", ["tenantId", "key"]),
};

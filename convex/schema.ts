import { defineEnt, defineEntSchema, getEntDefinitions } from "convex-ents";
import { v } from "convex/values";
import { vPermission, vRole } from "./permissions_schema";

// Example: 7 day soft deletion period for workspaces
// todo: Unused constant in schema - remove or implement scheduled deletion
const WORKSPACE_DELETION_DELAY_MS = 7 * 24 * 60 * 60 * 1000;

const schema = defineEntSchema(
  {
    workspaces: defineEnt({
      name: v.string(),
      isPersonal: v.boolean(),
    })
      .field("slug", v.string())
      .index("slug", ["slug"])
      .edges("messages", { ref: true })
      .edges("members", { ref: true })
      .edges("invites", { ref: true })
      .edges("menuItemOverrides", { ref: true }),

    users: defineEnt({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      fullName: v.string(),
      pictureUrl: v.optional(v.string()),
    })
      .field("email", v.string())
      .field("tokenIdentifier", v.string())
      .index("email", ["email"])
      .index("tokenIdentifier", ["tokenIdentifier"])
      .edges("members", { ref: true }),

    members: defineEnt({
      searchable: v.string(),
    })
      .edge("workspace")
      .edge("user")
      .edge("role")
      .index("workspaceUser", ["workspaceId", "userId"])
      .searchIndex("searchable", {
        searchField: "searchable",
        filterFields: ["workspaceId"],
      })
      .edges("messages", { ref: true }),

    invites: defineEnt({
      inviterEmail: v.string(),
    })
      .field("email", v.string())
      .index("email", ["email"])
      .edge("workspace")
      .edge("role"),

    roles: defineEnt({
      isDefault: v.boolean(),
    })
      .field("name", vRole)
      .index("name", ["name"])
      .edges("permissions")
      .edges("members", { ref: true })
      .edges("invites", { ref: true }),

    permissions: defineEnt({})
      .field("name", vPermission)
      .index("name", ["name"])
      .edges("roles"),

    menuItemOverrides: defineEnt({
      featureId: v.string(),
      label: v.optional(v.string()),
      icon: v.optional(v.string()),
      hidden: v.optional(v.boolean()),
      order: v.optional(v.number()),
      groupIds: v.optional(v.array(v.string())),
      projectId: v.optional(v.string()),
    })
      .edge("workspace")
      .index("workspaceFeature", ["workspaceId", "featureId"]),

    messages: defineEnt({
      text: v.string(),
    })
      .edge("workspace")
      .edge("member"),
  }
);

export default schema;

export const entDefinitions = getEntDefinitions(schema);

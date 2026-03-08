import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const usersFeature = defineFeature({
    id: "users",
    label: "Users",
    route: "/dashboard/[teamSlug]/admin/users",
    order: 10,
    menuGroupIds: [PARENT_FEATURES.admin],
    requiredRoles: ["Admin"],
    projectId: "core",
});

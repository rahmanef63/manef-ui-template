import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const rolesFeature = defineFeature({
    id: "roles",
    label: "Roles",
    route: "/dashboard/[teamSlug]/admin/roles",
    order: 20,
    menuGroupIds: [PARENT_FEATURES.admin],
    requiredRoles: ["Admin"],
    projectId: "core",
});

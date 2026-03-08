import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const overviewFeature = defineFeature({
    id: "overview",
    label: "Overview",
    // icon: "dashboard", // Icon might be defined in parent or registry
    route: "/dashboard/[workspaceSlug]", // Sub-routes usually map to tabs
    order: 10,
    menuGroupIds: [PARENT_FEATURES.dashboard], // Grouping by parent
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

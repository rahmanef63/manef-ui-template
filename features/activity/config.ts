import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const activityFeature = defineFeature({
    id: "activity",
    label: "Activity",
    route: "/dashboard/[workspaceSlug]/activity",
    order: 30,
    menuGroupIds: [PARENT_FEATURES.control],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

import { defineFeature } from "@/shared/config/feature";

export const resourcesFeature = defineFeature({
    id: "resources",
    label: "Resources",
    icon: "BookOpen",
    route: "/dashboard/[workspaceSlug]/resources",
    order: 100,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

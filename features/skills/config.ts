import { defineFeature } from "@/shared/config/feature";

export const skillsFeature = defineFeature({
    id: "skills",
    label: "Skills",
    icon: "Zap",
    route: "/dashboard/[workspaceSlug]/skills",
    order: 20,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

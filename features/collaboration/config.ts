import { defineFeature } from "@/shared/config/feature";

export const collaborationFeature = defineFeature({
    id: "collaboration",
    label: "Collaboration",
    icon: "Briefcase",
    route: "/dashboard/[workspaceSlug]/collaboration",
    order: 40,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

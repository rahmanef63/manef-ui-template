import { defineFeature } from "@/shared/config/feature";

export const usageFeature = defineFeature({
    id: "usage",
    label: "Usage",
    icon: "BarChart2",
    route: "/dashboard/[workspaceSlug]/usage",
    order: 40,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

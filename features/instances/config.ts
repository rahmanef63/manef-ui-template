import { defineFeature } from "@/shared/config/feature";

export const instancesFeature = defineFeature({
    id: "instances",
    label: "Instances",
    icon: "Radio",
    route: "/dashboard/[workspaceSlug]/instances",
    order: 20,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

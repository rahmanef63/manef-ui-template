import { defineFeature } from "@/shared/config/feature";

export const debugFeature = defineFeature({
    id: "debug",
    label: "Debug",
    icon: "Bug",
    route: "/dashboard/[workspaceSlug]/debug",
    order: 20,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

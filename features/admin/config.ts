import { defineFeature } from "@/shared/config/feature";

export const adminFeature = defineFeature({
    id: "admin",
    label: "Admin",
    icon: "Shield",
    route: "/dashboard/[workspaceSlug]/admin",
    order: 80,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin"],
    projectId: "core",
});

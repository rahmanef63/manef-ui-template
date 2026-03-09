import { defineFeature } from "@/shared/config/feature";

export const configFeature = defineFeature({
    id: "config",
    label: "Config",
    icon: "Settings",
    route: "/dashboard/[workspaceSlug]/config",
    order: 10,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

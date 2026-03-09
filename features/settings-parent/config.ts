import { defineFeature } from "@/shared/config/feature";

export const settingsFeature = defineFeature({
    id: "settings-parent",
    label: "Settings",
    icon: "Settings",
    route: "/dashboard/[workspaceSlug]/settings",
    order: 90,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

import { defineFeature } from "@/shared/config/feature";

export const channelsFeature = defineFeature({
    id: "channels",
    label: "Channels",
    icon: "Link",
    route: "/dashboard/[workspaceSlug]/channels",
    order: 10,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

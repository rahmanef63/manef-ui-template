import { defineFeature } from "@/shared/config/feature";

export const nodesFeature = defineFeature({
    id: "nodes",
    label: "Nodes",
    icon: "Monitor",
    route: "/dashboard/[workspaceSlug]/nodes",
    order: 30,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

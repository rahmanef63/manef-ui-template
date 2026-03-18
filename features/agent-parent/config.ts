import { defineFeature } from "@/shared/config/feature";

export const agentFeature = defineFeature({
    id: "agent",
    label: "Agent",
    icon: "Bot",
    route: "/dashboard/[workspaceSlug]/agent",
    order: 30,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

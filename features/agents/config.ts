import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const agentsFeature = defineFeature({
    id: "agents",
    label: "Agents",
    route: "/dashboard/[workspaceSlug]/chat/agents",
    order: 20,
    menuGroupIds: [PARENT_FEATURES.chat],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

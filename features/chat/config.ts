import { defineFeature } from "@/shared/config/feature";

export const chatFeature = defineFeature({
    id: "chat",
    label: "Chat",
    icon: "MessageSquare",
    route: "/dashboard/[workspaceSlug]/chat",
    order: 30,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

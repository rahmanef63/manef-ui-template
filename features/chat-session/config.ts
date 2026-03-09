import { defineFeature } from "@/shared/config/feature";

export const chatSessionFeature = defineFeature({
    id: "chat-session",
    label: "Chat",
    icon: "MessageSquare",
    route: "/dashboard/[workspaceSlug]/chat-session",
    order: 10,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

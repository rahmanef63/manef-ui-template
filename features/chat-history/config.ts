import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const historyFeature = defineFeature({
    id: "chat-history",
    label: "History",
    route: "/dashboard/[teamSlug]/chat/history",
    order: 30,
    menuGroupIds: [PARENT_FEATURES.chat],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

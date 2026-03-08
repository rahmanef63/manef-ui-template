import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const inboxFeature = defineFeature({
    id: "inbox",
    label: "Inbox",
    route: "/dashboard/[teamSlug]/chat/inbox",
    order: 10,
    menuGroupIds: [PARENT_FEATURES.chat],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

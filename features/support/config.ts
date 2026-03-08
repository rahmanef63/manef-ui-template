import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const supportFeature = defineFeature({
    id: "support",
    label: "Support",
    route: "/dashboard/[teamSlug]/help/support",
    order: 30,
    menuGroupIds: [PARENT_FEATURES.help],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

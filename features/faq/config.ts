import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const faqFeature = defineFeature({
    id: "faq",
    label: "FAQ",
    route: "/dashboard/[workspaceSlug]/help/faq",
    order: 20,
    menuGroupIds: [PARENT_FEATURES.resources],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

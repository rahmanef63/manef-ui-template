import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const docsFeature = defineFeature({
    id: "docs",
    label: "Documentation",
    route: "/dashboard/[teamSlug]/help/docs",
    order: 10,
    menuGroupIds: [PARENT_FEATURES.help],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

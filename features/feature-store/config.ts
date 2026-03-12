import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const featureStoreFeature = defineFeature({
    id: "feature-store",
    label: "Feature Store",
    route: "/dashboard/[workspaceSlug]/admin/feature-store",
    order: 25,
    menuGroupIds: [PARENT_FEATURES.admin],
    requiredRoles: ["Admin"],
    projectId: "core",
});

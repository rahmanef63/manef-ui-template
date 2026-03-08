import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const kpiFeature = defineFeature({
    id: "kpi",
    label: "KPI",
    route: "/dashboard/[workspaceSlug]/kpi",
    order: 20,
    menuGroupIds: [PARENT_FEATURES.dashboard],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

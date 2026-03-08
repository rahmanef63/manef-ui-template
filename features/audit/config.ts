import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const auditFeature = defineFeature({
    id: "audit",
    label: "Audit",
    route: "/dashboard/[workspaceSlug]/admin/audit",
    order: 30,
    menuGroupIds: [PARENT_FEATURES.admin],
    requiredRoles: ["Admin"],
    projectId: "core",
});

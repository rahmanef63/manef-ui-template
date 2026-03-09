import { defineFeature } from "@/shared/config/feature";

export const sessionsFeature = defineFeature({
    id: "sessions",
    label: "Sessions",
    icon: "FileText",
    route: "/dashboard/[workspaceSlug]/sessions",
    order: 30,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

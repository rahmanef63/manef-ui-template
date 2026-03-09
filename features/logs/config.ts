import { defineFeature } from "@/shared/config/feature";

export const logsFeature = defineFeature({
    id: "logs",
    label: "Logs",
    icon: "FileClock",
    route: "/dashboard/[workspaceSlug]/logs",
    order: 30,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

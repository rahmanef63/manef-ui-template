import { defineFeature } from "@/shared/config/feature";

export const cronsFeature = defineFeature({
    id: "crons",
    label: "Cron Jobs",
    icon: "Clock",
    route: "/dashboard/[workspaceSlug]/crons",
    order: 50,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

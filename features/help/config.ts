import { defineFeature } from "@/shared/config/feature";

export const helpFeature = defineFeature({
    id: "help",
    label: "Help",
    icon: "CircleHelp",
    route: "/dashboard/[teamSlug]/help",
    order: 90,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

import { defineFeature } from "@/shared/config/feature";

export const controlFeature = defineFeature({
    id: "control",
    label: "Control",
    icon: "SlidersHorizontal",
    route: "/dashboard/[workspaceSlug]/control",
    order: 20,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

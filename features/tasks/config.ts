import { defineFeature } from "@/shared/config/feature";

export const tasksFeature = defineFeature({
    id: "tasks",
    label: "Tasks",
    icon: "CheckSquare",
    route: "/dashboard/[workspaceSlug]/tasks",
    order: 20,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

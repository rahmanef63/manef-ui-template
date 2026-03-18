import { defineFeature } from "@/shared/config/feature";

export const teamTasksFeature = defineFeature({
    id: "team-tasks",
    label: "Team Tasks",
    icon: "Kanban",
    route: "/dashboard/[workspaceSlug]/team-tasks",
    order: 20,
    menuGroupIds: ["core"],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

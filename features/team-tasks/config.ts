import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const teamTasksFeature = defineFeature({
    id: "team-tasks",
    label: "Team Tasks",
    route: "/dashboard/[teamSlug]/tasks/team",
    order: 20,
    menuGroupIds: [PARENT_FEATURES.tasks],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

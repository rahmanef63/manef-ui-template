import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const calendarTasksFeature = defineFeature({
    id: "calendar",
    label: "Calendar",
    route: "/dashboard/[workspaceSlug]/tasks/calendar",
    order: 30,
    menuGroupIds: [PARENT_FEATURES.tasks],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

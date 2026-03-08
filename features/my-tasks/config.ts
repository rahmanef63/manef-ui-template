import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const myTasksFeature = defineFeature({
    id: "my-tasks",
    label: "My Tasks",
    route: "/dashboard/[workspaceSlug]/tasks/my",
    order: 10,
    menuGroupIds: [PARENT_FEATURES.tasks],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

import { defineFeature } from "@/shared/config/feature";
import { PARENT_FEATURES } from "@/project/registry/navigation";

export const workspaceTasksFeature = defineFeature({
    id: "workspace-tasks",
    label: "Workspace Tasks",
    route: "/dashboard/[workspaceSlug]/tasks/workspace",
    order: 20,
    menuGroupIds: [PARENT_FEATURES.collaboration],
    requiredRoles: ["Admin", "Member"],
    projectId: "core",
});

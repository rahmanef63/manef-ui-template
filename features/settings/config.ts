import { defineFeature } from "@/shared/config/feature";

export const settingsFeature = defineFeature({
  id: "settings",
  label: "Settings",
  icon: "settings",
  route: "/dashboard/[workspaceSlug]/settings",
  order: 90,
  menuGroupIds: ["settings"],
  requiredRoles: ["Admin", "Member"],
  projectId: "core",
  related: ["members"],
});

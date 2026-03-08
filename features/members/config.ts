import { defineFeature } from "@/shared/config/feature";

export const membersFeature = defineFeature({
  id: "members",
  label: "Members",
  icon: "users",
  route: "/dashboard/[teamSlug]/settings/members",
  order: 100,
  menuGroupIds: ["settings"],
  requiredRoles: ["Admin", "Member"],
  projectId: "core",
  related: ["settings"],
});

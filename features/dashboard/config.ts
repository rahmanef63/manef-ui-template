import { defineFeature } from "@/shared/config/feature";

export const dashboardFeature = defineFeature({
  id: "dashboard",
  label: "Dashboard",
  icon: "LayoutDashboard",
  route: "/dashboard/[teamSlug]",
  order: 10,
  menuGroupIds: ["core"],
  requiredRoles: ["Admin", "Member"],
  projectId: "core",
});

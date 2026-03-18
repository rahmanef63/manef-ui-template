export const APP_ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  dashboardWorkspace(workspaceSlug: string) {
    return `/dashboard/${workspaceSlug}`;
  },
} as const;

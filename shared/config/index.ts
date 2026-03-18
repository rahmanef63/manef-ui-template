export { buildMenu } from "./menu";
export { defineFeature } from "./feature";
export { featureRegistry, menuGroupRegistry } from "./registry";
export { iconRegistry, resolveIcon } from "./icons";

// New menu system exports
// New menu system exports
export { MENU_CATALOG } from "./menu-catalog";
export type { MenuTab, MenuCatalogItem, MenuId } from "./menu-catalog";

export {
  PORTAL_CONFIG,
  DEFAULT_BOTTOM_NAV,
  MORE_ITEM,
  getPortalConfig,
} from "./portal-config";
export type { PortalConfigItem, PortalSidebarConfig, PortalId } from "./portal-config";

export {
  normalizeBottomNav,
  buildSidebarTree,
  getPageTabs,
  getMenuFromPath,
  getActiveTab,
} from "./menu-utils";
export type { SidebarGroup, SidebarMenuItem, BottomNavItem } from "./menu-utils";

export type {
  FeatureManifest,
  MenuGroupManifest,
  MenuItemOverride,
  ResolvedMenuGroup,
  ResolvedMenuItem,
} from "./types";

export { NAVIGATION_REGISTRY } from "@/project/registry/navigation";


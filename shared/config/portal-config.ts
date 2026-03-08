/**
 * PORTAL_CONFIG - Portal/Brand menu mapping
 *
 * Tiap brand/portal memiliki set menu yang berbeda.
 * Config ini hanya menyimpan IDs; detail label/icon/href/tabs tetap di MENU_CATALOG.
 */

import type { MenuId } from "./menu-catalog";

export interface PortalSidebarConfig {
    main: MenuId[];
    admin: MenuId[];
}

export interface PortalConfigItem {
    label: string;
    sidebar: PortalSidebarConfig;
    bottomNav: MenuId[];
}

export const PORTAL_CONFIG: Record<string, PortalConfigItem> = {
    default: {
        label: "Default Portal",
        sidebar: {
            main: ["dashboard", "tasks", "chat"],
            admin: ["help"],
        },
        bottomNav: ["dashboard", "tasks", "chat", "notifications", "profile"],
    },

    "zian-inn:staff": {
        label: "Zian Inn • Staff",
        sidebar: {
            main: ["dashboard", "tasks", "operations", "chat"],
            admin: ["help"],
        },
        bottomNav: ["dashboard", "tasks", "chat", "notifications", "profile"],
    },

    "zian-inn:owner": {
        label: "Zian Inn • Owner",
        sidebar: {
            main: ["dashboard", "operations", "finance", "tasks", "chat"],
            admin: ["admin", "help"],
        },
        bottomNav: ["dashboard", "tasks", "chat", "notifications", "profile"],
    },

    "zian-inn:superadmin": {
        label: "Zian Inn • SuperAdmin",
        sidebar: {
            main: ["dashboard", "operations", "finance", "tasks", "chat"],
            admin: ["admin", "help"],
        },
        bottomNav: ["dashboard", "tasks", "chat", "notifications", "profile"],
    },

    "superspace:builder": {
        label: "SuperSpace • Builder",
        sidebar: {
            main: ["dashboard", "tasks", "chat"],
            admin: ["admin", "help"],
        },
        bottomNav: ["dashboard", "tasks", "chat", "notifications", "profile"],
    },

    "pekerja-ai:pm": {
        label: "Pekerja AI • PM",
        sidebar: {
            main: ["dashboard", "tasks", "chat"],
            admin: ["help"],
        },
        bottomNav: ["dashboard", "tasks", "chat", "notifications", "profile"],
    },
} as const;

/**
 * Default bottom nav pattern - 5 items
 */
export const DEFAULT_BOTTOM_NAV: MenuId[] = [
    "dashboard",
    "tasks",
    "chat",
    "notifications",
    "profile",
];

/**
 * "More" item for bottom nav when less than 5 items
 */
export const MORE_ITEM = {
    id: "more",
    label: "More",
    icon: "Menu",
    action: "toggleSidebar",
} as const;

export type PortalId = keyof typeof PORTAL_CONFIG;

export function getPortalConfig(portalId: string): PortalConfigItem {
    return PORTAL_CONFIG[portalId] ?? PORTAL_CONFIG.default;
}

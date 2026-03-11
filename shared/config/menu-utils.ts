/**
 * Menu Utilities
 *
 * Helper functions for menu system:
 * - normalizeBottomNav: normalize bottom nav to 5 items
 * - buildSidebarTree: build sidebar menu tree from PORTAL_CONFIG
 * - getPageTabs: get tabs for page from MENU_CATALOG
 * - getMenuFromPath: resolve active menu from pathname
 */

import { NAVIGATION_REGISTRY } from "@/project/registry/navigation";
import { featureRegistry } from "./registry";
import { type MenuId, type MenuTab, type MenuCatalogItem } from "./menu-catalog";
import type { FeatureManifest } from "./types";
import {
    getPortalConfig,
    DEFAULT_BOTTOM_NAV,
    MORE_ITEM,
} from "./portal-config";

export interface SidebarGroup {
    id: string;
    label: string;
    items: SidebarMenuItem[];
}

export interface SidebarMenuItem {
    id: MenuId;
    label: string;
    icon: string;
    href: string;
    tabs: MenuTab[];
}

export interface BottomNavItem {
    id: string;
    label: string;
    icon: string;
    href?: string;
    action?: string;
}

/**
 * Helper to resolve route with workspace slug
 *
 * All menu items should be scoped under /dashboard/[workspaceSlug]/...
 * except for specific cases or external links.
 */
function resolveRoute(href: string, workspaceSlug?: string): string {
    if (!workspaceSlug) return href;
    if (href.startsWith("http")) return href;

    // Handle root dashboard path
    if (href === "/dashboard") {
        return `/dashboard/${workspaceSlug}`;
    }

    // Handle paths that already have placeholders
    if (href.includes("[workspaceSlug]")) {
        return href.replace("[workspaceSlug]", workspaceSlug);
    }

    // Handle root paths that should be under dashboard (e.g. /tasks -> /dashboard/slug/tasks)
    // Ensure we don't double-prefix if href already starts with /dashboard
    if (href.startsWith("/") && !href.startsWith("/dashboard")) {
        return `/dashboard/${workspaceSlug}${href}`;
    }

    // If path is already /dashboard/something, ensure we inject slug if needed
    // This handles cases where url might be /dashboard/settings but needs slug
    // Ideally paths should use [workspaceSlug] placeholder, but this is a fallback
    if (href.startsWith("/dashboard/")) {
        // If it doesn't look like it has a slug segment manually added
        const parts = href.split('/');
        if (parts[2] !== workspaceSlug && parts[2] !== "[workspaceSlug]") {
            // This is ambiguous without strict convention, assuming inputs from MENU_CATALOG
            // are mostly root paths like /tasks, /chat etc.
            // For now, trust inputs unless they are explicitly /dashboard root.
        }
    }

    return href;
}

function resolveFeatureHref(feature: FeatureManifest, workspaceSlug?: string): string {
    const navConfig: { children: readonly string[]; defaultChild?: string } | undefined =
        feature.id in NAVIGATION_REGISTRY
            ? (NAVIGATION_REGISTRY[
                feature.id as keyof typeof NAVIGATION_REGISTRY
            ] as { children: readonly string[]; defaultChild?: string })
            : undefined;
    if (!navConfig) {
        return resolveRoute(feature.route, workspaceSlug);
    }

    const defaultChildId = navConfig.defaultChild ?? navConfig.children[0];
    const defaultChild = featureRegistry.find((item) => item.id === defaultChildId) as FeatureManifest | undefined;
    if (!defaultChild) {
        return resolveRoute(feature.route, workspaceSlug);
    }

    return resolveRoute(defaultChild.route, workspaceSlug);
}


/**
 * Normalize bottom nav to always have 5 items.
 *
 * Rules:
 * 1. Use portal.bottomNav if available
 * 2. If less than 5, auto-fill from DEFAULT_BOTTOM_NAV
 * 3. If still less than 5, add "More" item
 */
export function normalizeBottomNav(
    portalId: string,
    workspaceSlug?: string,
    availableMenuIds?: MenuId[]
): BottomNavItem[] {
    const config = getPortalConfig(portalId);
    const result: BottomNavItem[] = [];
    const usedIds = new Set<string>();

    // Helper to check if menu is available
    const isAvailable = (id: MenuId) => {
        if (!availableMenuIds) return true;
        return availableMenuIds.includes(id);
    };

    // Helper to add item from featureRegistry
    const addFromRegistry = (id: string): boolean => {
        if (usedIds.has(id) || !isAvailable(id)) return false;

        const feature = featureRegistry.find(f => f.id === id) as FeatureManifest | undefined;
        if (!feature) return false;

        usedIds.add(id);

        // FeatureManifest extends IconEntity, so icon is optional but present in type
        const icon = feature.icon;

        result.push({
            id: feature.id,
            label: feature.label,
            icon: icon ?? "Menu", // Default icon if missing
            href: resolveFeatureHref(feature, workspaceSlug),
        });
        return true;
    };

    // 1. Add items from portal config
    for (const id of config.bottomNav) {
        if (result.length >= 5) break;
        addFromRegistry(id);
    }

    // 2. Auto-fill from default if less than 5
    if (result.length < 5) {
        for (const id of DEFAULT_BOTTOM_NAV) {
            if (result.length >= 5) break;
            addFromRegistry(id);
        }
    }

    // 3. Add "More" if still less than 5
    while (result.length < 5) {
        if (!usedIds.has("more")) {
            usedIds.add("more");
            result.push({
                id: MORE_ITEM.id,
                label: MORE_ITEM.label,
                icon: MORE_ITEM.icon,
                action: MORE_ITEM.action,
            });
        } else {
            break; // Prevent infinite loop
        }
    }

    return result.slice(0, 5);
}


/**
 * Build sidebar menu tree from PORTAL_CONFIG
 */
export function buildSidebarTree(portalId: string, workspaceSlug?: string): SidebarGroup[] {
    const config = getPortalConfig(portalId);
    const groups: SidebarGroup[] = [];

    const resolveItem = (id: string): SidebarMenuItem | null => {
        const feature = featureRegistry.find(f => f.id === id) as FeatureManifest | undefined;
        if (!feature) return null;

        // Get children from NAVIGATION_REGISTRY if any
        // We use keyof typeof NAVIGATION_REGISTRY checking to avoid any
        let tabs: MenuTab[] = [];
        if (id in NAVIGATION_REGISTRY) {
            const navConfig = NAVIGATION_REGISTRY[id as keyof typeof NAVIGATION_REGISTRY];
            tabs = navConfig.children.map((childId: string) => {
                const childFeature = featureRegistry.find(f => f.id === childId) as FeatureManifest | undefined;
                if (!childFeature) return null;
                return {
                    id: childFeature.id,
                    label: childFeature.label,
                    href: resolveRoute(childFeature.route, workspaceSlug),
                };
            }).filter(Boolean) as MenuTab[];
        }

        const icon = feature.icon;

        return {
            id: feature.id,
            label: feature.label,
            icon: icon ?? "Menu", // Fallback
            href: resolveFeatureHref(feature, workspaceSlug),
            tabs,
        };
    };

    // Main group
    if (config.sidebar.main.length > 0) {
        groups.push({
            id: "main",
            label: "Main",
            items: config.sidebar.main
                .map(resolveItem)
                .filter(Boolean) as SidebarMenuItem[],
        });
    }

    // Admin group
    if (config.sidebar.admin.length > 0) {
        groups.push({
            id: "admin",
            label: "Admin",
            items: config.sidebar.admin
                .map(resolveItem)
                .filter(Boolean) as SidebarMenuItem[],
        });
    }

    return groups;
}


/**
 * Get menu tabs for a specific menu
 */
export function getPageTabs(menuId: string): MenuTab[] {
    // Check if menuId exists in registry
    if (!(menuId in NAVIGATION_REGISTRY)) return [];

    // access with type safety
    const parent = NAVIGATION_REGISTRY[menuId as keyof typeof NAVIGATION_REGISTRY];
    if (!parent || !parent.children) return [];

    return parent.children.map((childId: string) => {
        const feature = featureRegistry.find(f => f.id === childId) as FeatureManifest | undefined;
        if (!feature) return null;
        return {
            id: feature.id,
            label: feature.label,
            href: feature.route
        };
    }).filter(Boolean) as MenuTab[];
}

/**
 * Helper to match route against pathname and extract params
 */
function matchRoute(route: string, pathname: string): Record<string, string> | null {
    // Escape regex characters except brackets
    const pattern = route.replace(/\[([^\]]+)\]/g, "(?<$1>[^/]+)");
    const regex = new RegExp(`^${pattern}(/|$)`);
    const match = pathname.match(regex);
    return match ? match.groups || {} : null;
}

/**
 * Resolve active menu from pathname
 */
export function getMenuFromPath(pathname: string): MenuCatalogItem | null {
    // 1. Find the feature that matches the pathname best (longest match)
    // Flatten registry to find all relevant features.
    const allIds = new Set<string>();
    Object.entries(NAVIGATION_REGISTRY).forEach(([parentId, config]: [string, any]) => {
        allIds.add(parentId);
        config.children.forEach((childId: string) => allIds.add(childId));
    });

    const matches = featureRegistry
        .filter(f => allIds.has(f.id))
        .map(f => {
            const params = matchRoute(f.route, pathname);
            return { feature: f as FeatureManifest, params };
        })
        .filter(m => m.params !== null)
        .sort((a, b) => b.feature.route.length - a.feature.route.length);

    if (matches.length === 0) return null;

    const { feature, params } = matches[0];
    const workspaceSlug = params?.workspaceSlug;

    // 2. Determine Parent
    let parentId = feature.id;
    let parentFeature = feature;

    // Check if it's a child
    for (const [pId, config] of Object.entries(NAVIGATION_REGISTRY) as [string, any][]) {
        if (config.children.includes(feature.id)) {
            parentId = pId;
            parentFeature = featureRegistry.find(f => f.id === parentId) as FeatureManifest | undefined || feature;
            break;
        }
    }

    // 3. Construct MenuCatalogItem (resembling the old structure)
    // Validate parentId against registry keys
    if (!(parentId in NAVIGATION_REGISTRY)) return null;

    const navConfig = NAVIGATION_REGISTRY[parentId as keyof typeof NAVIGATION_REGISTRY];

    const tabs = navConfig.children.map((childId: string) => {
        const childFeature = featureRegistry.find(f => f.id === childId) as FeatureManifest | undefined;
        if (!childFeature) return null;
        return {
            id: childFeature.id,
            label: childFeature.label,
            href: resolveRoute(childFeature.route, workspaceSlug),
        };
    }).filter(Boolean) as MenuTab[];

    return {
        id: parentFeature.id,
        label: parentFeature.label,
        icon: parentFeature.icon ?? "Menu",
        href: resolveFeatureHref(parentFeature, workspaceSlug),
        tabs,
    };
}

/**
 * Get active tab from pathname
 */
export function getActiveTab(pathname: string): MenuTab | null {
    const menu = getMenuFromPath(pathname);
    if (!menu) return null;

    // Find exact tab match
    // We sort by length descending to match most specific route first (e.g. /tasks/my vs /tasks)
    const sortedTabs = [...menu.tabs].sort((a, b) => b.href.length - a.href.length);

    for (const tab of sortedTabs) {
        if (pathname === tab.href || pathname.startsWith(tab.href + "/")) {
            return tab as MenuTab;
        }
    }

    // Default to first tab
    return menu.tabs[0] as MenuTab || null;
}

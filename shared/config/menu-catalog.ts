export type MenuId = string;

export interface MenuTab {
    id: string;
    label: string;
    href: string;
}

export interface MenuCatalogItem {
    id: string;
    label: string;
    icon: any; // using any to avoid type drilling
    href: string;
    tabs: MenuTab[];
}

/**
 * @deprecated Use NAVIGATION_REGISTRY in project/registry/navigation instead
 */
export const MENU_CATALOG: Record<string, MenuCatalogItem> = {};

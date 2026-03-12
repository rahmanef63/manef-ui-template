"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";
import { getMenuFromPath, getActiveTab } from "@/shared/config";
import type { MenuTab } from "@/shared/config";
import { cn } from "@/lib/utils";

interface PageTabsBlockProps {
    className?: string;
}

export function PageTabsBlock({ className }: PageTabsBlockProps) {
    const pathname = usePathname();
    const navigator = useOpenClawNavigator();

    const menu = React.useMemo(() => getMenuFromPath(pathname), [pathname]);
    const activeTab = React.useMemo(() => getActiveTab(pathname), [pathname]);
    const visibleTabs = React.useMemo(() => {
        if (!menu) {
            return [];
        }
        const featureKeys = navigator.selectedScope?.featureKeys ?? [];
        if (featureKeys.length === 0) {
            return menu.tabs;
        }
        return menu.tabs.filter((tab) => featureKeys.includes(tab.id));
    }, [menu, navigator.selectedScope?.featureKeys]);

    if (!menu || visibleTabs.length === 0) {
        return null;
    }

    return (
        <div className={cn("border-b", className)}>
            <nav className="flex gap-1 overflow-x-auto px-4 py-2" role="tablist">
                {visibleTabs.map((tab: MenuTab) => {
                    const isActive = activeTab?.id === tab.id;

                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            role="tab"
                            aria-selected={isActive}
                            className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

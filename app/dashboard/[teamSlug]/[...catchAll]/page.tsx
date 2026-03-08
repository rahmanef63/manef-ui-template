"use client";

import { Suspense, useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import { FEATURE_REGISTRY } from "@/features/registry";
import { getMenuFromPath, getActiveTab } from "@/shared/config/menu-utils";
import { Loader2 } from "lucide-react";
import { PageTabsBlock } from "@/shared/block/ui/layout/PageTabsBlock";

export default function CatchAllPage() {
    const params = useParams();

    // params.catchAll is string[] e.g. ['tasks', 'my'] or ['tasks'] or ['dashboard', 'overview']
    const catchAll = params?.catchAll;
    const teamSlug = params?.teamSlug;

    const segments = Array.isArray(catchAll) ? catchAll : [];

    // Reconstruct the path to match against registry
    // The path is relative to /dashboard/[teamSlug]/...
    const pathSuffix = segments.join("/");
    const fullPath = `/dashboard/${teamSlug}/${pathSuffix}`;

    const { Component, isFound } = useMemo(() => {
        if (!teamSlug || segments.length === 0) return { Component: null, isFound: false };

        // 1. Resolve which feature maps to this path using our robust matcher
        // We use getActiveTab because it finds the specific leaf node (tab) matching the route
        const activeTab = getActiveTab(fullPath);

        if (!activeTab) {
            return { Component: null, isFound: false };
        }

        const featureId = activeTab.id;

        // 2. Lookup component in registry
        const Component = FEATURE_REGISTRY[featureId];

        if (!Component) {
            console.warn(`Feature found for path ${fullPath} (id: ${featureId}) but no component registered in FEATURE_REGISTRY`);
            return { Component: null, isFound: false };
        }

        return { Component, isFound: true };
    }, [fullPath, teamSlug, segments]);

    if (!isFound || !Component) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6">
            <PageTabsBlock />
            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            }>
                <Component />
            </Suspense>
        </div>
    );
}

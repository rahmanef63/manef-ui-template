"use client";

import { Suspense, useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import { FEATURE_REGISTRY } from "@/features/registry";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";
import { getActiveTab } from "@/shared/config/menu-utils";
import { Loader2 } from "lucide-react";
import { PageTabsBlock } from "@/shared/block/ui/layout/PageTabsBlock";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";

export default function CatchAllPage() {
    const params = useParams();
    const navigator = useOpenClawNavigator();

    // params.catchAll is string[] e.g. ['tasks', 'my'] or ['tasks'] or ['dashboard', 'overview']
    const catchAll = params?.catchAll;
    const workspaceSlug = params?.workspaceSlug;

    const segments = Array.isArray(catchAll) ? catchAll : [];

    // Reconstruct the path to match against registry
    // The path is relative to /dashboard/[workspaceSlug]/...
    const pathSuffix = segments.join("/");
    const fullPath = `/dashboard/${workspaceSlug}/${pathSuffix}`;

    const { Component, isFound, featureId } = useMemo(() => {
        if (!workspaceSlug || segments.length === 0) return { Component: null, isFound: false, featureId: null };

        // 1. Resolve which feature maps to this path using our robust matcher
        // We use getActiveTab because it finds the specific leaf node (tab) matching the route
        const activeTab = getActiveTab(fullPath);

        if (!activeTab) {
            return { Component: null, isFound: false, featureId: null };
        }

        const featureId = activeTab.id;

        // 2. Lookup component in registry
        const Component = FEATURE_REGISTRY[featureId];

        if (!Component) {
            console.warn(`Feature found for path ${fullPath} (id: ${featureId}) but no component registered in FEATURE_REGISTRY`);
            return { Component: null, isFound: false, featureId };
        }

        return { Component, isFound: true, featureId };
    }, [fullPath, workspaceSlug, segments]);

    const hasWorkspaceFeatureAccess =
        !featureId ||
        !navigator.selectedScope?.featureKeys?.length ||
        navigator.selectedScope.featureKeys.includes(featureId);

    if (!isFound || !Component || !hasWorkspaceFeatureAccess) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6">
            <PageTabsBlock />
            <ErrorBoundary>
                <Suspense fallback={
                    <div className="rounded-xl border bg-card p-12 flex items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading feature...</span>
                    </div>
                }>
                    <Component />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
}

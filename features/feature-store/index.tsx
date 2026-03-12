// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import { Box, Blocks, Code2, LayoutTemplate, Package2, Rocket } from "lucide-react";
import { appApi, useAppMutation, useAppQuery } from "@/lib/convex/client";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const ICON_MAP = {
    AppWindow: Box,
    Blocks,
    Code2,
    LayoutTemplate,
    Package2,
    Rocket,
};

const SCOPE_LABELS = {
    "workspace-local": "Workspace Local",
    "workspace-shared": "Workspace Shared",
    "general/shared": "General Shared",
    "tenant-shared": "Tenant Shared",
};

export default function FeatureStorePage() {
    const { selectedScope } = useOpenClawNavigator();
    const [filter, setFilter] = useState("");
    const [scopeFilter, setScopeFilter] = useState("all");
    const items = useAppQuery(appApi.features.featureStore.api.listFeatureStoreItems, {
        workspaceId: selectedScope?._id,
        q: filter || undefined,
        scope: scopeFilter === "all" ? undefined : scopeFilter,
    }) as any[] | undefined;
    const installItem = useAppMutation(appApi.features.featureStore.api.installFeatureStoreItem);
    const uninstallItem = useAppMutation(appApi.features.featureStore.api.uninstallFeatureStoreItem);
    const seedCatalog = useAppMutation(appApi.features.featureStore.api.seedFeatureStoreCatalog);
    const [busyKey, setBusyKey] = useState<string | null>(null);
    const [seeding, setSeeding] = useState(false);

    const scopeOptions = useMemo(
        () => [
            { value: "all", label: "All scopes" },
            { value: "workspace-local", label: "Workspace Local" },
            { value: "workspace-shared", label: "Workspace Shared" },
            { value: "general/shared", label: "General Shared" },
            { value: "tenant-shared", label: "Tenant Shared" },
        ],
        [],
    );

    const handleSeed = async () => {
        setSeeding(true);
        try {
            await seedCatalog({});
        } finally {
            setSeeding(false);
        }
    };

    const handleToggleInstall = async (item: any) => {
        if (!selectedScope?._id) {
            return;
        }
        setBusyKey(item.itemKey);
        try {
            if (item.isInstalled) {
                await uninstallItem({
                    workspaceId: selectedScope._id,
                    itemKey: item.itemKey,
                });
            } else {
                await installItem({
                    workspaceId: selectedScope._id,
                    itemKey: item.itemKey,
                });
            }
        } finally {
            setBusyKey(null);
        }
    };

    if (items === undefined) {
        return (
            <div className="space-y-6 px-4 lg:px-6">
                <PageHeader
                    title="Feature Store"
                    description="Catalog and install workspace-aware features."
                />
                <div className="grid gap-4 lg:grid-cols-2">
                    <Skeleton className="h-[260px] rounded-xl" />
                    <Skeleton className="h-[260px] rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Feature Store"
                description={`Live catalog for ${selectedScope?.name ?? "the active workspace"} with install state stored in manef-db.`}
            >
                <Button variant="outline" onClick={handleSeed} disabled={seeding}>
                    {seeding ? "Seeding..." : "Seed Catalog"}
                </Button>
            </PageHeader>

            <div className="grid gap-3 lg:grid-cols-[2fr,1fr]">
                <Input
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    placeholder="Search feature store items"
                    className="bg-muted/50"
                />
                <select
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                    value={scopeFilter}
                    onChange={(event) => setScopeFilter(event.target.value)}
                >
                    {scopeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {!selectedScope?._id ? (
                <div className="rounded-xl border border-dashed bg-muted/10">
                    <EmptyState
                        icon={Package2}
                        message="Pilih workspace aktif dulu sebelum menginstal item dari Feature Store."
                        className="py-20"
                    />
                </div>
            ) : items.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/10">
                    <EmptyState
                        icon={Package2}
                        message="Belum ada item di Feature Store. Seed catalog backend untuk mulai memakai store."
                        className="py-20"
                    />
                </div>
            ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                    {items.map((item) => {
                        const Icon = ICON_MAP[item.icon] ?? Package2;
                        return (
                            <Card key={item.itemKey} className="border-border/70">
                                <CardHeader className="space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                                <CardTitle className="text-base">{item.name}</CardTitle>
                                            </div>
                                            <CardDescription>{item.description}</CardDescription>
                                        </div>
                                        <Badge variant={item.isInstalled ? "default" : "secondary"}>
                                            {item.isInstalled ? "Installed" : "Available"}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <Badge variant="outline">{item.itemType}</Badge>
                                        <Badge variant="outline">
                                            {SCOPE_LABELS[item.scope] ?? item.scope}
                                        </Badge>
                                        <Badge variant="outline">{item.status}</Badge>
                                        {item.builderMode ? (
                                            <Badge variant="outline">{item.builderMode}</Badge>
                                        ) : null}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {item.preview ? (
                                        <div className="rounded-lg border bg-muted/20 p-4">
                                            <div className="text-sm font-medium">
                                                {item.preview.headline ?? "Preview"}
                                            </div>
                                            {item.preview.summary ? (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {item.preview.summary}
                                                </p>
                                            ) : null}
                                            {item.preview.bullets?.length ? (
                                                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                                                    {item.preview.bullets.map((bullet: string) => (
                                                        <li key={bullet}>- {bullet}</li>
                                                    ))}
                                                </ul>
                                            ) : null}
                                        </div>
                                    ) : null}

                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                        {(item.tags ?? []).map((tag: string) => (
                                            <span key={tag} className="rounded-md border px-2 py-1">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-xs text-muted-foreground">
                                            Scope target: {selectedScope.name}
                                        </div>
                                        <Button
                                            onClick={() => handleToggleInstall(item)}
                                            disabled={busyKey === item.itemKey}
                                        >
                                            {busyKey === item.itemKey
                                                ? "Saving..."
                                                : item.isInstalled
                                                    ? "Uninstall"
                                                    : "Install"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

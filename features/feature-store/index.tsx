// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    BarChart2,
    Blocks,
    Bot,
    Box,
    Bug,
    Clock,
    Code2,
    FileClock,
    FileText,
    History,
    Inbox,
    LayoutDashboard,
    LayoutTemplate,
    Link,
    MessageSquare,
    Monitor,
    Package2,
    Rocket,
    Settings,
    Shield,
    ShieldCheck,
    Store,
    Users,
    Zap,
} from "lucide-react";
import { appApi, useAppMutation, useAppQuery } from "@/lib/convex/client";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";
import { CodeBlock, EmptyState, PageHeader, SectionCard, StatCard } from "@/shared/block/ui/openclaw-blocks";
import { DiscoveryToolbar } from "@/shared/block/ui/layout/DiscoveryToolbar";
import { ThreePanelLayout } from "@/shared/block/ui/layout/ThreePanelLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const ICON_MAP = {
    BarChart2,
    Bot,
    AppWindow: Box,
    Blocks,
    Bug,
    Clock,
    Code2,
    FileClock,
    FileText,
    History,
    Inbox,
    LayoutTemplate,
    LayoutDashboard,
    Link,
    MessageSquare,
    Monitor,
    Package2,
    Rocket,
    Settings,
    Shield,
    ShieldCheck,
    Store,
    Users,
    Zap,
};

const SCOPE_LABELS = {
    "workspace-local": "Workspace Local",
    "workspace-shared": "Workspace Shared",
    "general/shared": "General Shared",
    "tenant-shared": "Tenant Shared",
};

const DRAFT_STATUS_LABELS = {
    draft: "Draft",
    ready: "Ready",
    archived: "Archived",
};

function createDefaultJsonBlocks(scope: { name?: string; agentIds?: string[]; featureKeys?: string[] } | null | undefined) {
    return JSON.stringify(
        [
            {
                type: "page_header",
                title: `${scope?.name ?? "Workspace"} App`,
                description: "App draft preview generated from Agent Builder.",
            },
            {
                type: "stats",
                items: [
                    { label: "Agents", value: String(scope?.agentIds?.length ?? 0), description: "Linked workspace agents" },
                    { label: "Features", value: String(scope?.featureKeys?.length ?? 0), description: "Installed workspace features" },
                ],
            },
            {
                type: "section_card",
                title: "Next step",
                description: "Refine blocks before publishing downstream.",
                body: "This preview uses the minimal json_blocks renderer in manef-ui.",
            },
        ],
        null,
        2,
    );
}

function parseJsonBlocks(rawValue: string) {
    if (!rawValue.trim()) {
        return { blocks: [], error: null as string | null };
    }
    try {
        const parsed = JSON.parse(rawValue);
        if (!Array.isArray(parsed)) {
            return { blocks: [], error: "json_blocks must be an array of blocks." };
        }
        return { blocks: parsed, error: null as string | null };
    } catch (error) {
        return {
            blocks: [],
            error: error instanceof Error ? error.message : "Invalid JSON",
        };
    }
}

function JsonBlocksPreview({ blocks, error }: { blocks: any[]; error: string | null }) {
    if (error) {
        return <CodeBlock title="json_blocks error">{error}</CodeBlock>;
    }
    if (!blocks.length) {
        return (
            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                Tambahkan blocks JSON untuk melihat preview.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {blocks.map((block, index) => {
                const key = `${block?.type ?? "unknown"}:${index}`;
                switch (block?.type) {
                    case "page_header":
                        return (
                            <PageHeader
                                key={key}
                                title={block.title ?? "Untitled app"}
                                description={block.description}
                                className="rounded-xl border bg-muted/10 p-4"
                            />
                        );
                    case "stats":
                        return (
                            <div key={key} className="grid gap-3 md:grid-cols-2">
                                {(block.items ?? []).map((item: any, itemIndex: number) => (
                                    <StatCard
                                        key={`${key}:stat:${itemIndex}`}
                                        label={item.label ?? `Metric ${itemIndex + 1}`}
                                        value={item.value ?? "-"}
                                        description={item.description}
                                        status={item.status ?? "neutral"}
                                    />
                                ))}
                            </div>
                        );
                    case "section_card":
                        return (
                            <SectionCard
                                key={key}
                                title={block.title ?? "Section"}
                                description={block.description}
                            >
                                <div className="text-sm text-muted-foreground">
                                    {block.body ?? "No body provided."}
                                </div>
                            </SectionCard>
                        );
                    case "key_values":
                        return (
                            <SectionCard
                                key={key}
                                title={block.title ?? "Details"}
                                description={block.description}
                            >
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {(block.items ?? []).map((item: any, itemIndex: number) => (
                                        <div
                                            key={`${key}:kv:${itemIndex}`}
                                            className="flex items-center justify-between border-b pb-2 last:border-b-0"
                                        >
                                            <span>{item.label ?? `Field ${itemIndex + 1}`}</span>
                                            <span className="font-medium text-foreground">
                                                {item.value ?? "-"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        );
                    case "callout":
                        return (
                            <SectionCard
                                key={key}
                                title={block.title ?? "Callout"}
                                description={block.tone ? `tone: ${block.tone}` : undefined}
                                variant={block.tone === "highlight" ? "highlight" : "default"}
                            >
                                <div className="text-sm text-muted-foreground">
                                    {block.body ?? "No content provided."}
                                </div>
                            </SectionCard>
                        );
                    default:
                        return (
                            <CodeBlock key={key} title={`Unsupported block: ${block?.type ?? "unknown"}`}>
                                {JSON.stringify(block, null, 2)}
                            </CodeBlock>
                        );
                }
            })}
        </div>
    );
}

export default function FeatureStorePage() {
    const { selectedScope } = useOpenClawNavigator();
    const [filter, setFilter] = useState("");
    const [scopeFilter, setScopeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("installed");
    const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);
    const items = useAppQuery(appApi.features.featureStore.api.listFeatureStoreItems, {
        workspaceId: selectedScope?._id,
        q: filter || undefined,
        scope: scopeFilter === "all" ? undefined : scopeFilter,
    }) as any[] | undefined;
    const capabilityPolicy = useAppQuery(
        appApi.features.featureStore.api.getWorkspaceCapabilityPolicy,
        selectedScope?._id ? { workspaceId: selectedScope._id } : "skip",
    ) as
        | {
            featureKeys: string[];
            grantedSkillKeys: string[];
            agentPolicies: Array<{ agentId: string; skillKeys: string[]; sourceItemKeys: string[] }>;
        }
        | undefined;
    const installItem = useAppMutation(appApi.features.featureStore.api.installFeatureStoreItem);
    const uninstallItem = useAppMutation(appApi.features.featureStore.api.uninstallFeatureStoreItem);
    const seedCatalog = useAppMutation(appApi.features.featureStore.api.seedFeatureStoreCatalog);
    const drafts = useAppQuery(appApi.features.featureStore.api.listAgentBuilderDrafts, selectedScope?._id
        ? { workspaceId: selectedScope._id }
        : "skip") as any[] | undefined;
    const createDraft = useAppMutation(appApi.features.featureStore.api.createAgentBuilderDraft);
    const updateDraft = useAppMutation(appApi.features.featureStore.api.updateAgentBuilderDraft);
    const archiveDraft = useAppMutation(appApi.features.featureStore.api.archiveAgentBuilderDraft);
    const [busyKey, setBusyKey] = useState<string | null>(null);
    const [seeding, setSeeding] = useState(false);
    const [draftDialogOpen, setDraftDialogOpen] = useState(false);
    const [draftBusy, setDraftBusy] = useState(false);
    const [activeDraftItem, setActiveDraftItem] = useState<any | null>(null);
    const [editingDraft, setEditingDraft] = useState<any | null>(null);
    const [draftForm, setDraftForm] = useState({
        name: "",
        appSlug: "",
        description: "",
        builderMode: "json_blocks",
        linkedAgentIds: "",
        linkedChannelKeys: "",
        requiredFeatureKeys: "",
        requiredSkillKeys: "",
        previewHeadline: "",
        previewSummary: "",
        outputNotes: "",
        jsonBlocks: "",
        downstreamTarget: "superspace",
    });

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
    const sortOptions = useMemo(
        () => [
            { value: "installed", label: "Installed first" },
            { value: "name", label: "Name A-Z" },
            { value: "type", label: "Type" },
            { value: "builder", label: "Builder first" },
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

    const builderItems = useMemo(
        () => (items ?? []).filter((item) => item.itemType === "agent-builder"),
        [items],
    );
    const sortedItems = useMemo(() => {
        const next = [...(items ?? [])];
        next.sort((left, right) => {
            switch (sortBy) {
                case "name":
                    return left.name.localeCompare(right.name, "en");
                case "type":
                    return `${left.itemType}:${left.name}`.localeCompare(`${right.itemType}:${right.name}`, "en");
                case "builder":
                    if (left.itemType === right.itemType) {
                        return left.name.localeCompare(right.name, "en");
                    }
                    return left.itemType === "agent-builder" ? -1 : 1;
                case "installed":
                default:
                    if (Boolean(left.isInstalled) !== Boolean(right.isInstalled)) {
                        return left.isInstalled ? -1 : 1;
                    }
                    return left.name.localeCompare(right.name, "en");
            }
        });
        return next;
    }, [items, sortBy]);

    useEffect(() => {
        if (!sortedItems.length) {
            setSelectedItemKey(null);
            return;
        }
        if (!selectedItemKey || !sortedItems.some((item) => item.itemKey === selectedItemKey)) {
            setSelectedItemKey(sortedItems[0].itemKey);
        }
    }, [selectedItemKey, sortedItems]);

    const selectedItem = useMemo(
        () => sortedItems.find((item) => item.itemKey === selectedItemKey) ?? sortedItems[0] ?? null,
        [selectedItemKey, sortedItems],
    );

    useEffect(() => {
        if (!draftDialogOpen) {
            return;
        }
        if (editingDraft) {
            setDraftForm({
                name: editingDraft.name ?? "",
                appSlug: editingDraft.appSlug ?? "",
                description: editingDraft.description ?? "",
                builderMode: editingDraft.builderMode ?? activeDraftItem?.builderMode ?? "json_blocks",
                linkedAgentIds: (editingDraft.linkedAgentIds ?? []).join(", "),
                linkedChannelKeys: (editingDraft.linkedChannelKeys ?? []).join(", "),
                requiredFeatureKeys: (editingDraft.requiredFeatureKeys ?? []).join(", "),
                requiredSkillKeys: (editingDraft.requiredSkillKeys ?? []).join(", "),
                previewHeadline: editingDraft.previewConfig?.headline ?? "",
                previewSummary: editingDraft.previewConfig?.summary ?? "",
                outputNotes: editingDraft.outputConfig?.notes ?? "",
                jsonBlocks: JSON.stringify(editingDraft.outputConfig?.jsonBlocks ?? [], null, 2),
                downstreamTarget: editingDraft.downstreamTarget ?? "superspace",
            });
            return;
        }
        setDraftForm({
            name: activeDraftItem ? `${selectedScope?.name ?? "Workspace"} ${activeDraftItem.name}` : "",
            appSlug: activeDraftItem?.slug ?? "",
            description: "",
            builderMode: activeDraftItem?.builderMode ?? "json_blocks",
            linkedAgentIds: (selectedScope?.agentIds ?? []).join(", "),
            linkedChannelKeys: "",
            requiredFeatureKeys: activeDraftItem?.featureKey ? [activeDraftItem.featureKey].join(", ") : "",
            requiredSkillKeys: (activeDraftItem?.grantedSkillKeys ?? []).join(", "),
            previewHeadline: activeDraftItem?.preview?.headline ?? "",
            previewSummary: activeDraftItem?.preview?.summary ?? "",
            outputNotes: "",
            jsonBlocks:
                activeDraftItem?.builderMode === "json_blocks"
                    ? createDefaultJsonBlocks(selectedScope)
                    : "",
            downstreamTarget: "superspace",
        });
    }, [activeDraftItem, draftDialogOpen, editingDraft, selectedScope]);

    const handleOpenCreateDraft = (item: any) => {
        setActiveDraftItem(item);
        setEditingDraft(null);
        setDraftDialogOpen(true);
    };

    const handleOpenEditDraft = (draft: any) => {
        const matchedItem = builderItems.find((item) => item.itemKey === draft.itemKey) ?? null;
        setActiveDraftItem(matchedItem);
        setEditingDraft(draft);
        setDraftDialogOpen(true);
    };

    const parseCommaList = (value: string) =>
        value
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean);

    const draftCapabilityPreview = useMemo(() => {
        const workspaceFeatureKeys = capabilityPolicy?.featureKeys ?? selectedScope?.featureKeys ?? [];
        const workspaceSkillKeys = capabilityPolicy?.grantedSkillKeys ?? [];
        const availableAgentIds = selectedScope?.agentIds ?? [];
        const requiredFeatureKeys = parseCommaList(draftForm.requiredFeatureKeys);
        const requiredSkillKeys = parseCommaList(draftForm.requiredSkillKeys);
        const linkedAgentIds = parseCommaList(draftForm.linkedAgentIds);
        const agentPolicies = new Map(
            (capabilityPolicy?.agentPolicies ?? []).map((policy) => [policy.agentId, policy.skillKeys]),
        );
        const missingFeatureKeys = requiredFeatureKeys.filter(
            (featureKey) => !workspaceFeatureKeys.includes(featureKey),
        );
        const missingWorkspaceSkillKeys = requiredSkillKeys.filter(
            (skillKey) => !workspaceSkillKeys.includes(skillKey),
        );
        const unavailableAgentIds = linkedAgentIds.filter(
            (agentId) => !availableAgentIds.includes(agentId),
        );
        const agentCoverage = linkedAgentIds.map((agentId) => {
            const grantedSkillKeys = agentPolicies.get(agentId) ?? [];
            return {
                agentId,
                missingSkillKeys: requiredSkillKeys.filter(
                    (skillKey) => !grantedSkillKeys.includes(skillKey),
                ),
            };
        });
        return {
            missingFeatureKeys,
            missingWorkspaceSkillKeys,
            unavailableAgentIds,
            agentCoverage,
            isReady:
                missingFeatureKeys.length === 0 &&
                missingWorkspaceSkillKeys.length === 0 &&
                unavailableAgentIds.length === 0 &&
                agentCoverage.every((entry) => entry.missingSkillKeys.length === 0),
        };
    }, [
        capabilityPolicy?.agentPolicies,
        capabilityPolicy?.featureKeys,
        capabilityPolicy?.grantedSkillKeys,
        draftForm.linkedAgentIds,
        draftForm.requiredFeatureKeys,
        draftForm.requiredSkillKeys,
        selectedScope?.agentIds,
        selectedScope?.featureKeys,
    ]);
    const jsonBlocksPreview = useMemo(
        () => parseJsonBlocks(draftForm.jsonBlocks),
        [draftForm.jsonBlocks],
    );

    const handleSaveDraft = async () => {
        if (!selectedScope?._id || !activeDraftItem) {
            return;
        }
        if (draftForm.builderMode === "json_blocks" && jsonBlocksPreview.error) {
            return;
        }
        setDraftBusy(true);
        try {
            const payload = {
                name: draftForm.name,
                appSlug: draftForm.appSlug,
                description: draftForm.description || undefined,
                linkedAgentIds: parseCommaList(draftForm.linkedAgentIds),
                linkedChannelKeys: parseCommaList(draftForm.linkedChannelKeys),
                requiredFeatureKeys: parseCommaList(draftForm.requiredFeatureKeys),
                requiredSkillKeys: parseCommaList(draftForm.requiredSkillKeys),
                previewConfig: {
                    headline: draftForm.previewHeadline || undefined,
                    summary: draftForm.previewSummary || undefined,
                },
                outputConfig: {
                    notes: draftForm.outputNotes || undefined,
                    jsonBlocks: draftForm.builderMode === "json_blocks"
                        ? jsonBlocksPreview.blocks
                        : undefined,
                },
                downstreamTarget: draftForm.downstreamTarget || undefined,
            };

            if (editingDraft?._id) {
                await updateDraft({
                    draftId: editingDraft._id,
                    ...payload,
                    status: editingDraft.status === "ready" ? "ready" : "draft",
                });
            } else {
                await createDraft({
                    workspaceId: selectedScope._id,
                    itemKey: activeDraftItem.itemKey,
                    builderMode: draftForm.builderMode,
                    ...payload,
                });
            }
            setDraftDialogOpen(false);
        } finally {
            setDraftBusy(false);
        }
    };

    const handleMarkReady = async (draft: any) => {
        await updateDraft({
            draftId: draft._id,
            status: "ready",
            name: draft.name,
            appSlug: draft.appSlug,
            description: draft.description,
            linkedAgentIds: draft.linkedAgentIds,
            linkedChannelKeys: draft.linkedChannelKeys,
            requiredFeatureKeys: draft.requiredFeatureKeys,
            requiredSkillKeys: draft.requiredSkillKeys,
            previewConfig: draft.previewConfig,
            outputConfig: draft.outputConfig,
            downstreamTarget: draft.downstreamTarget,
        });
    };

    const handleArchiveDraft = async (draft: any) => {
        await archiveDraft({ draftId: draft._id });
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

            <DiscoveryToolbar
                searchValue={filter}
                onSearchChange={setFilter}
                searchPlaceholder="Search feature store items"
                summary={
                    selectedScope?._id
                        ? `${sortedItems.length} items in ${selectedScope.name}. Left panel to browse, center for details, right panel for workspace capability and builder drafts.`
                        : "Pilih workspace aktif dulu agar store bisa dipakai."
                }
                filters={[
                    {
                        label: "Scope",
                        value: scopeFilter,
                        onChange: setScopeFilter,
                        options: scopeOptions,
                    },
                    {
                        label: "Sort",
                        value: sortBy,
                        onChange: setSortBy,
                        options: sortOptions,
                    },
                ]}
            />

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
                <ThreePanelLayout
                    left={{
                        title: "Catalog",
                        description: "Browse store items by scope, install state, and builder type.",
                        children: (
                            <div className="space-y-3">
                                {sortedItems.map((item) => {
                                    const Icon = ICON_MAP[item.icon] ?? Package2;
                                    const isActive = selectedItem?.itemKey === item.itemKey;
                                    return (
                                        <button
                                            key={item.itemKey}
                                            type="button"
                                            onClick={() => setSelectedItemKey(item.itemKey)}
                                            className={[
                                                "w-full rounded-xl border p-3 text-left transition-colors",
                                                isActive
                                                    ? "border-primary bg-primary/5"
                                                    : "hover:bg-muted/40",
                                            ].join(" ")}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                                        <div className="truncate text-sm font-medium">{item.name}</div>
                                                    </div>
                                                    <div className="line-clamp-2 text-xs text-muted-foreground">
                                                        {item.description}
                                                    </div>
                                                </div>
                                                <Badge variant={item.isInstalled ? "default" : "secondary"}>
                                                    {item.isInstalled ? "On" : "Off"}
                                                </Badge>
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                                                <span className="rounded-md border px-2 py-1">{item.itemType}</span>
                                                <span className="rounded-md border px-2 py-1">
                                                    {SCOPE_LABELS[item.scope] ?? item.scope}
                                                </span>
                                                {item.builderMode ? (
                                                    <span className="rounded-md border px-2 py-1">{item.builderMode}</span>
                                                ) : null}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ),
                    }}
                    center={{
                        title: selectedItem?.name ?? "Details",
                        description: selectedItem?.description ?? "Pilih item di panel kiri untuk melihat detail dan aksi.",
                        children: selectedItem ? (
                            <div className="space-y-4">
                                {selectedItem.preview ? (
                                    <div className="rounded-lg border bg-muted/20 p-4">
                                        <div className="text-sm font-medium">
                                            {selectedItem.preview.headline ?? "Preview"}
                                        </div>
                                        {selectedItem.preview.summary ? (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {selectedItem.preview.summary}
                                            </p>
                                        ) : null}
                                        {selectedItem.preview.bullets?.length ? (
                                            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                                                {selectedItem.preview.bullets.map((bullet: string) => (
                                                    <li key={bullet}>- {bullet}</li>
                                                ))}
                                            </ul>
                                        ) : null}
                                    </div>
                                ) : null}

                                <div className="flex flex-wrap gap-2 text-xs">
                                    <Badge variant="outline">{selectedItem.itemType}</Badge>
                                    <Badge variant="outline">
                                        {SCOPE_LABELS[selectedItem.scope] ?? selectedItem.scope}
                                    </Badge>
                                    <Badge variant="outline">{selectedItem.status}</Badge>
                                    {selectedItem.builderMode ? (
                                        <Badge variant="outline">{selectedItem.builderMode}</Badge>
                                    ) : null}
                                    {(selectedItem.tags ?? []).map((tag: string) => (
                                        <span key={tag} className="rounded-md border px-2 py-1 text-muted-foreground">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid gap-3 rounded-lg border bg-muted/10 p-4 text-sm text-muted-foreground">
                                    <div>
                                        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground">
                                            Feature key
                                        </div>
                                        <div>{selectedItem.featureKey ?? "-"}</div>
                                        <div className="break-all text-xs">{selectedItem.route ?? "-"}</div>
                                    </div>
                                    <div>
                                        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground">
                                            Grants skills
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(selectedItem.grantedSkillKeys ?? []).length ? (
                                                selectedItem.grantedSkillKeys.map((skill: string) => (
                                                    <span key={skill} className="rounded-md border px-2 py-1 text-xs">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground">
                                            Runtime domains
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(selectedItem.runtimeDomains ?? []).length ? (
                                                selectedItem.runtimeDomains.map((domain: string) => (
                                                    <span key={domain} className="rounded-md border px-2 py-1 text-xs">
                                                        {domain}
                                                    </span>
                                                ))
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </div>
                                        {(selectedItem.requiredRoles ?? []).length ? (
                                            <div className="mt-2 text-xs">
                                                Roles: {selectedItem.requiredRoles.join(", ")}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/10 p-4">
                                    <div className="text-xs text-muted-foreground">
                                        Scope target: {selectedScope.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {selectedItem.itemType === "agent-builder" ? (
                                            <Button
                                                variant="outline"
                                                onClick={() => handleOpenCreateDraft(selectedItem)}
                                            >
                                                New Draft
                                            </Button>
                                        ) : null}
                                        <Button
                                            onClick={() => handleToggleInstall(selectedItem)}
                                            disabled={busyKey === selectedItem.itemKey}
                                        >
                                            {busyKey === selectedItem.itemKey
                                                ? "Saving..."
                                                : selectedItem.isInstalled
                                                    ? "Uninstall"
                                                    : "Install"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <EmptyState message="Select a store item to inspect details." icon={Package2} />
                        ),
                    }}
                    right={{
                        title: "Workspace Context",
                        description: "Capability state and builder drafts for the active workspace.",
                        children: (
                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    <div className="rounded-lg border bg-muted/10 p-4">
                                        <div className="text-sm font-medium">Installed features</div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {(capabilityPolicy?.featureKeys ?? selectedScope.featureKeys ?? []).length ? (
                                                (capabilityPolicy?.featureKeys ?? selectedScope.featureKeys ?? []).map((featureKey: string) => (
                                                    <span key={featureKey} className="rounded-md border px-2 py-1 text-xs">
                                                        {featureKey}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No explicit feature policy yet.</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="rounded-lg border bg-muted/10 p-4">
                                        <div className="text-sm font-medium">Granted skills</div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {(capabilityPolicy?.grantedSkillKeys ?? []).length ? (
                                                capabilityPolicy?.grantedSkillKeys.map((skillKey: string) => (
                                                    <span key={skillKey} className="rounded-md border px-2 py-1 text-xs">
                                                        {skillKey}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No skills granted from installed features.</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="rounded-lg border bg-muted/10 p-4">
                                        <div className="text-sm font-medium">Agent policy rows</div>
                                        <div className="mt-2 space-y-2 text-xs">
                                            {(capabilityPolicy?.agentPolicies ?? []).length ? (
                                                capabilityPolicy?.agentPolicies.map((policy) => (
                                                    <div key={policy.agentId} className="rounded-md border px-3 py-2">
                                                        <div className="font-medium">{policy.agentId}</div>
                                                        <div className="mt-1 text-muted-foreground">
                                                            {policy.skillKeys.join(", ") || "-"}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-sm text-muted-foreground">No agent-specific capability policy yet.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium">Agent Builder Drafts</div>
                                    {drafts === undefined ? (
                                        <Skeleton className="h-24 rounded-xl" />
                                    ) : drafts.length === 0 ? (
                                        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                            Belum ada draft builder untuk workspace ini.
                                        </div>
                                    ) : (
                                        drafts.map((draft) => (
                                            <div
                                                key={draft._id}
                                                className="flex flex-col gap-3 rounded-lg border p-4"
                                            >
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="font-medium">{draft.name}</div>
                                                <Badge variant="outline">
                                                    {DRAFT_STATUS_LABELS[draft.status] ?? draft.status}
                                                </Badge>
                                                <Badge variant="outline">{draft.builderMode}</Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                slug: {draft.appSlug}
                                            </div>
                                            {draft.description ? (
                                                <p className="text-sm text-muted-foreground">
                                                    {draft.description}
                                                </p>
                                            ) : null}
                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                            <span className="rounded-md border px-2 py-1">
                                                item: {draft.itemKey}
                                                </span>
                                                <span className="rounded-md border px-2 py-1">
                                                    agents: {(draft.linkedAgentIds ?? []).length}
                                                </span>
                                                <span className="rounded-md border px-2 py-1">
                                                    channels: {(draft.linkedChannelKeys ?? []).length}
                                                </span>
                                                <span className="rounded-md border px-2 py-1">
                                                    required features: {(draft.requiredFeatureKeys ?? []).length}
                                                </span>
                                                <span className="rounded-md border px-2 py-1">
                                                    required skills: {(draft.requiredSkillKeys ?? []).length}
                                                </span>
                                                <span className="rounded-md border px-2 py-1">
                                                    capability: {draft.capabilityReport?.isReady ? "ready" : "missing requirements"}
                                                </span>
                                            </div>
                                            {draft.capabilityReport && !draft.capabilityReport.isReady ? (
                                                <div className="space-y-2 rounded-md border bg-muted/20 p-3 text-xs text-muted-foreground">
                                                    {draft.capabilityReport.missingFeatureKeys.length ? (
                                                        <div>
                                                            Missing features: {draft.capabilityReport.missingFeatureKeys.join(", ")}
                                                        </div>
                                                    ) : null}
                                                    {draft.capabilityReport.missingWorkspaceSkillKeys.length ? (
                                                        <div>
                                                            Missing workspace skills: {draft.capabilityReport.missingWorkspaceSkillKeys.join(", ")}
                                                        </div>
                                                    ) : null}
                                                    {draft.capabilityReport.unavailableAgentIds.length ? (
                                                        <div>
                                                            Agents outside workspace: {draft.capabilityReport.unavailableAgentIds.join(", ")}
                                                        </div>
                                                    ) : null}
                                                    {draft.capabilityReport.agentCoverage
                                                        .filter((coverage) => coverage.missingSkillKeys.length)
                                                        .map((coverage) => (
                                                            <div key={coverage.agentId}>
                                                                {coverage.agentId} missing skills: {coverage.missingSkillKeys.join(", ")}
                                                            </div>
                                                        ))}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" onClick={() => handleOpenEditDraft(draft)}>
                                                Edit
                                            </Button>
                                            {draft.status !== "ready" ? (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleMarkReady(draft)}
                                                    disabled={!draft.capabilityReport?.isReady}
                                                >
                                                    Mark Ready
                                                </Button>
                                            ) : null}
                                                <Button variant="destructive" onClick={() => handleArchiveDraft(draft)}>
                                                    Archive
                                                </Button>
                                            </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ),
                    }}
                />
            )}

            <Dialog open={draftDialogOpen} onOpenChange={setDraftDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingDraft ? "Edit Agent Builder Draft" : "New Agent Builder Draft"}
                        </DialogTitle>
                        <DialogDescription>
                            Simpan contract draft dulu. Renderer app final belum dibangun di phase ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="draft-name">Draft name</Label>
                            <Input
                                id="draft-name"
                                value={draftForm.name}
                                onChange={(event) =>
                                    setDraftForm((current) => ({ ...current, name: event.target.value }))
                                }
                            />
                        </div>
                        <div className="grid gap-2 lg:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="draft-slug">App slug</Label>
                                <Input
                                    id="draft-slug"
                                    value={draftForm.appSlug}
                                    onChange={(event) =>
                                        setDraftForm((current) => ({ ...current, appSlug: event.target.value }))
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="draft-mode">Builder mode</Label>
                                <select
                                    id="draft-mode"
                                    className="h-10 rounded-md border bg-background px-3 text-sm"
                                    value={draftForm.builderMode}
                                    onChange={(event) =>
                                        setDraftForm((current) => ({ ...current, builderMode: event.target.value }))
                                    }
                                    disabled={Boolean(editingDraft)}
                                >
                                    <option value="json_blocks">json_blocks</option>
                                    <option value="custom_code">custom_code</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="draft-description">Description</Label>
                            <Textarea
                                id="draft-description"
                                value={draftForm.description}
                                onChange={(event) =>
                                    setDraftForm((current) => ({ ...current, description: event.target.value }))
                                }
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-2 lg:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="draft-agents">Linked agent IDs</Label>
                                <Input
                                    id="draft-agents"
                                    value={draftForm.linkedAgentIds}
                                    onChange={(event) =>
                                        setDraftForm((current) => ({
                                            ...current,
                                            linkedAgentIds: event.target.value,
                                        }))
                                    }
                                    placeholder="main, irul, irul-kuliah"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="draft-channels">Linked channel keys</Label>
                                <Input
                                    id="draft-channels"
                                    value={draftForm.linkedChannelKeys}
                                    onChange={(event) =>
                                        setDraftForm((current) => ({
                                            ...current,
                                            linkedChannelKeys: event.target.value,
                                        }))
                                    }
                                    placeholder="whatsapp, telegram"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 lg:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="draft-required-features">Required feature keys</Label>
                                <Input
                                    id="draft-required-features"
                                    value={draftForm.requiredFeatureKeys}
                                    onChange={(event) =>
                                        setDraftForm((current) => ({
                                            ...current,
                                            requiredFeatureKeys: event.target.value,
                                        }))
                                    }
                                    placeholder="feature-store, agents, channels"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="draft-required-skills">Required skill keys</Label>
                                <Input
                                    id="draft-required-skills"
                                    value={draftForm.requiredSkillKeys}
                                    onChange={(event) =>
                                        setDraftForm((current) => ({
                                            ...current,
                                            requiredSkillKeys: event.target.value,
                                        }))
                                    }
                                    placeholder="agent-management, channel-routing"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 lg:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="draft-headline">Preview headline</Label>
                                <Input
                                    id="draft-headline"
                                    value={draftForm.previewHeadline}
                                    onChange={(event) =>
                                        setDraftForm((current) => ({
                                            ...current,
                                            previewHeadline: event.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="draft-target">Downstream target</Label>
                                <Input
                                    id="draft-target"
                                    value={draftForm.downstreamTarget}
                                    onChange={(event) =>
                                        setDraftForm((current) => ({
                                            ...current,
                                            downstreamTarget: event.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="draft-summary">Preview summary</Label>
                            <Textarea
                                id="draft-summary"
                                value={draftForm.previewSummary}
                                onChange={(event) =>
                                    setDraftForm((current) => ({
                                        ...current,
                                        previewSummary: event.target.value,
                                    }))
                                }
                                rows={2}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="draft-notes">Output notes</Label>
                            <Textarea
                                id="draft-notes"
                                value={draftForm.outputNotes}
                                onChange={(event) =>
                                    setDraftForm((current) => ({
                                        ...current,
                                        outputNotes: event.target.value,
                                    }))
                                }
                                rows={3}
                            />
                        </div>
                        {draftForm.builderMode === "json_blocks" ? (
                            <div className="grid gap-2">
                                <Label htmlFor="draft-json-blocks">json_blocks</Label>
                                <Textarea
                                    id="draft-json-blocks"
                                    value={draftForm.jsonBlocks}
                                    onChange={(event) =>
                                        setDraftForm((current) => ({
                                            ...current,
                                            jsonBlocks: event.target.value,
                                        }))
                                    }
                                    rows={14}
                                    className="font-mono text-xs"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Preview ini hanya mendukung block aman:
                                    `page_header`, `stats`, `section_card`, `key_values`, dan `callout`.
                                </p>
                            </div>
                        ) : null}
                        <div className="rounded-lg border bg-muted/10 p-4 text-sm">
                            <div className="font-medium">Capability check</div>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                <span className="rounded-md border px-2 py-1">
                                    status: {draftCapabilityPreview.isReady ? "ready" : "needs policy"}
                                </span>
                                <span className="rounded-md border px-2 py-1">
                                    workspace features: {(capabilityPolicy?.featureKeys ?? selectedScope?.featureKeys ?? []).length}
                                </span>
                                <span className="rounded-md border px-2 py-1">
                                    workspace skills: {(capabilityPolicy?.grantedSkillKeys ?? []).length}
                                </span>
                                <span className="rounded-md border px-2 py-1">
                                    workspace agents: {(selectedScope?.agentIds ?? []).length}
                                </span>
                            </div>
                            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                                {draftCapabilityPreview.missingFeatureKeys.length ? (
                                    <div>
                                        Missing features: {draftCapabilityPreview.missingFeatureKeys.join(", ")}
                                    </div>
                                ) : null}
                                {draftCapabilityPreview.missingWorkspaceSkillKeys.length ? (
                                    <div>
                                        Missing workspace skills: {draftCapabilityPreview.missingWorkspaceSkillKeys.join(", ")}
                                    </div>
                                ) : null}
                                {draftCapabilityPreview.unavailableAgentIds.length ? (
                                    <div>
                                        Agents outside workspace: {draftCapabilityPreview.unavailableAgentIds.join(", ")}
                                    </div>
                                ) : null}
                                {draftCapabilityPreview.agentCoverage
                                    .filter((entry) => entry.missingSkillKeys.length)
                                    .map((entry) => (
                                        <div key={entry.agentId}>
                                            {entry.agentId} missing skills: {entry.missingSkillKeys.join(", ")}
                                        </div>
                                    ))}
                                {draftCapabilityPreview.isReady ? (
                                    <div className="text-foreground">
                                        Draft requirement sudah cocok dengan capability workspace aktif.
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        {draftForm.builderMode === "json_blocks" ? (
                            <div className="rounded-lg border bg-muted/10 p-4">
                                <div className="mb-3 font-medium">json_blocks preview</div>
                                <JsonBlocksPreview
                                    blocks={jsonBlocksPreview.blocks}
                                    error={jsonBlocksPreview.error}
                                />
                            </div>
                        ) : null}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDraftDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveDraft}
                            disabled={
                                draftBusy ||
                                !draftForm.name.trim() ||
                                (draftForm.builderMode === "json_blocks" && Boolean(jsonBlocksPreview.error))
                            }
                        >
                            {draftBusy ? "Saving..." : editingDraft ? "Update Draft" : "Create Draft"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

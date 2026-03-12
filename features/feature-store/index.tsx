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
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";
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
        previewHeadline: "",
        previewSummary: "",
        outputNotes: "",
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
                previewHeadline: editingDraft.previewConfig?.headline ?? "",
                previewSummary: editingDraft.previewConfig?.summary ?? "",
                outputNotes: editingDraft.outputConfig?.notes ?? "",
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
            previewHeadline: activeDraftItem?.preview?.headline ?? "",
            previewSummary: activeDraftItem?.preview?.summary ?? "",
            outputNotes: "",
            downstreamTarget: "superspace",
        });
    }, [activeDraftItem, draftDialogOpen, editingDraft, selectedScope?.agentIds, selectedScope?.name]);

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

    const handleSaveDraft = async () => {
        if (!selectedScope?._id || !activeDraftItem) {
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
                previewConfig: {
                    headline: draftForm.previewHeadline || undefined,
                    summary: draftForm.previewSummary || undefined,
                },
                outputConfig: {
                    notes: draftForm.outputNotes || undefined,
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
                <div className="space-y-6">
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

                                        <div className="grid gap-3 rounded-lg border bg-muted/10 p-3 text-xs text-muted-foreground lg:grid-cols-3">
                                            <div className="space-y-1">
                                                <div className="font-medium text-foreground">Feature key</div>
                                                <div>{item.featureKey ?? "-"}</div>
                                                <div className="break-all">{item.route ?? "-"}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="font-medium text-foreground">Grants skills</div>
                                                {(item.grantedSkillKeys ?? []).length ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.grantedSkillKeys.map((skill: string) => (
                                                            <span key={skill} className="rounded-md border px-2 py-1">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>-</div>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="font-medium text-foreground">Runtime domains</div>
                                                {(item.runtimeDomains ?? []).length ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {item.runtimeDomains.map((domain: string) => (
                                                            <span key={domain} className="rounded-md border px-2 py-1">
                                                                {domain}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>-</div>
                                                )}
                                                {(item.requiredRoles ?? []).length ? (
                                                    <div className="pt-1">
                                                        Roles: {item.requiredRoles.join(", ")}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-xs text-muted-foreground">
                                                Scope target: {selectedScope.name}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {item.itemType === "agent-builder" ? (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleOpenCreateDraft(item)}
                                                    >
                                                        New Draft
                                                    </Button>
                                                ) : null}
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
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <Card className="border-border/70">
                        <CardHeader>
                            <CardTitle className="text-base">Agent Builder Drafts</CardTitle>
                            <CardDescription>
                                Draft builder output per workspace. Ini baru contract/editor,
                                belum renderer final.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
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
                                        className="flex flex-col gap-3 rounded-lg border p-4 lg:flex-row lg:items-start lg:justify-between"
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
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" onClick={() => handleOpenEditDraft(draft)}>
                                                Edit
                                            </Button>
                                            {draft.status !== "ready" ? (
                                                <Button variant="outline" onClick={() => handleMarkReady(draft)}>
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
                        </CardContent>
                    </Card>
                </div>
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
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDraftDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveDraft} disabled={draftBusy || !draftForm.name.trim()}>
                            {draftBusy ? "Saving..." : editingDraft ? "Update Draft" : "Create Draft"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

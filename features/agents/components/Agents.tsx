// @ts-nocheck
"use client";

import { useState } from "react";
import { appApi, useAppMutation, useAppQuery } from "@/lib/convex/client";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Bot, FolderTree, MessagesSquare, Pencil, Radio, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";

export default function Agents() {
    const { selectedRoot, selectedScope, isAdmin } = useOpenClawNavigator();
    const agents: any[] = useAppQuery("features/agents/api:getAgents", {
        agentIds: selectedScope?.agentIds,
        ownerId: selectedRoot?.ownerId,
    }) || [];

    const updateAgent = useAppMutation(appApi.features.agents.api.updateAgent);

    const [editingAgent, setEditingAgent] = useState<any | null>(null);
    const [editForm, setEditForm] = useState({ name: "", model: "", description: "" });
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    const openEdit = (agent: any) => {
        setEditingAgent(agent);
        setEditForm({
            name: agent.name ?? "",
            model: agent.model ?? "",
            description: agent.description ?? "",
        });
        setEditError(null);
    };

    const handleSave = async () => {
        if (!editingAgent) return;
        setSaving(true);
        setEditError(null);
        try {
            await updateAgent({
                id: editingAgent._id,
                name: editForm.name || undefined,
                model: editForm.model || undefined,
                description: editForm.description || undefined,
            });
            setEditingAgent(null);
        } catch (err: any) {
            setEditError(err?.message || "Failed to update agent.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex-1 h-full flex flex-col space-y-4 p-4 md:p-8 pt-6">
            <PageHeader
                title="AI Agents"
                description="Live mirror of agent records in Convex for the selected OpenClaw scope."
            />

            <div className="flex-1 mt-4">
                {agents.length === 0 ? (
                    <EmptyState
                        icon={Bot}
                        message="Tidak ada agent pada scope aktif. Sinkronkan runtime OpenClaw agar daftar agent muncul di sini."
                        className="h-64 rounded-lg border border-dashed bg-muted/10"
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {agents.map((agent) => {
                            const boundChannels = Array.isArray(agent?.boundChannels)
                                ? agent.boundChannels
                                : [];
                            const sessionCount =
                                typeof agent?.sessionCount === "number"
                                    ? agent.sessionCount
                                    : 0;
                            const childCount =
                                typeof agent?.childCount === "number"
                                    ? agent.childCount
                                    : 0;

                            return (
                                <Card key={agent._id} className="shadow-sm hover:shadow-md transition-shadow group">
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div className="flex items-start space-x-3">
                                            <Avatar className="h-10 w-10 border shadow-sm">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    <Bot className="h-5 w-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg leading-none">{agent.name}</CardTitle>
                                                <p className="text-xs text-muted-foreground">{agent.agentId}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Badge variant={agent.status === "active" ? "default" : "secondary"} className="capitalize">
                                                {agent.status}
                                            </Badge>
                                            {isAdmin && agent.status !== "draft" && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => openEdit(agent)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-2">
                                        <p className="min-h-10 text-sm text-muted-foreground line-clamp-2">
                                            {agent.description || "No description provided."}
                                        </p>
                                        <div className="grid gap-2 text-xs text-muted-foreground">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="flex items-center gap-1.5">
                                                    <UserRound className="h-3.5 w-3.5" />
                                                    Owner
                                                </span>
                                                <span className="truncate text-right text-foreground">
                                                    {agent.ownerName || "Unassigned"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="flex items-center gap-1.5">
                                                    <FolderTree className="h-3.5 w-3.5" />
                                                    Workspace
                                                </span>
                                                <span className="truncate text-right text-foreground">
                                                    {agent.workspacePath || "Unknown"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="flex items-center gap-1.5">
                                                    <MessagesSquare className="h-3.5 w-3.5" />
                                                    Sessions
                                                </span>
                                                <span className="text-foreground">{sessionCount}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="flex items-center gap-1.5">
                                                    <Radio className="h-3.5 w-3.5" />
                                                    Channels
                                                </span>
                                                <span className="truncate text-right text-foreground">
                                                    {boundChannels.length > 0
                                                        ? boundChannels.join(", ")
                                                        : "No bindings"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            <Badge variant="outline" className="capitalize">
                                                {agent.role}
                                            </Badge>
                                            {agent.model ? (
                                                <Badge variant="outline">{agent.model}</Badge>
                                            ) : null}
                                            {childCount > 0 ? (
                                                <Badge variant="outline">
                                                    {childCount} child
                                                </Badge>
                                            ) : null}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Edit Agent Dialog */}
            <Dialog open={!!editingAgent} onOpenChange={(open) => { if (!open) setEditingAgent(null); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Agent</DialogTitle>
                        <DialogDescription>
                            Update agent metadata. Changes are written to Convex and queued for runtime write-through via outbox.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Name</Label>
                            <Input
                                value={editForm.name}
                                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="Agent name"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Model</Label>
                            <Input
                                value={editForm.model}
                                onChange={(e) => setEditForm((f) => ({ ...f, model: e.target.value }))}
                                placeholder="e.g. anthropic/claude-sonnet-4-6"
                            />
                            <p className="text-xs text-muted-foreground">
                                Changes model in Convex mirror and queues runtime update.
                            </p>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Description</Label>
                            <Input
                                value={editForm.description}
                                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                                placeholder="Short description"
                            />
                        </div>
                        {editError && <p className="text-xs text-red-500">{editError}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingAgent(null)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

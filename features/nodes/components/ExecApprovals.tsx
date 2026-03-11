// @ts-nocheck
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@manef/db/api";
import { SectionCard, Chip, EmptyState } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Server } from "lucide-react";

interface ExecApprovalsProps {
    agentIds: string[];
    defaultAgentId: string;
}

export function ExecApprovals({ agentIds, defaultAgentId }: ExecApprovalsProps) {
    const [activeChip, setActiveChip] = useState(defaultAgentId);
    const [selectedHost, setSelectedHost] = useState("gateway");
    const [securityMode, setSecurityMode] = useState("deny");
    const [askMode, setAskMode] = useState("on_miss");
    const [askFallback, setAskFallback] = useState("deny");
    const [autoAllowSkillClis, setAutoAllowSkillClis] = useState(false);
    const [isSaving, startSaving] = useTransition();

    const nodes = (useQuery as any)((api as any).features.nodes.api.listNodes as any, {}) as any[] | undefined;
    const approval = (useQuery as any)((api as any).features.nodes.api.getExecApprovals as any, {
        host: selectedHost,
        agentId: activeChip,
    }) as any | null | undefined;
    const upsertExecApproval = (useMutation as any)((api as any).features.nodes.api.upsertExecApproval as any);

    const chips = useMemo(() => {
        const uniqueAgentIds = Array.from(new Set(agentIds.filter(Boolean)));
        return uniqueAgentIds.length > 0 ? uniqueAgentIds : ["*"];
    }, [agentIds]);

    useEffect(() => {
        setActiveChip(defaultAgentId);
    }, [defaultAgentId]);

    useEffect(() => {
        if (approval === undefined) {
            return;
        }
        setSecurityMode(approval?.securityMode ?? "deny");
        setAskMode(approval?.askMode ?? "on_miss");
        setAskFallback(approval?.askFallback ?? "deny");
        setAutoAllowSkillClis(Boolean(approval?.autoAllowSkillClis));
    }, [approval?._id, approval]);

    const hostOptions = [
        { value: "gateway", label: "Gateway" },
        ...((nodes ?? []).map((node) => ({
            value: node.host,
            label: `${node.name} (${node.host})`,
        }))),
    ];

    const handleSave = () => {
        startSaving(async () => {
            await upsertExecApproval({
                host: selectedHost,
                agentId: activeChip,
                securityMode,
                askMode,
                askFallback,
                autoAllowSkillClis,
            });
        });
    };

    if (nodes === undefined || approval === undefined) {
        return <Skeleton className="h-[420px] w-full rounded-xl" />;
    }

    return (
        <SectionCard
            title="Exec approvals"
            description="Allowlist and approval policy for exec host=gateway/node."
            action={
                <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            }
        >
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="font-medium text-sm">Target</p>
                    <p className="text-xs text-muted-foreground">Gateway edits local approvals; node edits the selected node.</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground">Host</p>
                    <select
                        value={selectedHost}
                        onChange={(event) => setSelectedHost(event.target.value)}
                        className="h-8 w-52 rounded-md border bg-muted/50 px-2 text-xs text-right"
                    >
                        {hostOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="text-sm font-medium mb-2">Scope</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
                {chips.map((chip) => (
                    <Chip
                        key={chip}
                        variant={activeChip === chip ? "active" : "default"}
                        onClick={() => setActiveChip(chip)}
                    >
                        {chip}
                    </Chip>
                ))}
            </div>

            <div className="space-y-0 divide-y">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                    <div>
                        <p className="text-sm font-medium">Security</p>
                        <p className="text-xs text-muted-foreground">Default security mode.</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs text-muted-foreground hidden sm:block">Mode</p>
                        <Input
                            value={securityMode}
                            onChange={(event) => setSecurityMode(event.target.value)}
                            className="h-8 w-32 bg-muted/50 text-xs sm:text-right"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                    <div>
                        <p className="text-sm font-medium">Ask</p>
                        <p className="text-xs text-muted-foreground">Default prompt policy.</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs text-muted-foreground hidden sm:block">Mode</p>
                        <Input
                            value={askMode}
                            onChange={(event) => setAskMode(event.target.value)}
                            className="h-8 w-32 bg-muted/50 text-xs sm:text-right"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                    <div>
                        <p className="text-sm font-medium">Ask fallback</p>
                        <p className="text-xs text-muted-foreground">Applied when the UI prompt is unavailable.</p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs text-muted-foreground hidden sm:block">Fallback</p>
                        <Input
                            value={askFallback}
                            onChange={(event) => setAskFallback(event.target.value)}
                            className="h-8 w-32 bg-muted/50 text-xs sm:text-right"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between py-3 gap-2">
                    <div>
                        <p className="text-sm font-medium">Auto-allow skill CLIs</p>
                        <p className="text-xs text-muted-foreground">Allow skill executables listed by the Gateway.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground hidden sm:block">Enabled</p>
                        <Checkbox
                            checked={autoAllowSkillClis}
                            onCheckedChange={(checked) => setAutoAllowSkillClis(Boolean(checked))}
                        />
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

export function ExecNodeBinding({ agentIds }: { agentIds: string[] }) {
    const bindings = (useQuery as any)((api as any).features.nodes.api.listNodeBindings as any, {
        agentIds,
    }) as any[] | undefined;

    if (bindings === undefined) {
        return <Skeleton className="h-[180px] w-full rounded-xl" />;
    }

    return (
        <SectionCard
            title="Exec node binding"
            description="Pin agents to a specific node when using exec host=node."
        >
            {bindings.length === 0 ? (
                <EmptyState
                    icon={Server}
                    message="Belum ada binding agent ke node pada scope aktif."
                    className="py-10"
                />
            ) : (
                <div className="space-y-0 divide-y">
                    {bindings.map((binding) => (
                        <div
                            key={binding._id}
                            className="flex items-center justify-between gap-4 py-3 text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <Bot className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{binding.agentId}</span>
                            </div>
                            <div className="text-right text-muted-foreground">
                                <p>{binding.nodeName ?? binding.nodeId}</p>
                                <p className="text-xs">{binding.nodeHost ?? binding.nodeId}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}

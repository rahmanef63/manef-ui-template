// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import { appApi, useAppQuery, useAppMutation } from "@/lib/convex/client";
import { SectionCard, FormField, Chip, EmptyState } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";

interface ConfigPanelProps {
    activeCategory?: string;
    searchQuery?: string;
    viewMode?: string;
}

export function ConfigPanel({ activeCategory = "all", searchQuery = "", viewMode = "form" }: ConfigPanelProps) {
    const category = activeCategory === "all" ? undefined : activeCategory;
    const entries: any[] = useAppQuery(appApi.features.config.api.listConfig, { category }) ?? undefined;
    const setConfig = useAppMutation(appApi.features.config.api.setConfig);

    const [pendingEdits, setPendingEdits] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState<string | null>(null);

    const displayed = useMemo(() => {
        if (!entries) return [];
        if (!searchQuery) return entries;
        const q = searchQuery.toLowerCase();
        return entries.filter(
            (e) =>
                e.key.toLowerCase().includes(q) ||
                (e.description ?? "").toLowerCase().includes(q) ||
                (e.category ?? "").toLowerCase().includes(q)
        );
    }, [entries, searchQuery]);

    // Group by category
    const grouped = useMemo(() => {
        const map: Record<string, typeof displayed> = {};
        for (const e of displayed) {
            const cat = e.category || "other";
            if (!map[cat]) map[cat] = [];
            map[cat].push(e);
        }
        return map;
    }, [displayed]);

    const handleSave = async (entry: any) => {
        const newVal = pendingEdits[entry._id];
        if (newVal === undefined || newVal === entry.value) return;
        setSaving(entry._id);
        try {
            await setConfig({
                key: entry.key,
                value: newVal,
                category: entry.category,
                description: entry.description,
                runtimePath: entry.runtimePath,
                source: "dashboard",
                expectedUpdatedAt: entry._creationTime,
            });
            setPendingEdits((prev) => {
                const next = { ...prev };
                delete next[entry._id];
                return next;
            });
        } catch (err) {
            console.error("setConfig error", err);
        } finally {
            setSaving(null);
        }
    };

    if (entries === undefined) {
        return (
            <div className="flex flex-col gap-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border bg-card p-3 gap-3">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Settings</span>
                    <Chip variant="active">{displayed.length} entries</Chip>
                    {Object.keys(pendingEdits).length > 0 && (
                        <span className="text-xs text-amber-500">{Object.keys(pendingEdits).length} unsaved</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Source: runtime mirror + manual</span>
                </div>
            </div>

            {displayed.length === 0 ? (
                <EmptyState
                    icon={Settings}
                    message={searchQuery ? `No config entries match "${searchQuery}".` : "No config entries found. Run runtime sync to populate."}
                />
            ) : viewMode === "raw" ? (
                <SectionCard title="Raw Config">
                    <pre className="text-xs overflow-auto bg-muted/50 rounded p-3 max-h-[600px]">
                        {JSON.stringify(
                            Object.fromEntries(displayed.map((e) => [e.key, e.value])),
                            null,
                            2
                        )}
                    </pre>
                </SectionCard>
            ) : (
                Object.entries(grouped).map(([cat, items]) => (
                    <SectionCard
                        key={cat}
                        title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                        description={`${items.length} entries`}
                    >
                        <div className="space-y-5">
                            {items.map((entry) => {
                                const isDirty = pendingEdits[entry._id] !== undefined && pendingEdits[entry._id] !== entry.value;
                                const currentVal = pendingEdits[entry._id] ?? entry.value;
                                return (
                                    <div key={entry._id} className="flex flex-col gap-1">
                                        <FormField
                                            label={entry.key}
                                            description={entry.description}
                                            tag={entry.tags?.[0]}
                                        >
                                            <div className="flex gap-2 mt-1.5">
                                                <Input
                                                    value={currentVal}
                                                    onChange={(e) =>
                                                        setPendingEdits((prev) => ({
                                                            ...prev,
                                                            [entry._id]: e.target.value,
                                                        }))
                                                    }
                                                    className="bg-muted/50 flex-1"
                                                />
                                                {isDirty && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSave(entry)}
                                                        disabled={saving === entry._id}
                                                    >
                                                        {saving === entry._id ? "Saving..." : "Save"}
                                                    </Button>
                                                )}
                                            </div>
                                        </FormField>
                                        {entry.runtimePath && (
                                            <p className="text-[10px] text-muted-foreground font-mono">{entry.runtimePath}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </SectionCard>
                ))
            )}
        </div>
    );
}

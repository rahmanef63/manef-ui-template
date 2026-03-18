// @ts-nocheck
"use client";

import { useState } from "react";
import { appApi, useAppMutation } from "@/lib/convex/client";
import { SectionCard, FormField } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewCronJobForm() {
    const createJob = useAppMutation(appApi.features.crons.api.createJob);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [agentId, setAgentId] = useState("");
    const [enabled, setEnabled] = useState(true);
    const [scheduleUnit, setScheduleUnit] = useState("30");
    const [scheduleType, setScheduleType] = useState("minutes");
    const [prompt, setPrompt] = useState("");
    const [delivery, setDelivery] = useState("announce");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const buildInterval = () => {
        const n = parseInt(scheduleUnit, 10) || 30;
        if (scheduleType === "minutes") return `${n}m`;
        if (scheduleType === "hours") return `${n}h`;
        if (scheduleType === "days") return `${n}d`;
        return `${n}m`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { setError("Name is required."); return; }
        setSaving(true);
        setError(null);
        try {
            await createJob({
                name: name.trim(),
                description: description.trim() || undefined,
                agentId: agentId.trim() || undefined,
                enabled,
                schedule: "every",
                interval: buildInterval(),
                prompt: prompt.trim() || undefined,
                delivery: delivery || undefined,
                source: "dashboard",
            });
            setSuccess(true);
            setName("");
            setDescription("");
            setAgentId("");
            setPrompt("");
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err?.message || "Failed to create job.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <SectionCard title="New Job" description="Create a scheduled wakeup or agent run.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-muted-foreground">* Required</p>

                <SectionCard title="Basics" description="Name it, choose the assistant, and set enabled state.">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <FormField label="Name *">
                            <Input
                                placeholder="Morning brief"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-muted/50"
                            />
                        </FormField>
                        <FormField label="Description">
                            <Input
                                placeholder="Optional context for this job"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-muted/50"
                            />
                        </FormField>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                        <FormField label="Agent ID" className="flex-1">
                            <Input
                                placeholder="main or ops"
                                value={agentId}
                                onChange={(e) => setAgentId(e.target.value)}
                                className="bg-muted/50"
                            />
                        </FormField>
                        <label className="flex items-center gap-2 text-sm mt-5">
                            <input
                                type="checkbox"
                                checked={enabled}
                                onChange={(e) => setEnabled(e.target.checked)}
                                className="accent-primary"
                            /> Enabled
                        </label>
                    </div>
                </SectionCard>

                <SectionCard title="Schedule" description="Control when this job runs.">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <FormField label="Every *">
                            <Input
                                value={scheduleUnit}
                                onChange={(e) => setScheduleUnit(e.target.value)}
                                className="bg-muted/50"
                                type="number"
                                min="1"
                            />
                        </FormField>
                        <FormField label="Unit">
                            <select
                                className="h-9 w-full rounded border bg-muted/50 px-2 text-sm"
                                value={scheduleType}
                                onChange={(e) => setScheduleType(e.target.value)}
                            >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </FormField>
                    </div>
                </SectionCard>

                <SectionCard title="Delivery" description="What to send and how.">
                    <FormField label="Prompt">
                        <Input
                            placeholder="Good morning! Please give me a brief summary..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="bg-muted/50"
                        />
                    </FormField>
                    <FormField label="Delivery mode" className="mt-3">
                        <select
                            className="h-9 w-full rounded border bg-muted/50 px-2 text-sm"
                            value={delivery}
                            onChange={(e) => setDelivery(e.target.value)}
                        >
                            <option value="announce">Announce</option>
                            <option value="silent">Silent</option>
                        </select>
                    </FormField>
                </SectionCard>

                {error && <p className="text-xs text-red-500">{error}</p>}
                {success && <p className="text-xs text-green-500">Job created successfully.</p>}

                <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? "Creating..." : "Create Job"}
                </Button>
            </form>
        </SectionCard>
    );
}

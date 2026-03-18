// @ts-nocheck
"use client";

import { useState } from "react";
import { appApi, useAppMutation, useAppAction } from "@/lib/convex/client";
import { SectionCard, Chip } from "@/shared/block/ui/openclaw-blocks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CronJobsListProps {
    jobs: any[];
}

export function CronJobsList({ jobs }: CronJobsListProps) {
    const [search, setSearch] = useState("");
    const [filterEnabled, setFilterEnabled] = useState("all");
    const [busyId, setBusyId] = useState<string | null>(null);

    const updateJob = useAppMutation(appApi.features.crons.api.updateJob);
    const deleteJob = useAppMutation(appApi.features.crons.api.deleteJob);
    const triggerRun = useAppAction(appApi.features.crons.api.triggerRun);

    const filtered = jobs.filter((j) => {
        const matchSearch =
            !search ||
            j.name.toLowerCase().includes(search.toLowerCase()) ||
            (j.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (j.agentId ?? "").toLowerCase().includes(search.toLowerCase());
        const matchEnabled =
            filterEnabled === "all" ||
            (filterEnabled === "enabled" && j.enabled) ||
            (filterEnabled === "disabled" && !j.enabled);
        return matchSearch && matchEnabled;
    });

    const handleToggle = async (job: any) => {
        setBusyId(job._id);
        try {
            await updateJob({ id: job._id, enabled: !job.enabled });
        } finally {
            setBusyId(null);
        }
    };

    const handleRun = async (job: any) => {
        setBusyId(job._id + ":run");
        try {
            await triggerRun({ jobId: job._id });
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (job: any) => {
        if (!confirm(`Remove cron job "${job.name}"?`)) return;
        setBusyId(job._id + ":del");
        try {
            await deleteJob({ id: job._id });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <SectionCard
            title="Jobs"
            description="All scheduled jobs stored in the gateway."
            action={<span className="text-xs text-muted-foreground">{filtered.length} of {jobs.length}</span>}
        >
            <div className="flex flex-wrap gap-3 mb-4">
                <Input
                    placeholder="Name, description, or agent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 min-w-[200px] bg-muted/50 h-8 text-xs"
                />
                <select
                    className="h-8 rounded border bg-muted/50 px-2 text-xs"
                    value={filterEnabled}
                    onChange={(e) => setFilterEnabled(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                </select>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { setSearch(""); setFilterEnabled("all"); }}>
                    Reset
                </Button>
            </div>

            {filtered.length === 0 ? (
                <div className="rounded-lg border p-8 text-center text-muted-foreground text-sm">
                    {jobs.length === 0 ? "No cron jobs yet. Create one on the right." : "No jobs match the current filter."}
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((job) => (
                        <div key={job._id} className="rounded-lg border p-4 space-y-3">
                            <div className="flex items-start justify-between">
                                <p className="font-semibold">{job.name}</p>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-right">
                                    <span className="text-muted-foreground">STATUS</span>
                                    <span>{job.lastRunStatus || "n/a"}</span>
                                    <span className="text-muted-foreground">NEXT</span>
                                    <span>{job.nextRunAt ? new Date(job.nextRunAt).toLocaleString() : "n/a"}</span>
                                    <span className="text-muted-foreground">LAST</span>
                                    <span>{job.lastRunAt ? new Date(job.lastRunAt).toLocaleString() : "n/a"}</span>
                                </div>
                            </div>
                            <div className="text-xs space-y-1">
                                <p>
                                    <span className="text-muted-foreground">Schedule: {job.schedule}</span>
                                    {job.interval && <span> · {job.interval}</span>}
                                    {job.cronExpression && <span> · {job.cronExpression}</span>}
                                </p>
                                {job.agentId && <p><span className="font-medium">AGENT: </span>{job.agentId}</p>}
                                {job.prompt && <p><span className="font-medium">PROMPT: </span>{job.prompt}</p>}
                                {job.delivery && <p><span className="font-medium">DELIVERY: </span>{job.delivery}</p>}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                <Chip variant={job.enabled ? "active" : "default"}>
                                    {job.enabled ? "enabled" : "disabled"}
                                </Chip>
                                {job.isolated && <Chip>isolated</Chip>}
                                {job.source && <Chip>{job.source}</Chip>}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                    disabled={busyId === job._id}
                                    onClick={() => handleToggle(job)}
                                >
                                    {busyId === job._id ? "..." : job.enabled ? "Disable" : "Enable"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                    disabled={busyId === job._id + ":run"}
                                    onClick={() => handleRun(job)}
                                >
                                    {busyId === job._id + ":run" ? "Running..." : "Run"}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-7 text-xs"
                                    disabled={busyId === job._id + ":del"}
                                    onClick={() => handleDelete(job)}
                                >
                                    {busyId === job._id + ":del" ? "Removing..." : "Remove"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}

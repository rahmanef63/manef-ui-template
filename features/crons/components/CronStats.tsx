// @ts-nocheck
"use client";

import { appApi, useAppQuery } from "@/lib/convex/client";
import { StatCard, RefreshButton } from "@/shared/block/ui/openclaw-blocks";
import { CheckCircle } from "lucide-react";

interface CronStatsProps {
    isRefreshing: boolean;
    onRefresh: () => void;
}

export function CronStats({ isRefreshing, onRefresh }: CronStatsProps) {
    const jobs: any[] = useAppQuery(appApi.features.crons.api.listJobs, {});

    const enabledCount = jobs?.filter((j: any) => j.enabled).length ?? 0;
    const totalCount = jobs?.length ?? 0;

    const nextJob = jobs
        ?.filter((j: any) => j.enabled && j.nextRunAt)
        .sort((a: any, b: any) => a.nextRunAt - b.nextRunAt)[0];

    const nextRunLabel = nextJob?.nextRunAt
        ? new Date(nextJob.nextRunAt).toLocaleString()
        : "n/a";

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
                label="Enabled"
                value={`${enabledCount} / ${totalCount}`}
                status={enabledCount > 0 ? "ok" : "idle"}
                icon={CheckCircle}
            />
            <StatCard label="Total Jobs" value={totalCount} />
            <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Next Run</p>
                    <p className="mt-2 text-sm font-bold">{nextJob?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{nextRunLabel}</p>
                </div>
                <RefreshButton onClick={onRefresh} loading={isRefreshing} />
            </div>
        </div>
    );
}

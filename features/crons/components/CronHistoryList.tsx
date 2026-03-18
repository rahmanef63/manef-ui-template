// @ts-nocheck
"use client";

import { appApi, useAppQuery } from "@/lib/convex/client";
import { SectionCard, EmptyState } from "@/shared/block/ui/openclaw-blocks";
import { Skeleton } from "@/components/ui/skeleton";
import { History } from "lucide-react";

export function CronHistoryList() {
    const runs: any[] = useAppQuery(appApi.features.crons.api.listRuns, { limit: 30 });

    if (runs === undefined) {
        return (
            <SectionCard title="Run history" description="Latest runs across all jobs.">
                <Skeleton className="h-32 w-full rounded-xl" />
            </SectionCard>
        );
    }

    return (
        <SectionCard
            title="Run history"
            description="Latest runs across all jobs."
            action={<span className="text-xs text-muted-foreground">{runs.length} shown</span>}
        >
            {runs.length === 0 ? (
                <EmptyState message="No run history yet." icon={History} />
            ) : (
                <div className="space-y-2">
                    {runs.map((run) => (
                        <div key={run._id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-xs">
                            <div className="flex items-center gap-3">
                                <span
                                    className={`inline-block h-2 w-2 rounded-full ${
                                        run.status === "success" ? "bg-green-500" :
                                        run.status === "failed" ? "bg-red-500" : "bg-amber-400"
                                    }`}
                                />
                                <span className="font-medium">{run.jobName}</span>
                                {run.summary && (
                                    <span className="text-muted-foreground truncate max-w-[200px]">{run.summary}</span>
                                )}
                                {run.error && (
                                    <span className="text-red-500 truncate max-w-[200px]">{run.error}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                {run.durationMs && <span>{run.durationMs}ms</span>}
                                {run.tokensUsed && <span>{run.tokensUsed} tok</span>}
                                <span>{new Date(run.startedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}

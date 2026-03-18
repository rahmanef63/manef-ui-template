// @ts-nocheck
"use client";

import { useState } from "react";
import { appApi, useAppQuery } from "@/lib/convex/client";
import { PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { CronStats } from "./components/CronStats";
import { CronJobsList } from "./components/CronJobsList";
import { CronHistoryList } from "./components/CronHistoryList";
import { NewCronJobForm } from "./components/NewCronJobForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function CronsPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const jobs: any = useAppQuery(appApi.features.crons.api.listJobs, {});

    if (jobs === undefined) {
        return (
            <div className="space-y-6 px-4 lg:px-6">
                <PageHeader title="Cron Jobs" description="Schedule wakeups and recurring agent runs." />
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Cron Jobs"
                description="Schedule wakeups and recurring agent runs."
            />

            <CronStats isRefreshing={isRefreshing} onRefresh={() => setIsRefreshing(!isRefreshing)} />

            <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
                <div className="space-y-4">
                    <CronJobsList jobs={jobs} />
                    <CronHistoryList />
                </div>
                <NewCronJobForm />
            </div>
        </div>
    );
}

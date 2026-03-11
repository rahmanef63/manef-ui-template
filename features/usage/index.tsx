// @ts-nocheck
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@manef/db/api";
import { PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { UsageFilters, ActivityChart, UsageStats } from "./components/UsageDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsagePage() {
    const [activeRange, setActiveRange] = useState("Today");
    const [activeMetric, setActiveMetric] = useState("Tokens");
    const records: any =
        (useQuery as any)((api as any).features.usage.api.getUsage as any, {});

    if (records === undefined) {
        return (
            <div className="space-y-6 px-4 lg:px-6">
                <PageHeader title="Usage" description="See where tokens go, when sessions spike, and what drives cost." />
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Usage"
                description="See where tokens go, when sessions spike, and what drives cost."
            />

            <UsageFilters
                activeRange={activeRange}
                setActiveRange={setActiveRange}
                activeMetric={activeMetric}
                setActiveMetric={setActiveMetric}
                recordCount={records.length}
            />

            <ActivityChart />

            <UsageStats />
        </div>
    );
}

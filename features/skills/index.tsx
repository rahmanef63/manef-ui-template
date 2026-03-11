// @ts-nocheck
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@manef/db/api";
import { PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { SkillsList } from "./components/SkillsList";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkillsPage() {
    const [filter, setFilter] = useState("maman");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const skills: any =
        (useQuery as any)((api as any).features.skills.api.listSkills as any, {
            filter: filter !== "maman" ? filter : undefined,
        });

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    if (skills === undefined) {
        return (
            <div className="space-y-6 px-4 lg:px-6">
                <PageHeader title="Skills" description="Manage skill availability and API key injection." />
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Skills"
                description="Manage skill availability and API key injection."
            />

            <SkillsList
                filter={filter}
                onFilterChange={setFilter}
                isRefreshing={isRefreshing}
                onRefresh={handleRefresh}
                skills={skills}
            />
        </div>
    );
}

// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@manef/db/api";
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { SkillsList } from "./components/SkillsList";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap } from "lucide-react";

export default function SkillsPage() {
    const router = useRouter();
    const [filter, setFilter] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const skills: any =
        (useQuery as any)((api as any).features.skills.api.listSkills as any, {
            filter: filter || undefined,
        });

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 300);
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
                description="Live mirror of OpenClaw runtime skills."
            />

            {skills.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/10">
                    <EmptyState
                        icon={Zap}
                        message="Belum ada snapshot skills dari runtime OpenClaw. Jalankan sync runtime agar skill muncul di sini."
                        className="py-20"
                    />
                </div>
            ) : (
                <SkillsList
                    filter={filter}
                    onFilterChange={setFilter}
                    isRefreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    skills={skills}
                />
            )}
        </div>
    );
}

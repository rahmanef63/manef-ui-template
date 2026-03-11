// @ts-nocheck
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { appApi, useAppMutation, useAppQuery } from "@/lib/convex/client";
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { SkillsList } from "./components/SkillsList";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap } from "lucide-react";

export default function SkillsPage() {
    const router = useRouter();
    const [filter, setFilter] = useState("");
    const [isRefreshing, startRefresh] = useTransition();
    const [isToggling, startToggle] = useTransition();
    const skills: any = useAppQuery(appApi.features.skills.api.listSkills, {
        filter: filter || undefined,
    });
    const toggleSkill = useAppMutation(appApi.features.skills.api.toggleSkill);

    const handleRefresh = () => {
        startRefresh(() => {
            router.refresh();
        });
    };

    const handleToggle = (skillId: string, enabled: boolean) => {
        startToggle(async () => {
            await toggleSkill({ id: skillId, enabled });
        });
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
                    isToggling={isToggling}
                    onToggle={handleToggle}
                />
            )}
        </div>
    );
}

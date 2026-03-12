// @ts-nocheck
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { appApi, useAppMutation, useAppQuery } from "@/lib/convex/client";
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { SkillsList } from "./components/SkillsList";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap } from "lucide-react";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";

export default function SkillsPage() {
    const router = useRouter();
    const { selectedScope, isAdmin } = useOpenClawNavigator();
    const [filter, setFilter] = useState("");
    const [sourceType, setSourceType] = useState("all");
    const [isRefreshing, startRefresh] = useTransition();
    const [isToggling, startToggle] = useTransition();
    const [isGranting, startGrant] = useTransition();
    const skills: any = useAppQuery(appApi.features.skills.api.listSkills, {
        sourceType: sourceType === "all" ? undefined : sourceType,
        filter: filter || undefined,
        workspaceId: selectedScope?._id,
    });
    const storeStatus: any = useAppQuery(appApi.features.skills.api.getSkillStoreStatus, {});
    const toggleSkill = useAppMutation(appApi.features.skills.api.toggleSkill);
    const setWorkspaceSkillPolicy = useAppMutation(appApi.features.skills.api.setWorkspaceSkillPolicy);

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

    const handleWorkspaceGrant = (skillId: string, enabled: boolean) => {
        if (!selectedScope?._id) {
            return;
        }
        startGrant(async () => {
            await setWorkspaceSkillPolicy({
                workspaceId: selectedScope._id,
                skillId,
                enabled,
                agentIds: selectedScope.agentIds,
            });
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
                title="Skills Store"
                description="Live skill store for workspace capabilities, with source labels from OpenClaw, Rahman local skills, and ClawHub-ready sync."
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
                    isAdmin={isAdmin}
                    selectedScopeName={selectedScope?.name}
                    filter={filter}
                    onFilterChange={setFilter}
                    sourceType={sourceType}
                    onSourceTypeChange={setSourceType}
                    storeStatus={storeStatus}
                    isRefreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    skills={skills}
                    isToggling={isToggling}
                    onToggle={handleToggle}
                    isGranting={isGranting}
                    onWorkspaceGrant={handleWorkspaceGrant}
                />
            )}
        </div>
    );
}

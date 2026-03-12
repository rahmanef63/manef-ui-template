// @ts-nocheck
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { appApi, useAppMutation, useAppQuery } from "@/lib/convex/client";
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { DiscoveryToolbar } from "@/shared/block/ui/layout/DiscoveryToolbar";
import { SkillsList } from "./components/SkillsList";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap } from "lucide-react";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";

export default function SkillsPage() {
    const router = useRouter();
    const { selectedScope, isAdmin } = useOpenClawNavigator();
    const [filter, setFilter] = useState("");
    const [sourceType, setSourceType] = useState("all");
    const [sortBy, setSortBy] = useState("workspace");
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
    const displaySkills = [...(skills ?? [])].sort((left: any, right: any) => {
        switch (sortBy) {
            case "name":
                return left.name.localeCompare(right.name, "en");
            case "source":
                return `${left.sourceType ?? ""}:${left.name}`.localeCompare(
                    `${right.sourceType ?? ""}:${right.name}`,
                    "en",
                );
            case "workspace":
            default:
                if (Boolean(left.workspacePolicyEnabled) !== Boolean(right.workspacePolicyEnabled)) {
                    return left.workspacePolicyEnabled ? -1 : 1;
                }
                return left.name.localeCompare(right.name, "en");
        }
    });

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
            <DiscoveryToolbar
                searchValue={filter}
                onSearchChange={setFilter}
                searchPlaceholder="Search skills, source, publisher…"
                summary={
                    selectedScope?.name
                        ? `${displaySkills.length} skills in ${selectedScope.name}. Workspace-granted skills stay on top.`
                        : `${displaySkills.length} skills available.`
                }
                filters={[
                    {
                        label: "Source",
                        value: sourceType,
                        onChange: setSourceType,
                        options: [
                            { value: "all", label: "All sources" },
                            { value: "rahman_local", label: "By Rahman" },
                            { value: "clawhub", label: "By ClawHub" },
                            { value: "openclaw_bundled", label: "By OpenClaw" },
                        ],
                    },
                    {
                        label: "Sort",
                        value: sortBy,
                        onChange: setSortBy,
                        options: [
                            { value: "workspace", label: "Workspace first" },
                            { value: "name", label: "Name A-Z" },
                            { value: "source", label: "Source" },
                        ],
                    },
                ]}
            />

            {displaySkills.length === 0 ? (
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
                    sortBy={sortBy}
                    storeStatus={storeStatus}
                    isRefreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    skills={displaySkills}
                    isToggling={isToggling}
                    onToggle={handleToggle}
                    isGranting={isGranting}
                    onWorkspaceGrant={handleWorkspaceGrant}
                />
            )}
        </div>
    );
}

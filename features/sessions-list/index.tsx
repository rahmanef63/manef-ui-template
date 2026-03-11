// @ts-nocheck
"use client";

import { useTransition } from "react";
import { useQuery } from "convex/react";
import { api } from "@manef/db/api";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { SessionsList } from "./components/SessionsList";
import { Skeleton } from "@/components/ui/skeleton";
import type { SessionData } from "./types";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { MessagesSquare } from "lucide-react";

export default function SessionsListPage() {
    const [isRefreshing, startRefresh] = useTransition();
    const { selectedScope } = useOpenClawNavigator();
    const router = useRouter();

    // Attempt to load sessions from Convex
    const dbSessions: any =
        (useQuery as any)((api as any).features.sessions.api.getSessions as any, {
            agentIds: selectedScope?.agentIds,
            limit: 50
        });

    const handleRefresh = () => {
        startRefresh(() => {
            router.refresh();
        });
    };

    if (dbSessions === undefined) {
        return (
            <div className="space-y-6 px-4 lg:px-6">
                <PageHeader title="Sessions" description="Inspect active sessions and adjust per-session defaults." />
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    const displaySessions: SessionData[] = dbSessions.map((s: any) => ({
        id: s._id,
        key: s.sessionKey,
        sub: [s.channel, s.agentId].filter(Boolean).join(" / "),
        label: s.channel || "session",
        kind: s.channel || "session",
        status: s.status === "active" ? "active" : "idle",
        msgs: s.messageCount ?? 0,
        lastActive: formatDistanceToNow(s.lastActiveAt, { addSuffix: true }),
        tokens: `${s.messageCount ?? 0} msgs`,
        updated: "just now",
    }));

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Sessions"
                description="Inspect active sessions and adjust per-session defaults."
            />

            {displaySessions.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/10">
                    <EmptyState
                        icon={MessagesSquare}
                        message="Belum ada session pada scope aktif. Session akan muncul di sini setelah data runtime OpenClaw termirror ke Convex."
                        className="py-20"
                    />
                </div>
            ) : (
                <SessionsList
                    sessions={displaySessions}
                    isRefreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            )}
        </div>
    );
}

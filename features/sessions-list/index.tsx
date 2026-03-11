// @ts-nocheck
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@manef/db/api";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";
import { PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { SessionsList } from "./components/SessionsList";
import { MOCK_SESSIONS } from "./constants";
import { Skeleton } from "@/components/ui/skeleton";
import type { SessionData } from "./types";
import { formatDistanceToNow } from "date-fns";

export default function SessionsListPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { selectedScope } = useOpenClawNavigator();

    // Attempt to load sessions from Convex
    const dbSessions: any =
        (useQuery as any)((api as any).features.sessions.api.getSessions as any, {
            agentIds: selectedScope?.agentIds,
            limit: 50
        });

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    if (dbSessions === undefined) {
        return (
            <div className="space-y-6 px-4 lg:px-6">
                <PageHeader title="Sessions" description="Inspect active sessions and adjust per-session defaults." />
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    const displaySessions: SessionData[] = dbSessions.length > 0
        ? dbSessions.map((s: any) => ({
            id: s.sessionKey,
            key: s.sessionKey,
            sub: [s.channel, s.agentId].filter(Boolean).join(" / "),
            label: s.channel || "session",
            kind: s.status || "active",
            agentId: s.agentId || "unknown",
            status: s.status === "active" ? "active" : "idle",
            msgs: s.messageCount,
            lastActive: formatDistanceToNow(s.lastActiveAt, { addSuffix: true }),
            cost: "$0.00",
            tokens: `${s.messageCount ?? 0} msgs`,
            updated: "just now"
        }))
        : MOCK_SESSIONS;

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Sessions"
                description="Inspect active sessions and adjust per-session defaults."
            />

            <SessionsList
                sessions={displaySessions}
                isRefreshing={isRefreshing}
                onRefresh={handleRefresh}
            />
        </div>
    );
}

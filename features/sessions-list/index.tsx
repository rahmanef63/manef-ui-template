// @ts-nocheck
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@manef/db/api";
import { PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { SessionsList } from "./components/SessionsList";
import { MOCK_SESSIONS } from "./constants";
import { Skeleton } from "@/components/ui/skeleton";
import type { SessionData } from "./types";
import { formatDistanceToNow } from "date-fns";

export default function SessionsListPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Attempt to load sessions from Convex
    const dbSessions: any =
        (useQuery as any)((api as any).features.sessions.api.getSessions as any, { limit: 50 });

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
            sub: "Unknown / Legacy",
            label: "whatsapp/user",
            kind: "User",
            agentId: "main",
            status: s.status === "active" ? "active" : "idle",
            msgs: s.messageCount,
            lastActive: formatDistanceToNow(s.lastActiveAt, { addSuffix: true }),
            cost: "$0.00",
            tokens: "0k",
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

// @ts-nocheck
"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { LogStream } from "./components/LogStream";
import { MOCK_LOGS, LOG_LEVELS } from "./constants";
import { Skeleton } from "@/components/ui/skeleton";
import type { LogLevel, LogEntry } from "./types";

export default function LogsPage() {
    const [activeLevels, setActiveLevels] = useState<Set<string>>(new Set(LOG_LEVELS));
    const [isRefreshing, setIsRefreshing] = useState(false);

// @ts-ignore`n    // @ts-ignore`n    const dbLogs: any = (useQuery as any)((api as any).features.logs.api.getRecentLogs as any, {});

    const toggleLevel = (level: string) => {
        setActiveLevels(prev => {
            const next = new Set(prev);
            if (next.has(level)) next.delete(level);
            else next.add(level);
            return next;
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    if (dbLogs === undefined) {
        return (
            <div className="space-y-6 px-4 lg:px-6">
                <PageHeader title="Logs" description="Real-time gateway log stream." />
                <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
        );
    }

    let displayLogs: LogEntry[] = dbLogs.length > 0
        ? dbLogs.map(l => {
            const date = new Date(l.timestamp);
            const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            return {
                time: timeString,
                level: (l.level as LogLevel) || "info",
                msg: l.message,
                source: l.source
            };
        })
        : MOCK_LOGS;

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Logs"
                description="Real-time gateway log stream."
            />

            <LogStream
                logs={displayLogs}
                activeLevels={activeLevels}
                toggleLevel={toggleLevel}
                isRefreshing={isRefreshing}
                onRefresh={handleRefresh}
            />
        </div>
    );
}

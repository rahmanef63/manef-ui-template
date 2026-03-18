// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { appApi, useAppQuery } from "@/lib/convex/client";
import { EmptyState, PageHeader } from "@/shared/block/ui/openclaw-blocks";
import { LogStream } from "./components/LogStream";
import { LOG_LEVELS } from "./constants";
import { Skeleton } from "@/components/ui/skeleton";
import type { LogLevel, LogEntry } from "./types";
import { Logs } from "lucide-react";

export default function LogsPage() {
    const router = useRouter();
    const [activeLevels, setActiveLevels] = useState<Set<string>>(new Set(LOG_LEVELS));
    const [source, setSource] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const dbLogs: any = useAppQuery(appApi.features.logs.api.getRecentLogs, {
        source: source || undefined,
        searchText: searchText || undefined,
        limit: 200,
    });

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
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 300);
    };

    if (dbLogs === undefined) {
        return (
            <div className="space-y-6 px-4 lg:px-6">
                <PageHeader title="Logs" description="Real-time gateway log stream." />
                <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
        );
    }

    const displayLogs: LogEntry[] = dbLogs.map(l => {
        const date = new Date(l.timestamp);
        const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        return {
            time: timeString,
            level: (l.level as LogLevel) || "info",
            msg: l.message,
            source: l.source
        };
    });

    return (
        <div className="space-y-6 px-4 lg:px-6">
            <PageHeader
                title="Logs"
                description="Real-time gateway log stream."
            />

            {displayLogs.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/10">
                    <EmptyState
                        icon={Logs}
                        message="Belum ada snapshot log dari runtime OpenClaw. Sync gateway logs agar stream tampil di sini."
                        className="py-20"
                    />
                </div>
            ) : (
                <LogStream
                    logs={displayLogs}
                    activeLevels={activeLevels}
                    toggleLevel={toggleLevel}
                    isRefreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    source={source}
                    onSourceChange={setSource}
                    searchText={searchText}
                    onSearchTextChange={setSearchText}
                />
            )}
        </div>
    );
}

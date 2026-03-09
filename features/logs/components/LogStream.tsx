import { SectionCard, RefreshButton, StatusBadge } from "@/shared/block/ui/openclaw-blocks";
import { LOG_LEVELS, LEVEL_COLORS } from "../constants";
import type { LogEntry, LogLevel } from "../types";

interface LogStreamProps {
    logs: LogEntry[];
    activeLevels: Set<string>;
    toggleLevel: (level: string) => void;
    isRefreshing: boolean;
    onRefresh: () => void;
}

export function LogStream({ logs, activeLevels, toggleLevel, isRefreshing, onRefresh }: LogStreamProps) {
    const filteredLogs = logs.filter(log => activeLevels.has(log.level));

    return (
        <SectionCard
            title="Log Stream"
            action={
                <div className="flex items-center gap-2">
                    <StatusBadge status="online" label="Live" />
                    <RefreshButton onClick={onRefresh} loading={isRefreshing} />
                </div>
            }
        >
            {/* Level Filters */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {LOG_LEVELS.map(level => (
                    <button
                        key={level}
                        type="button"
                        onClick={() => toggleLevel(level)}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all ${activeLevels.has(level) ? LEVEL_COLORS[level as LogLevel] : "bg-muted text-muted-foreground opacity-40"
                            }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {/* Log Lines */}
            <div className="rounded-lg bg-black/90 dark:bg-black/50 p-4 overflow-auto max-h-[500px] font-mono text-xs leading-relaxed">
                {filteredLogs.map((log, i) => (
                    <div key={i} className="flex gap-3 py-0.5 hover:bg-white/5">
                        <span className="text-gray-500 shrink-0">{log.time}</span>
                        <span className={`shrink-0 w-12 ${log.level === "error" ? "text-red-400" :
                            log.level === "warn" ? "text-amber-400" :
                                log.level === "info" ? "text-green-400" :
                                    log.level === "debug" ? "text-blue-400" :
                                        "text-gray-500"
                            }`}>
                            [{log.level.toUpperCase()}]
                        </span>
                        <span className="text-gray-400 shrink-0">[{log.source}]</span>
                        <span className="text-gray-200">{log.msg}</span>
                    </div>
                ))}
                <div className="mt-2 text-gray-500 animate-pulse">▊</div>
            </div>
        </SectionCard>
    );
}

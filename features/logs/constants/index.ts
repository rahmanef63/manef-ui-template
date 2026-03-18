import type { LogLevel, LogEntry } from "../types";

export const LOG_LEVELS: LogLevel[] = ["trace", "debug", "info", "warn", "error"];

export const LEVEL_COLORS: Record<LogLevel, string> = {
    trace: "bg-gray-500/10 text-gray-500",
    debug: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    info: "bg-green-500/10 text-green-600 dark:text-green-400",
    warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    error: "bg-red-500/10 text-red-600 dark:text-red-400",
};

// MOCK_LOGS removed — data comes from Convex live via features/logs/api:getRecentLogs
export type { LogEntry };

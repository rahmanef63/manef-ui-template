import type { LogLevel, LogEntry } from "../types";

export const LOG_LEVELS: LogLevel[] = ["trace", "debug", "info", "warn", "error"];

export const LEVEL_COLORS: Record<LogLevel, string> = {
    trace: "bg-gray-500/10 text-gray-500",
    debug: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    info: "bg-green-500/10 text-green-600 dark:text-green-400",
    warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    error: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export const MOCK_LOGS: LogEntry[] = [
    { time: "07:31:45", level: "info", msg: "Gateway heartbeat OK", source: "gateway" },
    { time: "07:31:40", level: "debug", msg: "WebSocket ping/pong cycle completed", source: "ws" },
    { time: "07:31:35", level: "info", msg: "Session agent:main:main context loaded (75010 tokens)", source: "session" },
    { time: "07:31:30", level: "warn", msg: "Telegram channel not running — polling stopped", source: "channels" },
    { time: "07:31:25", level: "debug", msg: "Presence beacon from openclaw-control-ui", source: "instances" },
    { time: "07:31:20", level: "info", msg: "Cron scheduler tick — next wake in 16h", source: "cron" },
    { time: "07:31:15", level: "trace", msg: "Config reload check — no changes detected", source: "config" },
    { time: "07:31:10", level: "info", msg: "WhatsApp auth refreshed — age 8m", source: "channels" },
];

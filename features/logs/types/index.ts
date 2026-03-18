export type LogLevel = "trace" | "debug" | "info" | "warn" | "error";

export interface LogEntry {
    time: string;
    level: LogLevel;
    msg: string;
    source: string;
}

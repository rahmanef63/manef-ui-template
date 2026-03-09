import type { AgentItem, AgentTab } from "../types";

export const MOCK_AGENTS: AgentItem[] = [
    { id: "main", name: "main", label: "main", isDefault: true, emoji: "🐾" },
    { id: "ina", name: "Ka Ina Agent", label: "ina", emoji: "" },
    { id: "irul", name: "Ka Irul Agent", label: "irul", emoji: "" },
    { id: "irul-bisnis", name: "Irul Bisnis Agent", label: "irul-bisnis", emoji: "" },
    { id: "rysha", name: "Rysha Agent", label: "rysha", emoji: "🐱" },
    { id: "si-coder", name: "si-coder", label: "si-coder", emoji: "👨‍💻" },
    { id: "si-db", name: "si-db", label: "si-db", emoji: "🗄️" },
    { id: "si-it", name: "si-it", label: "si-it", emoji: "💻" },
];

export const AGENT_TABS: AgentTab[] = [
    { id: "overview", label: "Overview" },
    { id: "files", label: "Files" },
    { id: "tools", label: "Tools" },
    { id: "skills", label: "Skills" },
    { id: "channels", label: "Channels" },
    { id: "cron-jobs", label: "Cron Jobs" },
];

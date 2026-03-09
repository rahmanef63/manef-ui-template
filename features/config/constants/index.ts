import {
    Settings, Globe, ArrowDown, Bot, Shield, Link2, Mail,
    Terminal, Webhook, Zap, Wrench, Server
} from "lucide-react";
import type { ConfigCategory, ConfigSetting } from "../types";

export const CONFIG_CATEGORIES: ConfigCategory[] = [
    { id: "all", label: "All Settings", icon: Settings },
    { id: "environment", label: "Environment", icon: Globe },
    { id: "updates", label: "Updates", icon: ArrowDown },
    { id: "agents", label: "Agents", icon: Bot },
    { id: "auth", label: "Authentication", icon: Shield },
    { id: "channels", label: "Channels", icon: Link2 },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "commands", label: "Commands", icon: Terminal },
    { id: "hooks", label: "Hooks", icon: Webhook },
    { id: "skills", label: "Skills", icon: Zap },
    { id: "tools", label: "Tools", icon: Wrench },
    { id: "gateway", label: "Gateway", icon: Server },
];

export const MOCK_SETTINGS: ConfigSetting[] = [
    { key: "Wizard Last Run Timestamp", desc: "ISO timestamp for when the setup wizard most recently completed on this host.", tag: "advanced", value: "2026-03-07T15:14:58.974Z" },
    { key: "Wizard Last Run Command", desc: "Command invocation recorded for the latest wizard run to preserve execution context.", tag: "advanced", value: "configure" },
    { key: "Wizard Last Run Commit", desc: "Source commit identifier recorded for the last wizard execution in development builds.", tag: "advanced", value: "" },
    { key: "Wizard Last Run Mode", desc: "Wizard execution mode recorded as 'local' or 'remote' for the most recent onboarding flow.", tag: "advanced", value: "local", type: "toggle", options: ["local", "remote"] },
    { key: "Wizard Last Run Version", desc: "Version string of the wizard used for the most recent onboarding.", tag: "advanced", value: "" },
];

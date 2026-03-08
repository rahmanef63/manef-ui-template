import { defineFeature } from "@/shared/config/feature";

// Core Parent Features
export const PARENT_FEATURES = {
    dashboard: "dashboard",
    tasks: "tasks",
    chat: "chat",
    admin: "admin",
    help: "help",
} as const;

// Navigation Registry defining hierarchies
export const NAVIGATION_REGISTRY = {
    // Dashboard Children
    [PARENT_FEATURES.dashboard]: {
        children: ["overview", "kpi", "activity"],
        defaultChild: "overview",
    },

    // Tasks Children
    [PARENT_FEATURES.tasks]: {
        children: ["my-tasks", "team-tasks", "calendar"],
        defaultChild: "my-tasks",
    },

    // Chat Children
    [PARENT_FEATURES.chat]: {
        children: ["inbox", "agents", "chat-history"],
        defaultChild: "inbox",
    },

    // Admin Children
    [PARENT_FEATURES.admin]: {
        children: ["users", "roles", "audit"],
        defaultChild: "users",
    },

    // Help Children
    [PARENT_FEATURES.help]: {
        children: ["docs", "faq", "support"],
        defaultChild: "docs",
    },
} as const;

import { defineFeature } from "@/shared/config/feature";

// Core Parent Features
export const PARENT_FEATURES = {
    chat: "chat",            // Chat
    control: "control",      // Control 
    agent: "agent",          // Agent
    collaboration: "collaboration", // Extra features (tasks, teams, calendar)
    settings: "settings-parent",    // Settings
    admin: "admin",          // Extra features (users, roles, audit)
    resources: "resources",  // Resources
} as const;

// Navigation Registry defining hierarchies
export const NAVIGATION_REGISTRY = {
    // Chat 
    [PARENT_FEATURES.chat]: {
        children: ["chat-session", "inbox"],
        defaultChild: "chat-session",
    },

    // Control
    [PARENT_FEATURES.control]: {
        children: ["overview", "channels", "instances", "sessions", "usage", "crons"],
        defaultChild: "overview",
    },

    // Agent
    [PARENT_FEATURES.agent]: {
        children: ["agents", "skills", "nodes"],
        defaultChild: "agents",
    },

    // Collaboration Extensions (Previously Tasks)
    [PARENT_FEATURES.collaboration]: {
        children: ["my-tasks", "team-tasks", "calendar"],
        defaultChild: "my-tasks",
    },

    // Settings
    [PARENT_FEATURES.settings]: {
        children: ["config", "debug", "logs"],
        defaultChild: "config",
    },

    // Admin
    [PARENT_FEATURES.admin]: {
        children: ["users", "roles", "audit"],
        defaultChild: "users",
    },

    // Resources
    [PARENT_FEATURES.resources]: {
        children: ["docs", "faq", "support"],
        defaultChild: "docs",
    },
} as const;

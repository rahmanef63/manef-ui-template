import { lazy } from "react";

// Dashboard Features
const Overview = lazy(() => import("@/features/overview"));
const KPI = lazy(() => import("@/features/kpi"));
const Activity = lazy(() => import("@/features/activity"));

// Tasks Features
const MyTasks = lazy(() => import("@/features/my-tasks"));
const WorkspaceTasks = lazy(() => import("@/features/workspace-tasks"));
const CalendarTasks = lazy(() => import("@/features/calendar"));

// Chat Features
const Inbox = lazy(() => import("@/features/inbox"));
const Agents = lazy(() => import("@/features/agents"));
const History = lazy(() => import("@/features/chat-history"));

// Admin Features
const Users = lazy(() => import("@/features/users"));
const Roles = lazy(() => import("@/features/roles"));
const Audit = lazy(() => import("@/features/audit"));

// Help Features
const Docs = lazy(() => import("@/features/docs"));
const FAQ = lazy(() => import("@/features/faq"));
const Support = lazy(() => import("@/features/support"));

// Type for the registry
// Map<FeatureId, Component>
export const FEATURE_REGISTRY: Record<string, React.ComponentType<any>> = {
    // Dashboard
    overview: Overview,
    kpi: KPI,
    activity: Activity,

    // Tasks
    "my-tasks": MyTasks,
    "workspace-tasks": WorkspaceTasks,
    calendar: CalendarTasks,

    // Chat
    inbox: Inbox,
    agents: Agents,
    "chat-history": History,

    // Admin
    users: Users,
    roles: Roles,
    audit: Audit,

    // Help
    docs: Docs,
    faq: FAQ,
    support: Support,
};

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
const ChatSession = lazy(() => import("@/features/chat-session"));

// Admin Features
const Users = lazy(() => import("@/features/users"));
const Roles = lazy(() => import("@/features/roles"));
const Audit = lazy(() => import("@/features/audit"));
const Channels = lazy(() => import("@/features/channels"));
const Instances = lazy(() => import("@/features/instances"));
const Sessions = lazy(() => import("@/features/sessions-list"));
const Usage = lazy(() => import("@/features/usage"));
const Crons = lazy(() => import("@/features/crons"));
const Skills = lazy(() => import("@/features/skills"));
const Nodes = lazy(() => import("@/features/nodes"));
const Config = lazy(() => import("@/features/config"));
const Logs = lazy(() => import("@/features/logs"));
const Debug = lazy(() => import("@/features/debug"));
const TeamTasks = lazy(() => import("@/features/team-tasks"));

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
    "chat-session": ChatSession,

    // Admin
    users: Users,
    roles: Roles,
    audit: Audit,
    channels: Channels,
    instances: Instances,
    sessions: Sessions,
    usage: Usage,
    crons: Crons,
    skills: Skills,
    nodes: Nodes,
    config: Config,
    logs: Logs,
    debug: Debug,
    "team-tasks": TeamTasks,

    // Help
    docs: Docs,
    faq: FAQ,
    support: Support,
};

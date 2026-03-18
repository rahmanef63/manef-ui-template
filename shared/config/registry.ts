// Dashboard Sub-features
import { overviewFeature } from "@/features/overview/config";
import { kpiFeature } from "@/features/kpi/config";
import { activityFeature } from "@/features/activity/config";

// Tasks Sub-features
import { myTasksFeature } from "@/features/my-tasks/config";
import { workspaceTasksFeature } from "@/features/workspace-tasks/config";
import { calendarTasksFeature } from "@/features/calendar/config";

// Chat Sub-features
import { inboxFeature } from "@/features/inbox/config";
import { agentsFeature } from "@/features/agents/config";
import { historyFeature } from "@/features/chat-history/config";

// Admin Sub-features
import { usersFeature } from "@/features/users/config";
import { rolesFeature } from "@/features/roles/config";
import { auditFeature } from "@/features/audit/config";
import { featureStoreFeature } from "@/features/feature-store/config";

// Help Sub-features
import { docsFeature } from "@/features/docs/config";
import { faqFeature } from "@/features/faq/config";
import { supportFeature } from "@/features/support/config";
import { membersFeature } from "@/features/members/config";
import { settingsFeature } from "@/features/settings/config";
import { dashboardFeature } from "@/features/dashboard/config";
import { tasksFeature } from "@/features/tasks/config";
import { chatFeature } from "@/features/chat/config";
import { adminFeature } from "@/features/admin/config";
import { helpFeature } from "@/features/help/config";

// --- NEW EXTENSIONS FOR OPENCLAW BLUEPRINT ---
import { controlFeature } from "@/features/control/config";
import { channelsFeature } from "@/features/channels/config";
import { instancesFeature } from "@/features/instances/config";
import { sessionsFeature } from "@/features/sessions-list/config";
import { usageFeature } from "@/features/usage/config";
import { cronsFeature } from "@/features/crons/config";

import { agentFeature } from "@/features/agent-parent/config";
import { skillsFeature } from "@/features/skills/config";
import { nodesFeature } from "@/features/nodes/config";

import { collaborationFeature } from "@/features/collaboration/config";
import { teamTasksFeature } from "@/features/team-tasks/config";

import { settingsFeature as settingsParentFeature } from "@/features/settings-parent/config";
import { configFeature } from "@/features/config/config";
import { debugFeature } from "@/features/debug/config";
import { logsFeature } from "@/features/logs/config";

import { resourcesFeature } from "@/features/resources/config";
import { chatSessionFeature } from "@/features/chat-session/config";
// ---------------------------------------------

import type { FeatureManifest, MenuGroupManifest } from "./types";

export const menuGroupRegistry = [
  {
    id: "core",
    label: "Core",
    order: 10,
    icon: "dashboard",
    projectId: "core",
  },
  {
    id: "settings",
    label: "Settings",
    order: 90,
    icon: "settings",
    projectId: "core",
  },
] satisfies MenuGroupManifest[];

export const featureRegistry = [
  dashboardFeature,
  tasksFeature,
  chatFeature,
  adminFeature,
  helpFeature,
  overviewFeature,
  kpiFeature,
  activityFeature,
  myTasksFeature,
  workspaceTasksFeature,
  calendarTasksFeature,
  inboxFeature,
  agentsFeature,
  historyFeature,
  usersFeature,
  rolesFeature,
  auditFeature,
  featureStoreFeature,
  docsFeature,
  faqFeature,
  supportFeature,
  membersFeature,
  settingsFeature,
  controlFeature,
  channelsFeature,
  instancesFeature,
  sessionsFeature,
  usageFeature,
  cronsFeature,
  agentFeature,
  skillsFeature,
  nodesFeature,
  collaborationFeature,
  teamTasksFeature,
  settingsParentFeature,
  configFeature,
  debugFeature,
  logsFeature,
  resourcesFeature,
  chatSessionFeature,
] satisfies FeatureManifest[];

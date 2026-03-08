// Dashboard Sub-features
import { overviewFeature } from "@/features/overview/config";
import { kpiFeature } from "@/features/kpi/config";
import { activityFeature } from "@/features/activity/config";

// Tasks Sub-features
import { myTasksFeature } from "@/features/my-tasks/config";
import { teamTasksFeature } from "@/features/team-tasks/config";
import { calendarTasksFeature } from "@/features/calendar/config";

// Chat Sub-features
import { inboxFeature } from "@/features/inbox/config";
import { agentsFeature } from "@/features/agents/config";
import { historyFeature } from "@/features/chat-history/config";

// Admin Sub-features
import { usersFeature } from "@/features/users/config";
import { rolesFeature } from "@/features/roles/config";
import { auditFeature } from "@/features/audit/config";

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
  teamTasksFeature,
  calendarTasksFeature,
  inboxFeature,
  agentsFeature,
  historyFeature,
  usersFeature,
  rolesFeature,
  auditFeature,
  docsFeature,
  faqFeature,
  supportFeature,
  membersFeature,
  settingsFeature,
] satisfies FeatureManifest[];

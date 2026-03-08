/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as features_agents_api from "../features/agents/api.js";
import type * as features_calendar_api from "../features/calendar/api.js";
import type * as features_core_api from "../features/core/api.js";
import type * as features_dashboard_api from "../features/dashboard/api.js";
import type * as features_inbox_api from "../features/inbox/api.js";
import type * as features_knowledge_api from "../features/knowledge/api.js";
import type * as features_projects_api from "../features/projects/api.js";
import type * as features_sessions_api from "../features/sessions/api.js";
import type * as features_tasks_api from "../features/tasks/api.js";
import type * as features_users_api from "../features/users/api.js";
import type * as features_workspace_api from "../features/workspace/api.js";
import type * as features_workspace_tasks_api from "../features/workspace_tasks/api.js";
import type * as functions from "../functions.js";
import type * as init from "../init.js";
import type * as menu from "../menu.js";
import type * as permissions from "../permissions.js";
import type * as permissions_schema from "../permissions_schema.js";
import type * as types from "../types.js";
import type * as user_invites from "../user_invites.js";
import type * as users from "../users.js";
import type * as users_workspaces from "../users/workspaces.js";
import type * as users_workspaces_members from "../users/workspaces/members.js";
import type * as users_workspaces_members_invites from "../users/workspaces/members/invites.js";
import type * as users_workspaces_messages from "../users/workspaces/messages.js";
import type * as users_workspaces_roles from "../users/workspaces/roles.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "features/agents/api": typeof features_agents_api;
  "features/calendar/api": typeof features_calendar_api;
  "features/core/api": typeof features_core_api;
  "features/dashboard/api": typeof features_dashboard_api;
  "features/inbox/api": typeof features_inbox_api;
  "features/knowledge/api": typeof features_knowledge_api;
  "features/projects/api": typeof features_projects_api;
  "features/sessions/api": typeof features_sessions_api;
  "features/tasks/api": typeof features_tasks_api;
  "features/users/api": typeof features_users_api;
  "features/workspace/api": typeof features_workspace_api;
  "features/workspace_tasks/api": typeof features_workspace_tasks_api;
  functions: typeof functions;
  init: typeof init;
  menu: typeof menu;
  permissions: typeof permissions;
  permissions_schema: typeof permissions_schema;
  types: typeof types;
  user_invites: typeof user_invites;
  users: typeof users;
  "users/workspaces": typeof users_workspaces;
  "users/workspaces/members": typeof users_workspaces_members;
  "users/workspaces/members/invites": typeof users_workspaces_members_invites;
  "users/workspaces/messages": typeof users_workspaces_messages;
  "users/workspaces/roles": typeof users_workspaces_roles;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

# Manef UI

Frontend dashboard for `manef`, served on `https://gg.rahmanef.com`.

`manef-ui` is the active product shell for:
- OpenClaw-aware workspace navigation
- admin/user auth portal
- runtime operations dashboard
- Feature Store
- Skills Store
- Agent Builder drafts

The backend source of truth is the separate repo:
- [`manef-db`](/home/rahman/projects/manef-db)
- public endpoint: `https://dbgg.rahmanef.com`

## What This Repo Is

`manef-ui` is not a generic admin panel and not a plain clone of OpenClaw Control UI.

Its role is:
- wrap OpenClaw runtime in a workspace-aware web dashboard
- provide multi-user access and admin tooling
- bridge OpenClaw runtime state with Convex-backed product features
- prepare convergence toward a broader product shell inspired by Superspace

Current architecture reference:
- [TARGET_ARCHITECTURE.md](/home/rahman/projects/manef-ui/docs/TARGET_ARCHITECTURE.md)

## Product Model

Primary concepts in the frontend:

- `workspace`
  - the main isolation boundary for content, feature access, skills, channels, and agents
- `sub-workspace`
  - child scope under a parent workspace
- `agent`
  - OpenClaw runtime unit attached to one or more workspaces
- `feature`
  - installable capability exposed through `Feature Store`
- `skill`
  - runtime capability exposed through `Skills Store`
- `identity`
  - phone/email/channel identity mapped to a profile/workspace
- `channel`
  - WhatsApp, Telegram, webchat, and other runtime entry points

## Main User Surfaces

### 1. Auth Portal

Current flows:
- login with `email or phone + password`
- registration request with:
  - phone
  - name
  - context / “kamu siapa”
- forgot-password request
- admin-issued temporary password
- forced password change on first login

Related files:
- [app/login/page.tsx](/home/rahman/projects/manef-ui/app/login/page.tsx)
- [app/set-password/page.tsx](/home/rahman/projects/manef-ui/app/set-password/page.tsx)
- [auth.ts](/home/rahman/projects/manef-ui/auth.ts)

### 2. Workspace-Aware Dashboard

Dashboard behavior:
- route shape: `/dashboard/[workspaceSlug]/...`
- workspace switcher chooses active root/sub-workspace
- menu, tabs, and route access follow active workspace policy
- admin can see all allowed workspaces
- non-admin should only see workspaces mapped to them

Related files:
- [useOpenClawNavigator.ts](/home/rahman/projects/manef-ui/features/workspaces/hooks/useOpenClawNavigator.ts)
- [WorkspaceSwitcher.tsx](/home/rahman/projects/manef-ui/features/workspaces/components/WorkspaceSwitcher.tsx)
- [page.tsx](/home/rahman/projects/manef-ui/app/dashboard/[workspaceSlug]/[...catchAll]/page.tsx)

### 3. Runtime Operations

Operational pages already connected to live/runtime-backed data:
- `Agents`
- `Sessions`
- `Channels`
- `Skills`
- `Logs`
- `Nodes + Exec Approvals`
- `Usage`

These pages consume backend data from `manef-db`, which mirrors or derives from OpenClaw runtime.

### 4. Admin Operations

Admin tooling currently includes:
- users list
- workspace list per user
- feature list per workspace
- password reset / temporary password actions
- registration requests
- password reset requests
- workspace access bindings:
  - `channel/account -> workspace`
  - `identity -> workspace`
- channel policy control:
  - `multi-workspace`
  - `single-primary`

Related file:
- [Users.tsx](/home/rahman/projects/manef-ui/features/users/components/Users.tsx)

### 5. Feature Store

Purpose:
- browse installable product capabilities per workspace
- preview feature metadata
- install/uninstall features to the active workspace
- inspect capability policy derived from installed features

Current data shown:
- `featureKey`
- route
- required roles
- granted skills
- runtime domains
- install state

Current UX:
- three-panel layout:
  - catalog
  - detail/action
  - workspace context/drafts
- shared search/filter/sort toolbar

Related files:
- [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
- [DiscoveryToolbar.tsx](/home/rahman/projects/manef-ui/shared/block/ui/layout/DiscoveryToolbar.tsx)
- [ThreePanelLayout.tsx](/home/rahman/projects/manef-ui/shared/block/ui/layout/ThreePanelLayout.tsx)

### 6. Skills Store

Purpose:
- expose skill inventory as a store, not only a raw runtime list
- distinguish source and trust:
  - `by Rahman`
  - `by OpenClaw`
  - `by ClawHub`
- grant/revoke workspace-level skill access

Current data shown:
- source type
- trust level
- scope
- install state
- workspace access
- workspace policy source
- assigned agent count

Related files:
- [index.tsx](/home/rahman/projects/manef-ui/features/skills/index.tsx)
- [SkillsList.tsx](/home/rahman/projects/manef-ui/features/skills/components/SkillsList.tsx)

### 7. Agent Builder

Purpose:
- define draft apps/tools attached to a workspace
- support two intended output modes:
  - `json_blocks`
  - `custom_code`

Current state:
- draft create/edit/archive
- capability validation against live workspace policy
- minimal `json_blocks` preview
- `custom_code` review/editor aman
- not yet a final app renderer

Current `json_blocks` preview supports:
- `page_header`
- `stats`
- `section_card`
- `key_values`
- `callout`

Current `custom_code` review/editor supports:
- `language`
- `entry file`
- source code draft
- review summary
- checklist review:
  - scope reviewed
  - secret safe
  - network reviewed
  - runtime write reviewed

Important behavior:
- `custom_code` draft can be saved while incomplete
- `custom_code` draft cannot be marked `ready` until review requirements are met

## Capability Model

The frontend now assumes this capability chain:

`workspace -> installed features -> granted skills -> workspace agents`

This affects:
- menu visibility
- route access
- draft builder readiness
- skill availability in the active scope

Important behavior:
- explicit `featureKeys` on a workspace constrain:
  - sidebar
  - bottom nav
  - page tabs
  - route leaf access
- role checks also apply at route level for admin-only features

## UX Patterns In Use

Patterns already standardized:
- workspace-aware shell
- shared search/filter/sort toolbar
- three-panel browse/detail/context layout for store pages
- skeleton loading instead of fake overview cards
- read-only admin actions for non-admin users where appropriate

Relevant shared UI files:
- [DiscoveryToolbar.tsx](/home/rahman/projects/manef-ui/shared/block/ui/layout/DiscoveryToolbar.tsx)
- [ThreePanelLayout.tsx](/home/rahman/projects/manef-ui/shared/block/ui/layout/ThreePanelLayout.tsx)
- [openclaw-blocks.tsx](/home/rahman/projects/manef-ui/shared/block/ui/openclaw-blocks.tsx)

## Auth and Env Notes

Important frontend env/auth points:
- `AUTH_SECRET`
- `AUTH_DEVICE_SALT`
- `OPENCLAW_SHARED_SECRET`
- `OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS`
- `OPENCLAW_NONCE_TTL_SECONDS`
- `OPENCLAW_WORKFLOW_URL`

OpenClaw browser auth bridge is still part of the runtime:
- `CONVEX_AUTH_PRIVATE_KEY` remains required for the current custom JWT bridge

Important docs:
- [ENVIRONMENT_MATRIX.md](/home/rahman/projects/manef-ui/docs/ENVIRONMENT_MATRIX.md)
- [DOKPLOY_DEPLOYMENT_CHECKLIST.md](/home/rahman/projects/manef-ui/docs/DOKPLOY_DEPLOYMENT_CHECKLIST.md)

## Debugging

To inspect frontend workspace/auth churn:

```js
localStorage.setItem("manef:debug", "1")
location.reload()
```

Disable again:

```js
localStorage.removeItem("manef:debug")
location.reload()
```

Debug prefix:
- `[manef-debug]`

## Current Status

Implemented and important:
- OpenClaw-aware workspace switcher
- auth portal with registration and forgot-password requests
- temporary password + forced reset flow
- admin user/workspace access tooling
- runtime-backed operational pages
- Feature Store
- Skills Store
- Agent Builder drafts
- capability-aware route/menu filtering

Known remaining work:
- safer `custom_code` editor/review flow
- publish/downstream contract to Superspace
- richer renderer/publish flow beyond minimal `json_blocks` preview
- remaining legacy/global pages that are not fully scope-aware yet

Track exact state here:
- [OPENCLAW_FRONTEND_PARITY_TASKLIST.md](/home/rahman/projects/manef-ui/docs/OPENCLAW_FRONTEND_PARITY_TASKLIST.md)

## Docs You Should Read First

- [docs/README.md](/home/rahman/projects/manef-ui/docs/README.md)
- [TARGET_ARCHITECTURE.md](/home/rahman/projects/manef-ui/docs/TARGET_ARCHITECTURE.md)
- [OPENCLAW_FRONTEND_PARITY_TASKLIST.md](/home/rahman/projects/manef-ui/docs/OPENCLAW_FRONTEND_PARITY_TASKLIST.md)
- [FRONTEND_PRD.md](/home/rahman/projects/manef-ui/docs/FRONTEND_PRD.md)

## Related Repos

- frontend:
  - `rahmanef63/manef-ui`
- backend:
  - `rahmanef63/manef-db`
- Superspace reference clone:
  - [superspace](/home/rahman/projects/superspace)

Superspace is currently a product-shell reference, not the source of truth for this repo.

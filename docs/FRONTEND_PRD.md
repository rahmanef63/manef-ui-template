# Frontend PRD

Updated: 2026-03-12

## Purpose

This document defines the product requirements for `manef-ui` as the active frontend for:
- OpenClaw workspace-aware operations
- multi-user/admin access
- productized stores and builders
- future downstream publication toward Superspace

This PRD focuses on:
- features
- content and information architecture
- role behavior
- workflows
- product boundaries

It does **not** focus on visual styling preferences.

## Product Goal

Build a web UI that makes OpenClaw understandable and operable through a workspace-first product model.

The frontend must let users:
- know which workspace they are in
- know what agents, channels, and skills belong to that workspace
- know what they are allowed to access
- install workspace capabilities safely
- create app/builder drafts per workspace

The frontend must let admins:
- manage users and workspace access
- manage runtime-facing bindings
- manage temporary password and onboarding flows
- manage feature/skill capability policy
- prepare downstream apps from workspace context

## Target Users

### 1. Super Admin

Example:
- `rahmanef63@gmail.com`

Needs:
- see all workspaces
- switch across workspace trees
- inspect runtime state across users
- manage users, passwords, and approvals
- manage feature/skill policy
- build and publish downstream apps

### 2. Workspace Owner / Operator

Needs:
- only see workspaces mapped to them
- understand their workspace tree and child workspaces
- manage channels/skills/features allowed inside their scope
- use dashboards without seeing unrelated tenant data

### 3. Internal Team / Power User

Needs:
- access a subset of features in allowed workspaces
- inspect sessions/channels/logs for operational work
- not access admin-only controls

## Core Product Principles

### Workspace First

The active workspace is the main boundary for:
- visible features
- visible agents
- visible channels
- granted skills
- builder target

### OpenClaw Aware, Not OpenClaw Clone

The frontend should wrap OpenClaw runtime, not merely mirror raw runtime UI.

It must add:
- multi-user access
- workspace policy
- admin tooling
- installable capabilities
- builder/store product workflows

### Capability Driven

Feature and skill access must be materialized and visible:

`workspace -> installed features -> granted skills -> workspace agents`

### Context Before Action

The UI must make it obvious:
- what workspace is active
- what feature is selected
- what the current capability state is
- what a user can or cannot do

## Information Architecture

### A. Auth Portal

Routes:
- `/login`
- `/set-password`

Content:
- login tab
- registration request tab
- forgot password flow

Behaviors:
- email or phone login
- registration request with phone, name, context
- admin-issued temp password
- forced password reset on first login

### B. Dashboard Shell

Routes:
- `/dashboard/[workspaceSlug]`
- `/dashboard/[workspaceSlug]/[...catchAll]`

Content:
- workspace switcher
- sidebar
- page tabs
- route leaf content

Requirements:
- route and workspace state must stay in sync
- root/sub-workspace must be stable
- workspace slug must be the SSOT for active scope

### C. Operations Surfaces

Pages include:
- `Agents`
- `Sessions`
- `Channels`
- `Skills`
- `Logs`
- `Nodes`
- `Usage`
- `Config`
- `Crons`

Requirements:
- read from live backend data
- avoid static mock fallback for operational truth
- indicate scope and capability context

### D. Admin Surfaces

Pages include:
- `Users`
- `Roles`
- `Audit`
- `Feature Store`

Requirements:
- admin-only access where appropriate
- clear lists of workspace ownership/access
- password tooling
- registration/password reset request handling
- workspace/channel/identity bindings

### E. Feature Store

Purpose:
- browse installable product capabilities
- inspect metadata
- install/uninstall by workspace

Required content per item:
- item name
- description
- feature key
- route
- scope
- required roles
- granted skills
- runtime domains
- preview metadata
- install state

Required UX:
- browse panel
- detail/action panel
- workspace capability context panel
- search/filter/sort

### F. Skills Store

Purpose:
- expose skill inventory as a product surface
- make source and trust visible
- grant/revoke skill access by workspace

Required content per skill:
- skill name
- description
- source type
- publisher label
- trust level
- scope
- install state
- workspace access
- workspace policy sources
- assigned agent count

### G. Agent Builder

Purpose:
- create downstream app drafts tied to workspace context

Modes:
- `json_blocks`
- `custom_code`

Required draft content:
- workspace target
- app name
- slug
- linked agents
- linked channels
- required features
- required skills
- preview metadata
- output metadata
- downstream target

Required behavior:
- capability validation against active workspace
- show missing requirements
- block ready state until requirements are satisfied

## Required User Flows

### 1. User Login

1. user enters phone or email + password
2. auth resolves to profile
3. dashboard opens in correct workspace scope
4. user only sees authorized workspaces and features

### 2. Registration Request

1. user enters phone + name + context
2. system checks whether workspace already exists
3. user sees:
   - “hubungi Rahman untuk password” if workspace exists
   - “workspace belum tersedia” if not
4. admin reviews request
5. admin issues temp password or approves + creates workspace

### 3. Forgot Password

1. user submits identifier
2. admin receives request
3. admin issues temp password
4. user logs in
5. user must change password before dashboard access

### 4. Workspace Switching

1. user selects root workspace
2. if child workspace exists, child switcher appears
3. route changes with workspace slug
4. menu/tabs/content update to the selected scope

### 5. Feature Installation

1. admin chooses active workspace
2. admin opens Feature Store
3. admin installs/uninstalls item
4. workspace `featureKeys` updates
5. granted skills and agent policy update
6. navigation reflects the new policy

### 6. Skill Grant

1. admin chooses workspace
2. admin opens Skills Store
3. admin grants or revokes skill
4. workspace and agent skill policy updates
5. builder/policy views reflect the change

### 7. Agent Builder Draft

1. admin chooses workspace
2. admin creates draft from Feature Store
3. admin links agents/channels and sets requirements
4. system shows capability gaps
5. draft can only be marked ready when requirements are satisfied

## Role Requirements

### Admin

Can:
- see all workspaces
- install/uninstall features
- grant/revoke workspace skills
- manage users
- issue/reset temp passwords
- handle registration and reset requests
- manage bindings
- create and mark builder drafts ready

### Non-Admin

Can:
- access only allowed workspaces
- access only workspace-enabled features
- use read-only views where appropriate

Cannot:
- issue passwords
- alter workspace policy
- install/uninstall store items
- grant/revoke workspace skills

## Content Requirements

The UI must prioritize product content clarity:
- active workspace name
- active child workspace if applicable
- role and permission context
- workspace features
- workspace skills
- linked agents
- linked channels
- builder readiness

The UI should avoid:
- unexplained raw runtime states without context
- actions without visible scope target
- fallback pages that look like live data when they are not

## Dependencies

Frontend depends on:
- `manef-db` as backend source of truth
- OpenClaw runtime mirrored through backend
- NextAuth-based portal auth
- Convex browser auth bridge

Reference docs:
- [TARGET_ARCHITECTURE.md](<USER_HOME>/projects/manef-ui/docs/TARGET_ARCHITECTURE.md)
- [OPENCLAW_FRONTEND_PARITY_TASKLIST.md](<USER_HOME>/projects/manef-ui/docs/OPENCLAW_FRONTEND_PARITY_TASKLIST.md)

## Current Completed Scope

Already implemented:
- workspace-aware dashboard shell
- auth portal with registration and forgot password
- admin user tooling
- Feature Store
- Skills Store
- Agent Builder drafts
- capability-aware navigation
- minimal `json_blocks` preview

## Remaining Scope

Near-term:
- safer `custom_code` editor/review
- publish/downstream contract to Superspace

Later:
- richer builder rendering/publish pipeline
- deeper parity for remaining runtime/admin panels

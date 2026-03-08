# Ultimate Template Architecture

Berikut breakdown “ultimate template” yang memenuhi semua constraint:

* **Default mobile bottom nav (5)**: `["dashboard","tasks","chat","notifications","profile"]`
* **Desktop + mobile pages siap** (satu SSOT registry → dua renderer)
* **Multi-brand / multi-portal / multi-team** + **invitation + roles**
* `@/features/**` **hanya** pakai blok dari `@/shared/block/ui/**/*` (yang di dalamnya mengimpor `@/components/ui/*` shadcn)

Komponen shadcn yang jadi fondasi: `Sidebar`, `Command`, `Data Table`, `Chart`, `Dialog`.

---

## 0) Core rule: “SSOT → Renderer → Blocks”

### SSOT (source of truth)

1. `MENU_CATALOG` (global): definisi menu + tabs (subpages), label, icon, routeKey.
2. `PORTAL_CONFIG` (per brand+portal): memilih **5 bottom menu** + sidebar group + RBAC overrides.
3. `RBAC_POLICY` (per portal): mapping role → permissions (view/edit/action).

### Renderer (dua output dari SSOT)

* Desktop: `Sidebar + Topbar + Tabs`
* Mobile: `BottomNav(5) + BurgerSidebar(offcanvas) + Tabs`

### Blocks (yang dipakai features)

* Semua UI reusable kamu bungkus jadi blok di `@/shared/block/ui/**/*`.
* `@/features/**` hanya compose blok + logic (data fetching, state, actions).

---

## 1) Folder & boundaries (biar DRY beneran)

### UI sources

* `@/components/ui/*` = shadcn primitives (autogen / copy-paste)
* `@/shared/block/ui/**/*` = **blok** kamu (compositions + patterns)
* `@/features/**` = pages/flows **tanpa** UI primitives langsung (idealnya)

### Enforce boundary (wajib kalau mau konsisten)

* Lint rule: di `@/features/**` **deny** import `@/components/ui/*` (opsional kecuali benar-benar atomic), dan **allow** hanya `@/shared/block/ui/*`.

---

## 2) App Shell (Desktop + Mobile) yang final

### Desktop

* `AppShellDesktopBlock`
  * Topbar: Brand/Portal switcher + CmdK + notif + user
  * Sidebar: collapsible tree + footer NavUser (avatar dropdown)
  * Main: PageHeader + PageTabs + RouterOutlet

### Mobile

* `AppShellMobileBlock`
  * Topbar: burger toggle sidebar + title + CmdK
  * BottomNav: **5 fixed slot** (per portal)
  * BurgerSidebar: full tree (collapsible) + footer NavUser

---

## 3) BottomNav rule kalau portal kurang dari 5 menu

**Target: selalu 5 slot tampil.**

Algorithm:

1. Ambil `portal.bottomNav` (kalau ada).
2. Kalau < 5 → isi dari `DEFAULT_BOTTOM_NAV = [dashboard,tasks,chat,notifications,profile]` yang belum kepakai.
3. Kalau masih kurang (mis. beberapa fitur disabled oleh portal/RBAC) → slot terakhir jadi `more` (action: buka sidebar).

---

## 4) Pages & Tabs untuk 5 default menu (mobile & desktop)

Semua menu punya **tabs (subpages)**. Tabs dirender:

* Desktop: `PageTabsBlock` di atas konten
* Mobile: `PageTabsBlock` (scrollable) tepat di bawah header (atau sticky)

### A) Dashboard

**Tabs (default template):** `overview`, `analytics`, `activity`

**UI blocks yang dibutuhkan:**
* `KpiStatGridBlock`
* `ChartCardBlock`
* `ActivityFeedBlock`
* `DateRangeFilterBlock`, `EmptyStateBlock`, `SkeletonBlock`

### B) Tasks

**Tabs:** `my`, `team`, `calendar`

**UI blocks:**
* `DataTableBlock`
* `KanbanBoardBlock`
* `TaskComposerSheetBlock`
* `BulkActionsBarBlock`, `FiltersBarBlock`, `RowActionsMenuBlock`
* `ConfirmDialogBlock`

### C) Chat

**Tabs:** `inbox`, `agents`, `history`

**UI blocks:**
* `ChatThreadBlock`
* `MessageComposerBlock`
* `AgentPickerBlock`
* `ConversationListBlock`
* `CommandPaletteBlock`

### D) Notifications

**Tabs:** `all`, `mentions`, `settings`

**UI blocks:**
* `NotificationListBlock`, `NotificationItemBlock`
* `NotificationSettingsFormBlock`, `BatchActionsBlock`

### E) Profile

**Tabs:** `account`, `team`, `security`

**UI blocks:**
* `ProfileHeaderCardBlock`
* `AccountSettingsFormBlock`, `SecuritySettingsBlock`
* `TeamSwitcherBlock`
* `NavUserFooterBlock`

---

## 5) Team + Roles + Invitations (System Management)

**Team tab sub-tabs:** `members`, `roles`, `invitations`, `settings`

**UI blocks:**
* `MembersTableBlock`
* `InviteMemberDialogBlock`
* `RoleEditorBlock`
* `InviteLinkCardBlock`
* `AuditTrailBlock`

---

## 6) Block inventory yang harus kamu siapkan di `@/shared/block/ui/**/*`

### A) Layout & Navigation blocks
* `AppShellDesktopBlock`, `AppShellMobileBlock`
* `SidebarNavTreeBlock`, `BottomNavBlock`
* `PageHeaderBlock`, `PageTabsBlock`

### B) Data display blocks
* `KpiStatCardBlock`, `KpiStatGridBlock`
* `ChartCardBlock`
* `DataTableBlock`
* `ActivityFeedBlock`, `EmptyStateBlock`, `SkeletonBlock`

### C) Actions & overlays
* `CommandPaletteBlock`, `DialogBlock`, `ConfirmDialogBlock`
* `SheetBlock` / `DrawerBlock`, `DropdownMenuBlock`, `ContextMenuBlock`

### D) Forms
* `FormBlock`, `FieldBlocks` (`TextField`, etc.), `InlineEditBlock`

### E) AI surfaces
* `AiAssistButtonBlock`, `AiActionSheetBlock`, `AiResultPanelBlock`, `AiToolRunLogBlock`

---

## 7) Feature manifests

Setiap feature punya:
* `FeatureManifest` (menu id, tabs, default widgets, permissions, agent id, blocks used)

---

## 8) Tabs = Routes Strategy

Tabs = routes (`/tasks/my`, `/tasks/team`, dst).
`MENU_CATALOG.tabs` adalah SSOT untuk routing + UI.

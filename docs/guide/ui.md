## 1) Menu constants (SSOT) — reusable untuk semua brand/portal

### 1.1 Master menu catalog (semua menu yang mungkin ada)

Setiap item punya `tabs` (subpages). Tabs ini juga yang dirender sebagai  **Page Tabs** .

```ts
// MENU_CATALOG (global, DRY)
export const MENU_CATALOG = {
  dashboard: {
    id: "dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    href: "/dashboard",
    tabs: [
      { id: "overview", label: "Overview", href: "/dashboard/overview" },
      { id: "kpi", label: "KPI", href: "/dashboard/kpi" },
      { id: "activity", label: "Activity", href: "/dashboard/activity" },
    ],
  },

  tasks: {
    id: "tasks",
    label: "Tasks",
    icon: "CheckSquare",
    href: "/tasks",
    tabs: [
      { id: "my", label: "My Tasks", href: "/tasks/my" },
      { id: "team", label: "Team", href: "/tasks/team" },
      { id: "calendar", label: "Calendar", href: "/tasks/calendar" },
    ],
  },

  chat: {
    id: "chat",
    label: "Chat",
    icon: "MessageSquare",
    href: "/chat",
    tabs: [
      { id: "inbox", label: "Inbox", href: "/chat/inbox" },
      { id: "agents", label: "Agents", href: "/chat/agents" },
      { id: "history", label: "History", href: "/chat/history" },
    ],
  },

  notifications: {
    id: "notifications",
    label: "Notifications",
    icon: "Bell",
    href: "/notifications",
    tabs: [
      { id: "all", label: "All", href: "/notifications/all" },
      { id: "mentions", label: "Mentions", href: "/notifications/mentions" },
      { id: "settings", label: "Settings", href: "/notifications/settings" },
    ],
  },

  profile: {
    id: "profile",
    label: "Profile",
    icon: "User",
    href: "/profile",
    tabs: [
      { id: "account", label: "Account", href: "/profile/account" },
      { id: "security", label: "Security", href: "/profile/security" },
      { id: "preferences", label: "Preferences", href: "/profile/preferences" },
    ],
  },

  operations: {
    id: "operations",
    label: "Operations",
    icon: "Wrench",
    href: "/operations",
    tabs: [
      { id: "rooms", label: "Rooms", href: "/operations/rooms" },
      { id: "housekeeping", label: "Housekeeping", href: "/operations/housekeeping" },
      { id: "vendors", label: "Vendors", href: "/operations/vendors" },
    ],
  },

  finance: {
    id: "finance",
    label: "Finance",
    icon: "Wallet",
    href: "/finance",
    tabs: [
      { id: "cashflow", label: "Cashflow", href: "/finance/cashflow" },
      { id: "invoices", label: "Invoices", href: "/finance/invoices" },
      { id: "reports", label: "Reports", href: "/finance/reports" },
    ],
  },

  admin: {
    id: "admin",
    label: "Admin",
    icon: "Shield",
    href: "/admin",
    tabs: [
      { id: "users", label: "Users", href: "/admin/users" },
      { id: "roles", label: "Roles", href: "/admin/roles" },
      { id: "audit", label: "Audit Log", href: "/admin/audit" },
    ],
  },

  help: {
    id: "help",
    label: "Help",
    icon: "CircleHelp",
    href: "/help",
    tabs: [
      { id: "docs", label: "Docs", href: "/help/docs" },
      { id: "faq", label: "FAQ", href: "/help/faq" },
      { id: "support", label: "Support", href: "/help/support" },
    ],
  },
} as const;
```

Catatan UI: `Sidebar` (shadcn) akan render item ini sebagai **collapsible** kalau `tabs.length > 0`, dan tiap tab jadi child item. ([ui.shadcn.com](https://ui.shadcn.com/docs/components/sidebar))

---

## 2) Portal/Brand menu mapping (tiap brand/portal punya set menu berbeda)

### 2.1 Default bottom nav pattern (yang kamu sebut)

```
BottomNav default = [dashboard, tasks, chat, notifications, profile]
```

Ini jadi “fallback universal” untuk semua brand/portal.

### 2.2 Contoh multiple brand + portal

```ts
// PORTAL_CONFIG (per brand + portal)
export const PORTAL_CONFIG = {
  "zian-inn:staff": {
    label: "Zian Inn • Staff",
    sidebar: {
      main: ["dashboard", "tasks", "operations", "chat"],
      admin: ["help"],
    },
    bottomNav: ["dashboard", "tasks", "chat", "notifications", "profile"],
  },

  "zian-inn:owner": {
    label: "Zian Inn • Owner",
    sidebar: {
      main: ["dashboard", "operations", "finance", "tasks", "chat"],
      admin: ["admin", "help"],
    },
    bottomNav: ["dashboard", "tasks", "chat", "notifications", "profile"],
  },

  "zian-inn:superadmin": {
    label: "Zian Inn • SuperAdmin",
    sidebar: {
      main: ["dashboard", "operations", "finance", "tasks", "chat"],
      admin: ["admin", "help"],
    },
    bottomNav: ["dashboard", "tasks", "chat", "notifications", "profile"],
  },

  "superspace:builder": {
    label: "SuperSpace • Builder",
    sidebar: {
      main: ["dashboard", "tasks", "chat"],
      admin: ["admin", "help"],
    },
    bottomNav: ["dashboard", "tasks", "chat", "notifications", "profile"],
  },

  "pekerja-ai:pm": {
    label: "Pekerja AI • PM",
    sidebar: {
      main: ["dashboard", "tasks", "chat"],
      admin: ["help"],
    },
    bottomNav: ["dashboard", "tasks", "chat", "notifications", "profile"],
  },
} as const;
```

**DRY rule:** `PORTAL_CONFIG` cuma menyimpan  **IDs** ; detail label/icon/href/tabs tetap di `MENU_CATALOG`.

---

## 3) Aturan jika menu portal < 5 untuk Bottom Nav (wajib jelas)

Kalau kamu tidak tegas di sini, implementasi akan inconsistent.

### 3.1 Target behaviour (rekomendasi yang paling stabil)

* **Bottom nav selalu 5 slot** .
* Slot diisi oleh:
  1. `portal.bottomNav` jika tersedia dan valid
  2. Jika kurang dari 5 → **auto-fill** dari `DEFAULT_BOTTOM_NAV` yang belum terpakai
  3. Jika masih kurang (mis. katalog minim) → isi sisa dengan **More** yang membuka Sidebar (Sheet) supaya tetap 5 secara visual

### 3.2 Definisi fallback

* `DEFAULT_BOTTOM_NAV = [dashboard, tasks, chat, notifications, profile]`
* `MORE_ITEM = { id: "more", label:"More", icon:"Menu", action:"toggleSidebar" }`

### 3.3 Contoh kasus

**Kasus A: portal.bottomNav cuma 3 item**

* portal: `["dashboard","tasks","chat"]`
* hasil: `["dashboard","tasks","chat","notifications","profile"]` (diambil dari default)

**Kasus B: portal.bottomNav cuma 2 item dan portal tidak punya notifications (mis. dimatikan)**

* portal: `["dashboard","tasks"]`
* default mencoba tambah `chat`, `notifications`, `profile`
* tapi `notifications` tidak available → skip
* hasil bisa jadi: `["dashboard","tasks","chat","profile","more"]`

**Kasus C: portal.bottomNav kosong / tidak didefinisikan**

* hasil: pakai `DEFAULT_BOTTOM_NAV` penuh

### 3.4 Konsekuensi UX (yang kamu harus terima)

Kalau kamu memaksakan bottom nav 5 item tanpa “More”, tapi portal cuma punya 2–3 menu, UI akan terlihat kosong/aneh. “More” itu jalan keluar yang konsisten.

---

## 4) Diagram ASCII — Sidebar collapsible + Tabs (sesuai requirement)

### 4.1 Sidebar (desktop dan mobile sama)

```
SidebarContent
  MAIN
   ▸ Dashboard
      - Overview
      - KPI
      - Activity
   ▸ Tasks
      - My Tasks
      - Team
      - Calendar
   ▸ Operations
      - Rooms
      - Housekeeping
      - Vendors
  ADMIN
   ▸ Admin
      - Users
      - Roles
      - Audit Log
   ▸ Help
      - Docs
      - FAQ
      - Support

SidebarFooter (NavUser)
  [Avatar Name ▲] -> Dropdown: Account | Billing | Logout
```

### 4.2 Tabs di page (diambil dari menu aktif)

Misal route aktif `/operations/rooms`:

```
Page Header: Operations
Tabs: [Rooms] [Housekeeping] [Vendors]
Content: Rooms view
```

---

## 5) Render rules (tanpa duplikasi)

1. **Sidebar tree** : render semua menu dari `PORTAL_CONFIG[active].sidebar` → lookup detail di `MENU_CATALOG` → collapsible kalau punya tabs.
2. **Bottom nav (mobile)** : ambil `PORTAL_CONFIG[active].bottomNav` → normalize jadi 5 via aturan di atas.
3. **Tabs** : dari `MENU_CATALOG[activeMenu].tabs`.
4. **Burger sidebar tetap ada di mobile** : `☰` selalu toggle `Sidebar` mode mobile (Sheet/offcanvas). Ini pattern yang didukung shadcn `SidebarProvider` + trigger. ([ui.shadcn.com](https://ui.shadcn.com/docs/components/sidebar))

---

## 6) Default contoh yang kamu kasih

Kalau kamu set:

```
Bottom Nav = [dashboard, task, chat, notification, user profile]
```

Yang benar dalam IDs (konsisten dengan catalog di atas):

```
["dashboard", "tasks", "chat", "notifications", "profile"]
```

Jika ada portal kurang dari 5:

* sistem akan auto-isi dari default dan/atau `more` sesuai aturan.

Jika kamu mau, langkah berikutnya adalah aku turunkan ini jadi:

* `normalizeBottomNav(portalId)` (rules di atas)
* `buildSidebarTree(portalId, role)` (filter RBAC + groups)
* `getPageTabs(menuId)`
  tanpa ada satu pun duplikasi definisi menu/tabs di tempat lain.

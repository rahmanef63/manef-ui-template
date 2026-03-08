# Integration Architecture: Next.js + NextAuth + Convex

This document describes how to weave Next.js, NextAuth (Auth.js v5), and Convex together into a cohesive, secure, and type-safe architecture.

## 1. Authentication Flow

The authentication "source of truth" is NextAuth running locally on your Next.js server, while Convex stores extended application state.

1.  **Login**: User logs in via NextAuth components (`<SignIn />` or standard Submit handlers) in Next.js Client.
2.  **Session**: NextAuth generates a session (Cookie/JWT based).
3.  **Convex Provider**: `ConvexProvider` (in `shared/providers/ConvexClientProvider.tsx`) wraps the application.
4.  **Convex Identity**: For proper verification and security boundaries inside Convex, you handle Identity by either adopting `convex-auth` or passing customized JWTs into Convex headers. In this template's simplified version, `users.store` handles graceful fallback authentication handling until a rigid JWT approach is defined.

## 2. User Data Synchronization

Because NextAuth is handled in the same Next.js app backend, you do not need external webhooks like you would with SaaS monolithic auth providers.

**Pattern: Inline DB Operations**
1.  **NextAuth Callback**: During the `jwt()` or `signIn()` callback inside `auth.ts`, check if the user is new or needs updating.
2.  **Convex Mutation**: Call `await fetchMutation(api.users.syncUser, { ... })` using `fetchMutation` from `convex/nextjs`.
3.  **Database**: The `users` table in Convex is updated synchronously or asynchronously as needed.

**Result**: You can directy join any `authorId` with `users._id` in your Convex queries efficiently.

## 3. Folder & file Structure

Recommended structure for cleanliness and scalability:

```text
/app
  layout.tsx          <-- Wraps app in ConvexClientProvider + NextAuth SessionProvider
  (auth)/             <-- Route group for login/signup
  dashboard/
    layout.tsx        <-- Dashboard shell (Sidebar, etc.)
    page.tsx          <-- Main dashboard
    _components/      <-- Dashboard-specific components
/convex
  schema.ts           <-- Database schema
  users.ts            <-- User-related mutations/queries
/shared
  providers/          <-- App providers (NextAuth + Convex)
/components
  ui/                 <-- Shadcn/Shared UI
/lib
  utils.ts
```

## 4. Security Boundaries

| Layer | Responsibility | Tool |
| :--- | :--- | :--- |
| **Edge / Network** | DDOS protection, SSL | Vercel / Next.js |
| **Page Access** | Prevent unauthenticated users from visiting routes | `proxy.ts` (NextAuth Middleware) |
| **Data Access** | Prevent unauthorized reading/writing of data | Convex |
| **Input Validation** | Ensure data integrity | Zod (Next.js Actions) / Validators (Convex) |

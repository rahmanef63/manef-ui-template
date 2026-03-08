# Integration Architecture: Next.js + Clerk + Convex

This document describes how to weave Next.js, Clerk, and Convex together into a cohesive, secure, and type-safe architecture.

## 1. Authentication Flow

The authentication "source of truth" is Clerk, but Convex needs to know about the user to secure data.

1.  **Login**: User logs in via Clerk components (`<SignIn />`) in Next.js Client.
2.  **Token**: Clerk generates a JWT.
3.  **Convex Provider**: `ConvexProviderWithClerk` (in `shared/providers/ConvexClientProvider.tsx`) grabs this token automatically using `useAuth`.
4.  **Request**: When a generic Convex query matches, the token is sent in the Authorization header.
5.  **Validation**: Convex validates the token against the Clerk Issuer URL (configured in Convex Dashboard).
6.  **Identity**: Inside Convex functions, `ctx.auth.getUserIdentity()` returns the parsed user details (sub, email, etc.).

## 2. User Data Synchronization

You often need user data (like "role" or "credits") inside Convex that isn't in the default Clerk JWT.

**Pattern: Webhook Sync**
1.  **Clerk**: Trigger unrelated to the user session (e.g. user updates profile).
2.  **Next.js API Route**: `/api/webhooks/clerk` receives the event.
3.  **Verification**: Verify Svix signature.
4.  **Convex Mutation**: The API route calls `await fetchMutation(api.users.syncUser, { ... })` using `fetchMutation` from `convex/nextjs`.
5.  **Database**: The `users` table in Convex is updated.

**Result**: You can now directy join `messages.authorId` with `users._id` in your Convex queries efficiently.

## 3. Folder & file Structure

Recommended structure for cleanliness and scalability:

```text
/app
  layout.tsx          <-- Wraps app in ConvexClientProvider
  (auth)/             <-- Route group for login/signup
  dashboard/
    layout.tsx        <-- Dashboard shell (Sidebar, etc.)
    page.tsx          <-- Main dashboard
    _components/      <-- Dashboard-specific components
/convex
  auth.config.ts      <-- Clerk Issuer mapping
  schema.ts           <-- Database schema
  users.ts            <-- User-related mutations/queries
  http.ts             <-- (Optional) HTTP actions for webhooks
/shared
  providers/          <-- App providers (Clerk + Convex)
/components
  ui/                 <-- Shadcn/Shared UI
/lib
  utils.ts
```

## 4. Security Boundaries

| Layer | Responsibility | Tool |
| :--- | :--- | :--- |
| **Edge / Network** | DDOS protection, SSL | Vercel / Next.js |
| **Page Access** | Prevent unauthenticated users from visiting routes | `clerkMiddleware` |
| **Data Access** | Prevent unauthorized reading/writing of data | Convex RLS (`ctx.auth`) |
| **Input Validation** | Ensure data integrity | Zod (Next.js Actions) / Validators (Convex) |

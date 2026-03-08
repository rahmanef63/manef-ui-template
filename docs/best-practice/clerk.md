# Clerk Authentication Best Practices

This guide outlines best practices for securing your Next.js application using Clerk.

## 1. Middleware & Route Protection

### Configure `clerkMiddleware`
Use `clerkMiddleware` which is compatible with Next.js App Router. By default, it does not protect any routes, so you must opt-in.

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### Route Matchers
- Use `createRouteMatcher` to define protected patterns.
- Always be explicit about which routes are public vs. protected.

## 2. Checking Auth State

### Server Components
Use the `auth()` helper in Server Components to access user ID and session claims. This is efficient and secure.

```tsx
import { auth } from '@clerk/nextjs/server';

export default function Page() {
  const { userId, sessionClaims } = auth();
  if (!userId) return <div>Sign in to view</div>;
  // ...
}
```

### Client Components
Use the `useAuth()` and `useUser()` hooks in Client Components.
- `useAuth()`: Access `userId`, `sessionId`, `getToken`.
- `useUser()`: Access full user profile data (name, email, image).

### Integration with Convex
Send the JWT to Convex to secure your database access.
Ensure your `ConvexClientProvider` is configured to use Clerk's `useAuth` to fetch tokens.

```tsx
// shared/providers/ConvexClientProvider.tsx
<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
  {children}
</ConvexProviderWithClerk>
```

## 3. Webhooks & Data Sync

### Sync User Data to DB
Don't rely solely on Clerk for user data if you need to join it with your app data (e.g., Convex tables).
- **Setup Webhook**: Create an endpoint (e.g., `/api/webhooks/clerk`) to listen for `user.created`, `user.updated`, `user.deleted` events.
- **Verify Signatures**: Always verify the webhook signature using `svix` to ensure the request is genuinely from Clerk.
- **Idempotency**: Handle webhooks idempotently. A user might be updated multiple times; ensure your database logic handles this gracefully (e.g. `upsert`).

## 4. Security Checklist

- **Environment Variables**: Never stick keys in code. Use `.env.local`.
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
- **MFA**: Enable Multi-Factor Authentication in the Clerk Dashboard for higher security.
- **Session Rules**: Customize session duration and inactivity timeouts in Clerk Dashboard.

## 5. Advanced Features to Maximize

### Organizations (B2B)
- **What it is**: Native multi-tenancy support. Users belong to "Organizations" with roles/permissions.
- **Why use it**: If your app is B2B (like Slack/Linear). Clerk handles invites, role switching, and member management out of the box.
- **How**: Use `<OrganizationSwitcher />` and checking `orgId` in `auth()`.

### Multi-Session
- **What it is**: Users can be signed into multiple accounts at once.
- **Why use it**: Great for users who have a "Personal" and "Work" account and need to switch context instantly.

### Custom User Flows
- **What it is**: Build totally custom sign-in/up pages using Clerk's primitives instead of the pre-built components.
- **Why use it**: For absolute control over branding and specific onboarding steps (e.g. "Select your role" during sign-up).

# NextAuth.js (Auth.js) Best Practices

This guide outlines best practices for securing your Next.js application using NextAuth (Auth.js v5).

## 1. Middleware & Route Protection

### Configure `proxy.ts` (Middleware replacement)
Use `proxy.ts` (which replaces `middleware.ts` in recent Next.js config setups) to intercept requests and enforce protection on routes that demand a valid session.

```typescript
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard");
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### Route Matchers
- Always be explicit about which routes are public vs. protected inside your routing checks.

## 2. Checking Auth State

### Server Components
Use the `auth()` helper in Server Components to access user session data. This is efficient and runs entirely on the server.

```tsx
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) return <div>Sign in to view</div>;
  // ...
}
```

### Client Components
Use the `useSession()` hook from `next-auth/react` inside Client Components.
- `useSession()`: Access the active payload.

### Integration with Convex
When fully self-hosting NextAuth with Convex, follow the official NextAuth+Convex integration or handle custom JWT tokens explicitly if you need to secure user identities on Convex mutations/queries. Currently, the local setup provides a mock/fallback identity mechanism inside Convex until proper `convex-auth` or specific JWT handlers are configured.

## 3. Webhooks & Data Sync

### Sync User Data to DB
Unlike SaaS Auth providers, NextAuth runs locally inside your Next.js App logic, and therefore does not require external Webhooks to sync user creation. 
- You can directly insert/update Convex Documents (`users` and `member` tables) during the NextAuth `jwt` or `session` callbacks, or in the action where you handle your OAuth / Email magic links.

## 4. Security Checklist

- **Environment Variables**: Never hardcode secrets. Always provide `AUTH_SECRET`.
    - `AUTH_SECRET` (Use `npx auth secret` to generate one).
- **Callbacks Control**: Take advantage of the `jwt` and `session` callbacks to securely inject only necessary claims into the token, avoiding leaking PII to the browser unnecessarily.
- **Provider Settings**: Strictly store your OAuth provider `CLIENT_ID` and `CLIENT_SECRET` in `.env.local`.

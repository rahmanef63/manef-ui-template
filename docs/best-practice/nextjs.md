# Next.js 14 Best Practices (App Router)

This guide outlines the best practices for building scalable and performant applications using Next.js 14 with the App Router.

## 1. App Router & Project Structure

### Embrace Component-Based Routing
- **Route Groups**: Use `(group)` folders to organize routes without affecting the URL structure (e.g., `(auth)`, `(dashboard)`).
- **Colocation**: Keep related components, hooks, and utils inside the feature directory (e.g., `app/dashboard/_components/charts.tsx`). Use `_` prefix for private folders that are not routes.
- **Layouts**: Use `layout.tsx` for shared UI (navbars, sidebars) and persistant state across routes.

### Server-First Mindset
- **Default to Server Components**: Next.js App Router components are Server Components by default. Keep them that way to reduce client bundle size.
- **"use client" Directive**: only add `"use client"` at the top of the file when you strictly need:
    - Interactive event listeners (`onClick`, `onChange`).
    - React Hooks (`useState`, `useEffect`, `useContext`).
    - Browser-only APIs (`window`, `localStorage`).
- **Leaf Pattern**: Push client logic down the component tree. Render static content in a Server Component and pass it as children or props to a Client Component.

## 2. Component Architecture

### Composing Server & Client Components
- **Pass Server Components as Children**: To avoid strictly coupling client/server boundaries, pass Server components as `children` to Client components.
  ```tsx
  // ClientWrapper.tsx ("use client")
  export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  }
  
  // Page.tsx (Server Component)
  <ClientWrapper>
    <ServerContent />
  </ClientWrapper>
  ```

## 3. Data Fetching & State

### Server-Side Fetching
- **Direct Database Calls**: In Server Components, fetch data directly from your backend/DB (e.g., Convex) without an API layer in between.
- **Parallel Fetching**: Use `Promise.all` to fetch non-dependent data in parallel to reduce waterfals.
- **Suspense & Streaming**: Wrap async components in `<Suspense>` to show loading UI immediately while data streams in.

### Server Actions
- **Mutations**: Use Server Actions (`"use server"`) for form submissions and data mutations instead of API Routes.
- **Security**: Always validate inputs (e.g., using `zod`) inside Server Actions. Ensure the user is authorized.

## 4. Performance & UX

### Optimization
- **Image Component**: Always use `next/image` for automatic resizing, lazy loading, and format optimization (WebP/AVIF).
- **Fonts**: Use `next/font` to self-host Google Fonts, eliminating layout shift.
- **Metadata**: Use the Metadata API for SEO. Define static metadata in `layout.tsx` and dynamic metadata in `page.tsx`.

### Loading & Errors
- **loading.tsx**: Create loading UIs for instant feedback during navigation.
- **error.tsx**: Use error boundaries to handle runtime errors gracefully without crashing the entire app.

## 5. Middleware
- Use middleware for authentication checks (Clerk) and internationalization routing.
- Keep middleware lightweight to avoid stalling request processing.

## 6. Advanced Features to Maximize

### Partial Prerendering (PPR) (Experimental)
- **What it is**: Combines static shell with dynamic holes.
- **Why use it**: Best of both worlds—instant initial load like SSG, but with dynamic data like SSR.
- **How**: Enable `experimental_ppr` in `next.config.js` and wrap dynamic parts in `<Suspense>`.

### Parallel Routes
- **What it is**: Render multiple pages in the same layout simultaneously using named slots (`@slot`).
- **Why use it**: creating complex dashboards where `Review` and `Analytics` load independently.
- **How**: Create `@analytics/page.tsx` and accept it as a prop in `layout.tsx`.

### Intercepting Routes
- **What it is**: Load a route from another part of the app within the current layout (e.g., specific modal URL).
- **Why use it**: Instagram-style photo modals that have their own URL but open on top of the feed.
- **How**: Use `(.)folder` syntax to intercept navigation.

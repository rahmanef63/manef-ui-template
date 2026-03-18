# Convex Best Practices

This guide outlines best practices for using Convex as your realtime backend and database.

## 1. Schema & Data Modeling

### Strict Schema Validation
- Always use `defineSchema` and `defineTable` in the backend repo `manef-db/convex/schema.ts`.
- Use specific validators (`v`) to enforce types. `v.id("tableName")` is critical for foreign keys.
- **System Fields**: Remember `_id` and `_creationTime` are automatic. Do not define them.
- **Null Safety**: Use `v.optional(v.string())` for fields that might be missing, or `v.union(v.string(), v.null())` if you strictly value null.

### Indexing
- **Query Performance**: Database scans are slow. Always create an index for fields you filter by.
- **Compound Indexes**: If filtering by `channelId` and sorting by `_creationTime`, create an index `["channelId", "_creationTime"]`.
- **Unique Constraints**: Use specific logic or check for existence before insertion if you need uniqueness (Convex indexes are not unique constraints by default, though `.unique()` query helper exists).

## 2. Functions (Queries & Mutations)

### Security & Row Level Security (RLS)
- **Always Validate Auth**: The first line of almost every public mutation/query should be checking `ctx.auth.getUserIdentity()`.
- **Helper Wrappers**: Create a custom `mutation` or `query` wrapper (e.g., `authenticatedMutation`) that automatically checks auth and throws errors, to DRY up security code.
- **Data Leakage**: Only return the fields the client needs.

### Mutation Handling
- **Transactional**: Mutations are transactional. If an error is thrown, nothing changes.
- **No Side Effects**: **NEVER** call external APIs (OpenAI, Stripe) directly in a mutation. Mutations might run multiple times. Use **Actions** for side effects.

### Actions
- **Third Party Integration**: Use `action` for calling 3rd party APIs.
- **Flow**: Action (Call API) -> Mutation (Save Result).

## 3. Realtime & Performance

### Subscriptions
- Frontend automatically subscribes to queries. Be mindful of how much data a query returns.
- **Pagination**: Use `.paginate()` for long lists (e.g., chat logs, activity feeds) to avoid sending megabytes of data on initial load.

### Optimistic Updates
- Use optimistic updates in your `useMutation` hooks on the client to make the UI feel instant, even before the server confirms the write.

## 4. Type Safety

### Generated Types
- Rely on `Doc<"tableName">` and `Id<"tableName">` from the generated data model owned by `manef-db`.
- In `manef-ui`, prefer types re-exported through `@manef/db` or `shared/types/convex`.
- Do not manually type interfaces that mirror your schema; import them.

## 5. Production
- **Environment Variables**: Use the Convex Dashboard to set `AUTH_SECRET`, `OPENAI_API_KEY`, etc.
- **Dev vs Prod**: Development happens in `dev` deployment. Deploy to `prod` when ready. Data is isolated.

## 6. Advanced Features to Maximize

### Vector Search (AI)
- **What it is**: Built-in vector database capabilities.
- **Why use it**: For RAG (Retrieval Augmented Generation), semantic search, or "Similiar Items" features without a separate vector DB (Pinecone/Weaviate).
- **How**: Define a `vectorIndex` in schema, and use `ctx.vectorSearch` in actions.

### Scheduled Functions (Crons)
- **What it is**: Built-in cron jobs and one-off scheduling.
- **Why use it**: Cleanup tasks, daily digest emails, or "remind me in 1 hour" features.
- **How**: Use `crons.ts` for recurring, or `ctx.scheduler.runAfter` for one-offs.

### HTTP Actions
- **What it is**: Expose Convex functions as standard HTTP endpoints.
- **Why use it**: To receive webhooks from Stripe directly into Convex, or to build a public REST API for other developers.
- **How**: Define functions in `manef-db/convex/http.ts` and route them.

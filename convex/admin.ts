import { query } from "./_generated/server";
import { v } from "convex/values";

const CORE_TABLES = [
  "userProfiles",
  "workspaceTrees",
  "agents",
  "agentDelegations",
  "sessions",
  "messages",
  "agentSessions",
  "dailyNotes",
  "workspaceFiles",
] as const;

export const getCoreTableStatsLight = query({
  args: {
    maxPerTable: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const maxPerTable = Math.max(50, Math.min(args.maxPerTable ?? 500, 5000));
    const stats: Record<string, number> = {};
    const truncated: string[] = [];

    for (const table of CORE_TABLES) {
      try {
        const rows = await ctx.db.query(table as any).take(maxPerTable + 1);
        if (rows.length > maxPerTable) {
          stats[table] = maxPerTable;
          truncated.push(table);
        } else {
          stats[table] = rows.length;
        }
      } catch {
        stats[table] = -1;
      }
    }

    return { maxPerTable, stats, truncated };
  },
});

export const checkCoreIntegrityLight = query({
  args: {
    maxItems: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const maxItems = Math.max(50, Math.min(args.maxItems ?? 300, 2000));
    const issues: string[] = [];

    const delegations = await ctx.db.query("agentDelegations").take(maxItems);
    for (const d of delegations) {
      const parentAgent = await ctx.db.get(d.parentAgentId as any);
      if (!parentAgent) issues.push(`agentDelegations:${d._id} parentAgentId missing`);
      const childAgent = await ctx.db.get(d.childAgentId as any);
      if (!childAgent) issues.push(`agentDelegations:${d._id} childAgentId missing`);
      if (issues.length >= 100) break;
    }

    const agents = await ctx.db.query("agents").take(maxItems);
    for (const a of agents) {
      if ((a as any).workspaceId) {
        const ws = await ctx.db.get((a as any).workspaceId);
        if (!ws) issues.push(`agents:${a._id} workspaceId missing`);
      }
      if (issues.length >= 100) break;
    }

    return {
      ok: issues.length === 0,
      sampled: {
        agentDelegations: delegations.length,
        agents: agents.length,
      },
      issues,
      note: "Light/sampled integrity check for migration gating. Use full checks after sync.",
    };
  },
});

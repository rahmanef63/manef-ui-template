import { makeFunctionReference } from "convex/server";
import type { RoleSummary } from "@/shared/types/roles";

export const listRolesRef = makeFunctionReference<
  "query",
  Record<string, never>,
  RoleSummary[]
>("users/teams/roles:list");

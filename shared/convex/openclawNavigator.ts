import { makeFunctionReference } from "convex/server";
import type { OpenClawScopePayload } from "@/shared/types/openclawNavigator";

export const listOpenClawScopesRef = makeFunctionReference<
  "query",
  Record<string, never>,
  OpenClawScopePayload
>("openclawNavigator:listScopes");

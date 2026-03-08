import { makeFunctionReference } from "convex/server";
import type { Id } from "@/shared/types/convex";
import type { MenuItemOverride } from "@/shared/config/types";
import type { Role } from "@/shared/types/roles";

export const listMenuOverridesRef = makeFunctionReference<
  "query",
  { teamId: Id<"teams"> },
  MenuItemOverride[] | null
>("menu:listOverrides");

export const viewerRoleRef = makeFunctionReference<
  "query",
  { teamId: Id<"teams"> },
  Role | null
>("menu:viewerRole");

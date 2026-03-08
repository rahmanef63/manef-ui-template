import { makeFunctionReference } from "convex/server";
import type { Id } from "@/shared/types/convex";
import type { MenuItemOverride } from "@/shared/config/types";
import type { Role } from "@/shared/types/roles";

export const listMenuOverridesRef = makeFunctionReference<
  "query",
  { workspaceId: Id<"workspaces"> },
  MenuItemOverride[] | null
>("menu:listOverrides");

export const viewerRoleRef = makeFunctionReference<
  "query",
  { workspaceId: Id<"workspaces"> },
  Role | null
>("menu:viewerRole");

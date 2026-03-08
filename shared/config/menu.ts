import { featureRegistry, menuGroupRegistry } from "./registry";
import { isIconId } from "./icons";
import type {
  MenuItemOverride,
  ResolvedMenuGroup,
  ResolvedMenuItem,
} from "./types";
import type { Role } from "@/shared/types/roles";

type BuildMenuInput = {
  workspaceSlug?: string;
  overrides?: MenuItemOverride[] | null;
  viewerRole?: Role | null;
  projectId?: string;
};

function resolveRoute(route: string, workspaceSlug?: string) {
  if (!workspaceSlug && route.includes("[workspaceSlug]")) {
    return "#";
  }
  if (!workspaceSlug) return route;
  return route
    .replace(/\[workspaceSlug\]/g, workspaceSlug)
    .replace(/:workspaceSlug/g, workspaceSlug);
}

export function buildMenu({
  workspaceSlug,
  overrides,
  viewerRole,
  projectId,
}: BuildMenuInput): ResolvedMenuGroup[] {
  const overrideMap = new Map(
    (overrides ?? []).map((override) => [override.featureId, override])
  );

  const items = featureRegistry
    .filter((feature) => (projectId ? feature.projectId === projectId : true))
    .filter((feature) =>
      viewerRole && feature.requiredRoles?.length
        ? (feature.requiredRoles as any).includes(viewerRole)
        : true
    )
    .map((feature) => {
      const override = overrideMap.get(feature.id);
      if (override?.hidden) return null;

      const groupIds = override?.groupIds ?? feature.menuGroupIds;
      const label = override?.label ?? feature.label;
      const iconOverride =
        override?.icon && isIconId(override.icon) ? override.icon : undefined;
      const icon = iconOverride ?? (feature as any).icon;
      const order = override?.order ?? feature.order ?? 0;
      const href = resolveRoute(feature.route, workspaceSlug);

      const item: ResolvedMenuItem = {
        id: feature.id,
        label,
        href,
        icon,
        order,
        groupIds,
      };
      return item;
    })
    .filter(Boolean) as ResolvedMenuItem[];

  const groups = menuGroupRegistry
    .filter((group) => (projectId ? group.projectId === projectId : true))
    .map((group) => ({
      id: group.id,
      label: group.label,
      order: group.order ?? 0,
      icon: group.icon,
      items: [] as ResolvedMenuItem[],
    }));

  const groupMap = new Map(groups.map((group) => [group.id, group]));

  for (const item of items) {
    for (const groupId of item.groupIds) {
      const target = groupMap.get(groupId);
      if (target) target.items.push(item);
    }
  }

  const sortedGroups = groups
    .map((group) => ({
      ...group,
      items: group.items
        .slice()
        .sort(
          (a, b) =>
            a.order - b.order || a.label.localeCompare(b.label, "en")
        ),
    }))
    .filter((group) => group.items.length > 0)
    .sort(
      (a, b) => a.order - b.order || a.label.localeCompare(b.label, "en")
    );

  return sortedGroups as ResolvedMenuGroup[];
}

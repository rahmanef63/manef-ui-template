import type { IconId } from "@/shared/config/icons";
import type { Role } from "@/shared/types/roles";

export interface LabeledEntity {
  id: string;
  label: string;
}

export interface OrderedEntity {
  order?: number;
}

export interface ProjectScopedEntity {
  projectId?: string;
}

export interface IconEntity {
  icon?: IconId;
}

export interface MenuManifestBase
  extends LabeledEntity,
    OrderedEntity,
    ProjectScopedEntity,
    IconEntity {}

export interface FeatureManifestBase extends MenuManifestBase {
  route: string;
  menuGroupIds: string[];
  requiredRoles?: Role[];
  related?: string[];
}

export interface MenuGroupManifestBase extends MenuManifestBase {}

export interface MenuItemOverrideBase
  extends OrderedEntity,
    ProjectScopedEntity {
  featureId: string;
  label?: string;
  icon?: string;
  hidden?: boolean;
  groupIds?: string[];
}

export interface ResolvedMenuBase
  extends Omit<MenuManifestBase, "order" | "projectId"> {
  order: number;
}

export interface ResolvedMenuItemBase extends ResolvedMenuBase {
  href: string;
  groupIds: string[];
}

export interface ResolvedMenuGroupBase extends ResolvedMenuBase {
  items: ResolvedMenuItemBase[];
}

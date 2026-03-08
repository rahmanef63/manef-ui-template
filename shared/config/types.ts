import type {
  FeatureManifestBase,
  MenuGroupManifestBase,
  MenuItemOverrideBase,
  ResolvedMenuGroupBase,
  ResolvedMenuItemBase,
} from "@/shared/types/menu";

export interface FeatureManifest extends FeatureManifestBase {}

export interface MenuGroupManifest extends MenuGroupManifestBase {}

export interface MenuItemOverride extends MenuItemOverrideBase {}

export interface ResolvedMenuItem extends ResolvedMenuItemBase {}

export interface ResolvedMenuGroup extends ResolvedMenuGroupBase {}

import {
  Bell,
  CheckSquare,
  CircleHelp,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  User,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

export const iconRegistry = {
  // Menu catalog icons
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  Bell,
  User,
  Wrench,
  Wallet,
  Shield,
  CircleHelp,
  Menu,

  // Legacy / other icons (lowercase aliases for backward compatibility)
  dashboard: LayoutDashboard,
  messages: MessageSquare,
  settings: Settings,
  users: Users,
} as const;

export type IconId = keyof typeof iconRegistry;

export function resolveIcon(icon?: IconId | string) {
  if (!icon) return undefined;
  return iconRegistry[icon as IconId];
}

export function isIconId(value: string): value is IconId {
  return value in iconRegistry;
}


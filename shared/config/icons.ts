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
  Bot,
  Link as LinkIcon,
  Briefcase,
  Kanban,
  Radio,
  FileText,
  BarChart2,
  Clock,
  Monitor,
  BookOpen,
  Bug,
  FileClock,
  SlidersHorizontal,
  Zap
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
  Bot,
  Link: LinkIcon,
  Briefcase,
  Kanban,
  Radio,
  FileText,
  BarChart2,
  Clock,
  Monitor,
  BookOpen,
  Bug,
  FileClock,
  SlidersHorizontal,
  Zap,
  Settings,

  // Legacy / other icons (lowercase aliases for backward compatibility)
  dashboard: LayoutDashboard,
  messages: MessageSquare,
  settings: Settings,
  users: Users,
} as const;

export type IconId = keyof typeof iconRegistry;

export function resolveIcon(icon?: IconId | string) {
  if (!icon) return undefined;
  // Let the registry handle explicit IDs
  if (icon in iconRegistry) {
    return iconRegistry[icon as IconId];
  }
  return undefined;
}

export function isIconId(value: string): value is IconId {
  return value in iconRegistry;
}


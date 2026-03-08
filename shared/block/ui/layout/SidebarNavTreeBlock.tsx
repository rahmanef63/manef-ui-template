"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

import { useCurrentWorkspace } from "@/features/workspaces/hooks/useWorkspaceState";
import { buildSidebarTree, resolveIcon } from "@/shared/config";
import type { SidebarGroup as SidebarGroupType, SidebarMenuItem as SidebarMenuItemType } from "@/shared/config";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import { cn } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarRail,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/features/workspaces/components/WorkspaceSwitcher";

interface SidebarNavTreeBlockProps extends React.ComponentProps<typeof Sidebar> {
    portalId?: string;
}

export function SidebarNavTreeBlock({
    portalId = "default",
    ...props
}: SidebarNavTreeBlockProps) {
    const workspace = useCurrentWorkspace();
    const { data: session } = useSession();
    const pathname = usePathname();
    const params = useParams();

    const workspaceSlug = typeof params?.workspaceSlug === 'string' ? params.workspaceSlug : undefined;

    const sidebarGroups = React.useMemo(
        () => buildSidebarTree(portalId, workspaceSlug),
        [portalId, workspaceSlug]
    );

    const userPayload = {
        name: session?.user?.name || "User",
        email: session?.user?.email || "",
        avatar: session?.user?.image || "",
    };

    const isActive = (href: string) => pathname.startsWith(href);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <WorkspaceSwitcher />
            </SidebarHeader>

            <SidebarContent>
                {sidebarGroups.length === 0 ? (
                    <SidebarMenu className="px-2">
                        <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                        <SidebarMenuSkeleton showIcon />
                    </SidebarMenu>
                ) : (
                    sidebarGroups.map((group: SidebarGroupType) => (
                        <SidebarGroup key={group.id}>
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item: SidebarMenuItemType) => {
                                        const Icon = resolveIcon(item.icon as any);
                                        const hasTabs = item.tabs && item.tabs.length > 0;
                                        const menuActive = isActive(item.href);

                                        if (hasTabs) {
                                            return (
                                                <CollapsibleMenuItem
                                                    key={item.id}
                                                    item={item}
                                                    Icon={Icon}
                                                    isActive={menuActive}
                                                    pathname={pathname}
                                                />
                                            );
                                        }

                                        return (
                                            <SidebarMenuItem key={item.id}>
                                                <SidebarMenuButton asChild isActive={menuActive}>
                                                    <Link href={item.href}>
                                                        {Icon ? <Icon /> : null}
                                                        <span>{item.label}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={userPayload} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

interface CollapsibleMenuItemProps {
    item: SidebarMenuItemType;
    Icon: React.ComponentType<{ className?: string }> | undefined;
    isActive: boolean;
    pathname: string;
}

function CollapsibleMenuItem({
    item,
    Icon,
    isActive,
    pathname,
}: CollapsibleMenuItemProps) {
    const [isOpen, setIsOpen] = React.useState(isActive);

    React.useEffect(() => {
        if (isActive) {
            setIsOpen(true);
        }
    }, [isActive]);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        className={cn(
                            "w-full justify-between",
                            isActive && "font-medium"
                        )}
                        isActive={isActive}
                    >
                        <span className="flex items-center gap-2 truncate">
                            {Icon ? <Icon /> : null}
                            <span>{item.label}</span>
                        </span>
                        <ChevronRight
                            className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isOpen && "rotate-90"
                            )}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.tabs.map((tab) => {
                            const tabActive =
                                pathname === tab.href || pathname.startsWith(tab.href + "/");
                            return (
                                <SidebarMenuItem key={tab.id}>
                                    <SidebarMenuButton asChild isActive={tabActive} size="sm">
                                        <Link href={tab.href}>
                                            <span>{tab.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

"use client";

import * as React from "react";
import { debugClient } from "@/lib/debug/client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";

import { useCurrentWorkspace } from "@/features/workspaces/hooks/useWorkspaceState";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";
import { getAuthProfileRef } from "@/shared/convex/auth";
import { buildSidebarTree, resolveIcon } from "@/shared/config";
import type { SidebarGroup as SidebarGroupType, SidebarMenuItem as SidebarMenuItemType } from "@/shared/config";
import type { Role } from "@/shared/types/roles";
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

function deriveDisplayName(args: {
    authProfileName?: string | null;
    sessionEmail?: string;
    sessionName?: string | null;
}) {
    const normalize = (value?: string | null) => value?.trim() || "";
    const preferredName = normalize(args.authProfileName) || normalize(args.sessionName);

    if (preferredName && preferredName.toLowerCase() !== "user") {
        return preferredName;
    }

    const localPart = args.sessionEmail?.split("@")[0]?.trim();
    if (!localPart) {
        return "User";
    }

    return localPart;
}

export function SidebarNavTreeBlock({
    portalId = "default",
    ...props
}: SidebarNavTreeBlockProps) {
    const workspace = useCurrentWorkspace();
    const { data: session } = useSession();
    const pathname = usePathname();
    const params = useParams();
    const navigator = useOpenClawNavigator();

    const workspaceSlug = typeof params?.workspaceSlug === 'string' ? params.workspaceSlug : undefined;

    const authProfile = useQuery(
        getAuthProfileRef,
        session?.user?.id ? { userId: session.user.id as any } : "skip"
    );
    const userPayload = {
        name: deriveDisplayName({
            authProfileName: authProfile?.name,
            sessionEmail: session?.user?.email ?? "",
            sessionName: session?.user?.name,
        }),
        email: authProfile?.email || authProfile?.phone || session?.user?.email || "",
        avatar: session?.user?.image || "",
    };
    const viewerRole: Role = React.useMemo(() => {
        const roles = authProfile?.roles ?? [];
        if (navigator.isAdmin || roles.some((role) => role.toLowerCase() === "admin")) {
            return "Admin";
        }
        return "Member";
    }, [authProfile?.roles, navigator.isAdmin]);
    const availableMenuIds = React.useMemo(
        () =>
            navigator.selectedScope?.featureKeys?.length
                ? navigator.selectedScope.featureKeys
                : undefined,
        [navigator.selectedScope?.featureKeys],
    );
    const sidebarGroups = React.useMemo(
        () => buildSidebarTree(portalId, workspaceSlug, viewerRole, availableMenuIds),
        [availableMenuIds, portalId, workspaceSlug, viewerRole]
    );

    React.useEffect(() => {
        debugClient("sidebar.identity", {
            authProfileName: authProfile?.name ?? null,
            authProfileRoles: authProfile?.roles ?? null,
            sessionEmail: session?.user?.email ?? null,
            sessionName: session?.user?.name ?? null,
            userPayloadName: userPayload.name,
            viewerRole,
            workspaceSlug: workspace?.slug ?? null,
            availableFeatureKeys: availableMenuIds ?? null,
        });
    }, [
        authProfile?.name,
        authProfile?.roles,
        availableMenuIds,
        viewerRole,
        session?.user?.name,
        session?.user?.email,
        userPayload.name,
        workspace?.slug,
    ]);

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
                                                <SidebarMenuButton asChild isActive={menuActive} tooltip={item.label}>
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
                        tooltip={item.label}
                        className={cn(
                            "w-full justify-between",
                            isActive && "font-medium"
                        )}
                        isActive={isActive}
                    >
                        {Icon ? <Icon /> : null}
                        <span>{item.label}</span>
                        <ChevronRight
                            className={cn(
                                "ml-auto transition-transform duration-200",
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

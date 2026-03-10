"use client";

import * as React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNavTreeBlock } from "./SidebarNavTreeBlock";
import { BottomNavBlock } from "./BottomNavBlock";
import { SiteHeader } from "@/components/layout/header/site-header";
import { Notifications } from "@/features/notifications/components/Notifications";
import { Toaster } from "@/components/ui/toaster";
import { AcceptInviteDialog } from "@/features/workspaces/components/AcceptInviteDialog";
import { WorkspaceRouteGuard } from "@/features/workspaces/components/WorkspaceRouteGuard";

interface AppShellBlockProps {
    children: React.ReactNode;
}

export function AppShellBlock({ children }: AppShellBlockProps) {
    return (
        <SidebarProvider>
            <SidebarNavTreeBlock />
            <SidebarInset>
                <SiteHeader>
                    <div className="flex items-center gap-2">
                        <Notifications />
                    </div>
                </SiteHeader>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <WorkspaceRouteGuard>{children}</WorkspaceRouteGuard>
                </main>
                <BottomNavBlock />
            </SidebarInset>
            <AcceptInviteDialog />
            <Toaster />
        </SidebarProvider>
    );
}

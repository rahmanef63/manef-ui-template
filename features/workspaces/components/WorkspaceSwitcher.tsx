"use client";

import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { useCreateWorkspaceDialog } from "@/features/workspaces/components/CreateWorkspaceDialog";
import {
  useCurrentWorkspace,
  useWorkspaceRouteState,
} from "@/features/workspaces/hooks/useWorkspaceState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { listWorkspacesRef } from "@/shared/convex/workspaces";
import type { WorkspaceDisplayInfo, WorkspaceSummary } from "@/shared/types/workspaces";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function WorkspaceSwitcher() {
  const pathname = usePathname();
  const workspaces = useQuery(listWorkspacesRef);
  const selectedWorkspace = useCurrentWorkspace();
  const { fallbackWorkspace } = useWorkspaceRouteState();

  const [open, setOpen] = useState(false);

  const [showNewWorkspaceDialog, handleShowNewWorkspaceDialog, createWorkspaceDialogContent] =
    useCreateWorkspaceDialog();

  const displayWorkspace = selectedWorkspace ?? fallbackWorkspace ?? {
    _id: "default-main",
    name: "Workspace",
    slug: "main",
    isPersonal: true,
  } as any;

  const safeWorkspaces = workspaces ?? [];
  const personalWorkspaces = safeWorkspaces.filter((workspace: WorkspaceSummary) => workspace.isPersonal);
  const nonPersonalWorkspaces = safeWorkspaces.filter(
    (workspace: WorkspaceSummary) => !workspace.isPersonal
  );
  const groups = [
    { label: "Personal Account", workspaces: personalWorkspaces },
    ...(nonPersonalWorkspaces.length > 0
      ? [{ label: "Workspaces", workspaces: nonPersonalWorkspaces }]
      : []),
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog open={showNewWorkspaceDialog} onOpenChange={handleShowNewWorkspaceDialog}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={displayWorkspace.pictureUrl ?? `https://avatar.vercel.sh/${displayWorkspace.slug}.png`}
                    alt={displayWorkspace.name}
                  />
                  <AvatarFallback className="rounded-lg">{displayWorkspace.name[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">{displayWorkspace.name}</span>
                  <span className="truncate text-xs text-muted-foreground">Workspace</span>
                </div>
                <CaretSortIcon className="ml-auto size-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] min-w-56 p-0 rounded-lg"
              align="start"
              sideOffset={4}
            >
              <Command>
                <CommandList>
                  <CommandInput placeholder="Search workspace..." />
                  <CommandEmpty>No workspace found.</CommandEmpty>
                  {groups.map((group) => (
                    <CommandGroup key={group.label} heading={group.label}>
                      {group.workspaces.map((workspace: WorkspaceSummary) => (
                        <CommandItem key={workspace._id} className="text-sm p-0">
                          <Link
                            className="flex justify-between items-center px-2 py-1.5 w-full"
                            href={{
                              pathname: `/dashboard/${workspace.slug}/${pathname
                                .split("/")
                                .slice(3)
                                .join("/")}`,
                            }}
                            onClick={(event) => {
                              event.stopPropagation();
                              setOpen(false);
                            }}
                          >
                            <WorkspaceDisplay workspace={workspace} />
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                displayWorkspace.slug === workspace.slug
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </Link>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
                <CommandSeparator />
                <CommandList>
                  <CommandGroup>
                    <DialogTrigger asChild>
                      <CommandItem
                        className="cursor-pointer font-medium"
                        onSelect={() => {
                          setOpen(false);
                          handleShowNewWorkspaceDialog(true);
                        }}
                      >
                        <PlusCircledIcon className="mr-2 h-5 w-5" />
                        Create Workspace
                      </CommandItem>
                    </DialogTrigger>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {createWorkspaceDialogContent}
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function WorkspaceDisplay({
  workspace,
}: {
  workspace: WorkspaceDisplayInfo;
}) {
  return (
    <>
      <Avatar className="mr-2 h-5 w-5">
        <AvatarImage
          src={workspace.pictureUrl ?? `https://avatar.vercel.sh/${workspace.slug}.png`}
          alt={workspace.name}
        />
        <AvatarFallback>{workspace.name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      {workspace.name}
    </>
  );
}

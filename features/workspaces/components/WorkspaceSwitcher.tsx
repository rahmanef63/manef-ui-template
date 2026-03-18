"use client";

import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";
import { useCreateWorkspaceDialog } from "@/features/workspaces/components/CreateWorkspaceDialog";
import {
  useCurrentWorkspace,
  useStaleValue,
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
import type { OpenClawScopeNode, OpenClawScopeRoot } from "@/shared/types/openclawNavigator";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

function formatWorkspaceLabelFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function WorkspaceSwitcher() {
  const navigator = useOpenClawNavigator();
  if (!navigator.isLoading && navigator.roots.length > 0) {
    return <OpenClawWorkspaceSwitcher />;
  }
  return <LegacyWorkspaceSwitcher />;
}

function OpenClawWorkspaceSwitcher() {
  const {
    defaultScopeSlug,
    roots,
    selectedChild,
    selectedRoot,
    setSelectedChild,
    setSelectedRoot,
  } = useOpenClawNavigator();
  const pathname = usePathname();
  const router = useRouter();
  const [rootOpen, setRootOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);

  if (!selectedRoot) {
    return null;
  }

  const nextPathForSlug = (slug: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const suffix = segments.length > 2 ? `/${segments.slice(2).join("/")}` : "";
    return `/dashboard/${slug}${suffix}`;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <ScopePopover
          description="Contact Workspace"
          items={roots}
          label={selectedRoot.name}
          onOpenChange={setRootOpen}
          onSelect={(item) => {
            const nextRoot = item as OpenClawScopeRoot;
            setSelectedRoot(nextRoot);
            router.push(nextPathForSlug(nextRoot.slug));
            setRootOpen(false);
          }}
          open={rootOpen}
          selectedId={selectedRoot._id}
          subtitle={selectedRoot.ownerEmail ?? selectedRoot.ownerPhone ?? "OpenClaw workspace"}
        />
      </SidebarMenuItem>

      {selectedRoot.children.length > 0 ? (
        <SidebarMenuItem>
          <ScopePopover
            compact
            description="Sub Workspace"
            items={selectedRoot.children}
            emptyLabel="Select sub workspace"
            label={selectedChild?.name ?? "Select sub workspace"}
            onOpenChange={setChildOpen}
            onSelect={(item) => {
              const nextChild = item as OpenClawScopeNode;
              setSelectedChild(nextChild);
              router.push(nextPathForSlug(nextChild.slug));
              setChildOpen(false);
            }}
            open={childOpen}
            selectedId={selectedChild?._id ?? ""}
            subtitle={
              selectedChild?.agentId ??
              selectedChild?.type ??
              `Default: ${defaultScopeSlug ?? selectedRoot.slug}`
            }
          />
        </SidebarMenuItem>
      ) : null}
    </SidebarMenu>
  );
}

function LegacyWorkspaceSwitcher() {
  const pathname = usePathname();
  const workspaces = useQuery(listWorkspacesRef);
  const selectedWorkspace = useCurrentWorkspace();
  const { fallbackWorkspace } = useWorkspaceRouteState();
  const stableSelectedWorkspace = useStaleValue(selectedWorkspace).value;
  const stableFallbackWorkspace = useStaleValue(fallbackWorkspace).value;
  const selectedOrFallbackWorkspace =
    stableSelectedWorkspace ?? stableFallbackWorkspace;

  const [open, setOpen] = useState(false);

  const [showNewWorkspaceDialog, handleShowNewWorkspaceDialog, createWorkspaceDialogContent] =
    useCreateWorkspaceDialog();

  const displayWorkspace =
    selectedOrFallbackWorkspace ??
    ({
      _id: "default-main",
      name: formatWorkspaceLabelFromSlug("main"),
      slug: "main",
      isPersonal: true,
    } as any);

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

function ScopePopover({
  compact = false,
  description,
  emptyLabel,
  items,
  label,
  onOpenChange,
  onSelect,
  open,
  selectedId,
  subtitle,
}: {
  compact?: boolean;
  description: string;
  emptyLabel?: string;
  items: Array<OpenClawScopeRoot | OpenClawScopeNode>;
  label: string;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: any) => void;
  open: boolean;
  selectedId: string;
  subtitle: string;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className={cn(
            "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
            compact && "h-auto min-h-12",
          )}
        >
          <Avatar className={cn("rounded-lg", compact ? "h-7 w-7" : "h-8 w-8")}>
            <AvatarImage
              src={`https://avatar.vercel.sh/${label}.png`}
              alt={label}
            />
            <AvatarFallback className="rounded-lg">
              {(label === emptyLabel ? description : label)[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium">{label}</span>
            <span className="truncate text-xs text-muted-foreground">{description}</span>
          </div>
          <CaretSortIcon className="ml-auto size-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] min-w-56 rounded-lg p-0"
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandList>
            <CommandInput placeholder={`Search ${description.toLowerCase()}...`} />
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup heading={description}>
              {items.map((item) => (
                <CommandItem
                  key={item._id}
                  className="flex items-center gap-2"
                  onSelect={() => onSelect(item)}
                >
                  <WorkspaceDisplay
                    workspace={{
                      name: item.name,
                      pictureUrl: null,
                      slug: item.slug,
                    }}
                  />
                  <div className="ml-auto flex items-center gap-2">
                    <span className="max-w-28 truncate text-[10px] text-muted-foreground">
                      {subtitleForItem(item)}
                    </span>
                    <CheckIcon
                      className={cn(
                        "h-4 w-4",
                        selectedId === item._id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function subtitleForItem(item: OpenClawScopeRoot | OpenClawScopeNode) {
  return item.agentId ?? item.ownerEmail ?? item.ownerPhone ?? item.type;
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

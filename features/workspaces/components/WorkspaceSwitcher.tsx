"use client";

import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { useCreateWorkspaceDialog } from "@/features/workspaces/components/CreateWorkspaceDialog";
import { useCurrentWorkspace } from "@/features/workspaces/hooks/useWorkspaceState";
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

  const [open, setOpen] = useState(false);

  const [showNewWorkspaceDialog, handleShowNewWorkspaceDialog, createWorkspaceDialogContent] =
    useCreateWorkspaceDialog();

  const displayWorkspace = selectedWorkspace ?? {
    _id: "default-main",
    name: "Main",
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
    <Dialog open={showNewWorkspaceDialog} onOpenChange={handleShowNewWorkspaceDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a workspace"
            className="w-[200px] justify-between"
          >
            <WorkspaceDisplay workspace={displayWorkspace} />
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search workspace..." />
              <CommandEmpty>No workspace found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.workspaces.map((workspace: WorkspaceSummary) => (
                    <CommandItem key={workspace._id} className="text-sm p-0">
                      <Link
                        className="flex justify-between items-center px-2 py-1.5"
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
                    className="cursor-pointer"
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

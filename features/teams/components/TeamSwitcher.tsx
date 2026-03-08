"use client";

import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { useCreateTeamDialog } from "@/features/teams/components/CreateTeamDialog";
import { useCurrentTeam } from "@/features/teams/hooks/useTeamState";
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
import { listTeamsRef } from "@/shared/convex/teams";
import type { TeamDisplayInfo, TeamSummary } from "@/shared/types/teams";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function TeamSwitcher() {
  const pathname = usePathname();
  const teams = useQuery(listTeamsRef);
  const selectedTeam = useCurrentTeam();

  const [open, setOpen] = useState(false);

  const [showNewTeamDialog, handleShowNewTeamDialog, createTeamDialogContent] =
    useCreateTeamDialog();

  if (teams == null || selectedTeam == null) {
    return <Skeleton className="w-40 h-9" />;
  }

  const personalTeams = teams.filter((team: TeamSummary) => team.isPersonal);
  const nonPersonalTeams = teams.filter(
    (team: TeamSummary) => !team.isPersonal
  );
  const groups = [
    { label: "Personal Account", teams: personalTeams },
    ...(nonPersonalTeams.length > 0
      ? [{ label: "Teams", teams: nonPersonalTeams }]
      : []),
  ];

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={handleShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className="w-[200px] justify-between"
          >
            <TeamDisplay team={selectedTeam} />
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team: TeamSummary) => (
                    <CommandItem key={team._id} className="text-sm p-0">
                      <Link
                        className="flex justify-between items-center px-2 py-1.5"
                        href={{
                          pathname: `/dashboard/${team.slug}/${pathname
                            .split("/")
                            .slice(3)
                            .join("/")}`,
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpen(false);
                        }}
                      >
                        <TeamDisplay team={team} />
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedTeam.slug === team.slug
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
                      handleShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {createTeamDialogContent}
    </Dialog>
  );
}

function TeamDisplay({
  team,
}: {
  team: TeamDisplayInfo;
}) {
  return (
    <>
      <Avatar className="mr-2 h-5 w-5">
        <AvatarImage
          src={team.pictureUrl ?? `https://avatar.vercel.sh/${team.slug}.png`}
          alt={team.name}
        />
        <AvatarFallback>{team.name[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      {team.name}
    </>
  );
}

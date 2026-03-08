"use client";

import { handleFailure } from "@/shared/errors/handleFailure";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { acceptInviteRef, listInvitesRef } from "@/shared/convex/user_invites";
import { BellIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

export function Notifications() {
  const router = useRouter();
  const invites = useQuery(listInvitesRef);
  const acceptInvite = useMutation(acceptInviteRef);
  const noInvites = (invites ?? []).length === 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={noInvites}
          variant="secondary"
          size="icon"
          className="rounded-full relative w-8 h-8"
        >
          <BellIcon className="w-4 h-4" />
          {(invites ?? []).length > 0 ? (
            <div className="bg-destructive rounded-full w-2 h-2 absolute top-[1px] right-[1px]" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {invites?.map((invite, i) => (
          <Fragment key={invite._id}>
            <DropdownMenuItem
              onSelect={handleFailure(async () => {
                const workspaceSlug = await acceptInvite({ inviteId: invite._id });
                router.push(`/dashboard/${workspaceSlug}`);
              })}
            >
              <div>
                <span className="font-medium">{invite.inviterEmail}</span> has
                invited you to join{" "}
                <span className="font-medium">{invite.workspace}</span>. Click to
                accept.
              </div>
            </DropdownMenuItem>
            {i < invites.length - 1 ? <DropdownMenuSeparator /> : null}
          </Fragment>
        )) ?? <Skeleton className="w-full h-10" />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

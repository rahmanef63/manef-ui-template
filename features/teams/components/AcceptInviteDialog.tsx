"use client";

import { INVITE_PARAM } from "@/shared/constants/invite";
import { handleFailure } from "@/shared/errors/handleFailure";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Id } from "@/shared/types/convex";
import {
  acceptInviteRef,
  deleteInviteRef,
  getInviteRef,
} from "@/shared/convex/user_invites";
import { useMutation, useQuery } from "convex/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AcceptInviteDialog() {
  const router = useRouter();
  const acceptInvite = useMutation(acceptInviteRef);
  const deleteInvite = useMutation(deleteInviteRef);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inviteId, setInviteId] = useState<Id<"invites"> | null>(null);
  const invite = useQuery(
    getInviteRef,
    inviteId === null ? "skip" : { inviteId }
  );
  const showInviteId = searchParams.get(INVITE_PARAM);
  useEffect(() => {
    if (showInviteId !== null) {
      setInviteId(showInviteId as Id<"invites">);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(INVITE_PARAM);
      const newSearchParamsString = newSearchParams.toString();
      router.replace(
        `${pathname}${newSearchParamsString.length > 0 ? `?${newSearchParamsString}` : ""
        }`
      );
    }
  }, [showInviteId, pathname, router, searchParams]);
  if (invite == null) {
    return null;
  }
  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          setInviteId(null);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept invitation</DialogTitle>
          <DialogDescription>
            <span className="font-medium">{invite.inviterEmail}</span> has
            invited you to join{" "}
            <span className="font-medium">{invite.team}</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleFailure(async () => {
              await deleteInvite({ inviteId: invite._id });
              setInviteId(null);
            })}
            variant="destructive"
          >
            Decline
          </Button>
          <Button
            onClick={handleFailure(async () => {
              const teamSlug = await acceptInvite({ inviteId: invite._id });
              setInviteId(null);
              router.push(`/dashboard/${teamSlug}`);
            })}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

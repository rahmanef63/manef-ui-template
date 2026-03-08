"use client";

import { handleFailure } from "@/shared/errors/handleFailure";
import { useCurrentTeam } from "@/features/teams/hooks/useTeamState";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteTeamRef } from "@/shared/convex/teams";
import { useMutation } from "convex/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function DeleteTeamDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const deleteTeam = useMutation(deleteTeamRef);
  const team = useCurrentTeam();
  if (team == null) {
    return null;
  }
  const handleDelete = handleFailure(async () => {
    await deleteTeam({ teamId: team._id });
    if (team.isPersonal) {
      await signOut({ callbackUrl: "/" });
      return;
    }
    router.push("/");
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You are about to delete{" "}
            <span className="font-semibold text-foreground">
              {team.isPersonal ? <>your personal account</> : <>{team.name}</>}
            </span>
            . This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            {team.isPersonal ? <>Delete Personal Account</> : <>Delete Team</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

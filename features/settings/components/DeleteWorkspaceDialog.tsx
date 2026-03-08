"use client";

import { handleFailure } from "@/shared/errors/handleFailure";
import { useCurrentWorkspace } from "@/features/workspaces/hooks/useWorkspaceState";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteWorkspaceRef } from "@/shared/convex/workspaces";
import { useMutation } from "convex/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function DeleteWorkspaceDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const deleteWorkspace = useMutation(deleteWorkspaceRef);
  const workspace = useCurrentWorkspace();
  if (workspace == null) {
    return null;
  }
  const handleDelete = handleFailure(async () => {
    await deleteWorkspace({ workspaceId: workspace._id });
    if (workspace.isPersonal) {
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
              {workspace.isPersonal ? <>your personal account</> : <>{workspace.name}</>}
            </span>
            . This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            {workspace.isPersonal ? <>Delete Personal Account</> : <>Delete Workspace</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

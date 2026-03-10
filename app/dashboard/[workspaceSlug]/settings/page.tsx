"use client";

import { useCurrentWorkspace, useViewerPermissions } from "@/features/workspaces/hooks/useWorkspaceState";
import { DeleteWorkspaceDialog } from "@/features/settings/components/DeleteWorkspaceDialog";
import { SettingsMenuButton } from "@/features/settings/components/SettingsMenuButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { api } from "@manef/db/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { Id } from "@/shared/types/convex";

const updateWorkspaceRef = makeFunctionReference<
  "mutation",
  { workspaceId: Id<"workspaces">; name: string },
  void
>("users/workspaces:update");

export default function GeneralSettingsPage() {
  const workspace = useCurrentWorkspace();
  const permissions = useViewerPermissions();
  const updateWorkspace = useMutation(updateWorkspaceRef);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (workspace) {
      setNewName(workspace.name);
    }
  }, [workspace]);

  if (workspace == null || permissions == null) {
    return null;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === workspace.name) return;

    setIsUpdating(true);
    try {
      await updateWorkspace({ workspaceId: workspace._id, name: newName });
      toast.success("Workspace name updated successfully");
    } catch (error) {
      toast.error("Failed to update workspace name");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openDeleteWorkspaceDialog = () => {
    setShowDeleteDialog(true);
  };
  return (
    <>
      <div className="flex items-center mt-8">
        <SettingsMenuButton />
        <h1 className="text-4xl font-extrabold">
          {workspace.isPersonal ? <>Account Settings</> : <>Workspace Settings</>}
        </h1>
      </div>

      <Card
        aria-disabled={!permissions.has("Manage Workspace")}
        className={cn(!permissions.has("Manage Workspace") && "opacity-60")}
      >
        <CardHeader>
          <CardTitle>{workspace.isPersonal ? "Account Name" : "Workspace Name"}</CardTitle>
          <CardDescription>
            {workspace.isPersonal
              ? "This is your personal account name."
              : "This is your workspace's visible name. It can be changed at any time."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdate}>
          <div className="px-6 pb-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Name</Label>
              <Input
                id="workspace-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={!permissions.has("Manage Workspace") || isUpdating}
                placeholder="Enter workspace name"
              />
            </div>
            <div className="space-y-2 text-sm text-foreground/60">
              <Label>Slug</Label>
              <Input value={workspace.slug} disabled className="bg-muted" />
              <p>Workspace slugs cannot be changed yet.</p>
            </div>
          </div>
          <CardFooter className="border-t pt-6 bg-muted/50">
            <Button
              type="submit"
              disabled={
                !permissions.has("Manage Workspace") ||
                isUpdating ||
                newName === workspace.name ||
                !newName.trim()
              }
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Card
        aria-disabled={!permissions.has("Delete Workspace")}
        className={cn(!permissions.has("Delete Workspace") && "opacity-60")}
      >
        {workspace.isPersonal ? (
          <>
            <CardHeader>
              <CardTitle>Delete Personal Account</CardTitle>
              <CardDescription>
                Permanently delete your account and leave all your workspaces. This
                action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={openDeleteWorkspaceDialog} variant="destructive">
                Delete Personal Account
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Delete Workspace</CardTitle>
              <CardDescription>
                Permanently delete this workspace. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                disabled={!permissions.has("Delete Workspace")}
                onClick={openDeleteWorkspaceDialog}
                variant="destructive"
              >
                Delete Workspace
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
      <DeleteWorkspaceDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} />
    </>
  );
}

"use client";

import { useCurrentTeam, useViewerPermissions } from "@/features/teams/hooks/useTeamState";
import { DeleteTeamDialog } from "@/features/settings/components/DeleteTeamDialog";
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
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import type { Id } from "@/shared/types/convex";

const updateTeamRef = makeFunctionReference<
  "mutation",
  { teamId: Id<"teams">; name: string },
  void
>("users/teams:update");

export default function GeneralSettingsPage() {
  const team = useCurrentTeam();
  const permissions = useViewerPermissions();
  const updateTeam = useMutation(updateTeamRef);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (team) {
      setNewName(team.name);
    }
  }, [team]);

  if (team == null || permissions == null) {
    return null;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === team.name) return;

    setIsUpdating(true);
    try {
      await updateTeam({ teamId: team._id, name: newName });
      toast.success("Team name updated successfully");
    } catch (error) {
      toast.error("Failed to update team name");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const openDeleteTeamDialog = () => {
    setShowDeleteDialog(true);
  };
  return (
    <>
      <div className="flex items-center mt-8">
        <SettingsMenuButton />
        <h1 className="text-4xl font-extrabold">
          {team.isPersonal ? <>Account Settings</> : <>Team Settings</>}
        </h1>
      </div>

      <Card
        aria-disabled={!permissions.has("Manage Team")}
        className={cn(!permissions.has("Manage Team") && "opacity-60")}
      >
        <CardHeader>
          <CardTitle>{team.isPersonal ? "Account Name" : "Team Name"}</CardTitle>
          <CardDescription>
            {team.isPersonal
              ? "This is your personal account name."
              : "This is your team's visible name. It can be changed at any time."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdate}>
          <div className="px-6 pb-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Name</Label>
              <Input
                id="team-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={!permissions.has("Manage Team") || isUpdating}
                placeholder="Enter team name"
              />
            </div>
            <div className="space-y-2 text-sm text-foreground/60">
              <Label>Slug</Label>
              <Input value={team.slug} disabled className="bg-muted" />
              <p>Team slugs cannot be changed yet.</p>
            </div>
          </div>
          <CardFooter className="border-t pt-6 bg-muted/50">
            <Button
              type="submit"
              disabled={
                !permissions.has("Manage Team") ||
                isUpdating ||
                newName === team.name ||
                !newName.trim()
              }
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Card
        aria-disabled={!permissions.has("Delete Team")}
        className={cn(!permissions.has("Delete Team") && "opacity-60")}
      >
        {team.isPersonal ? (
          <>
            <CardHeader>
              <CardTitle>Delete Personal Account</CardTitle>
              <CardDescription>
                Permanently delete your account and leave all your teams. This
                action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={openDeleteTeamDialog} variant="destructive">
                Delete Personal Account
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Delete Team</CardTitle>
              <CardDescription>
                Permanently delete this team. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                disabled={!permissions.has("Delete Team")}
                onClick={openDeleteTeamDialog}
                variant="destructive"
              >
                Delete Team
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
      <DeleteTeamDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} />
    </>
  );
}

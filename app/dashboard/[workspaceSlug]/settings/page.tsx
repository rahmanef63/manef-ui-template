// @ts-nocheck
"use client";

import { useCurrentWorkspace, useViewerPermissions } from "@/features/workspaces/hooks/useWorkspaceState";
import { DeleteWorkspaceDialog } from "@/features/settings/components/DeleteWorkspaceDialog";
import { SettingsMenuButton } from "@/features/settings/components/SettingsMenuButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showErrorToast } from "@/shared/errors/appErrorPresentation";
import { typedApi } from "@/shared/convex/api";
import { useMutation, useQuery } from "convex/react";
import { buildPersonalWorkspaceName } from "@manef/db/workspaces";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { appApi, useAppQuery } from "@/lib/convex/client";
import { formatDistanceToNow } from "date-fns";

const REGISTRATION_STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; description: string }> = {
  pending_workspace: {
    label: "Pending Workspace",
    variant: "secondary",
    description: "Permintaan Anda tercatat. Admin sedang mencocokkan workspace yang sesuai.",
  },
  ready_for_access: {
    label: "Ready for Access",
    variant: "default",
    description: "Workspace Anda sudah ditemukan. Hubungi admin untuk mendapatkan password sementara.",
  },
  approved: {
    label: "Approved",
    variant: "default",
    description: "Akun Anda sudah disetujui dan aktif.",
  },
  denied: {
    label: "Denied",
    variant: "destructive",
    description: "Permintaan akses Anda ditolak. Hubungi admin untuk informasi lebih lanjut.",
  },
};

function RegistrationStatusCard({ userId }: { userId: string }) {
  const request = useAppQuery(appApi.features.auth.api.getMyRegistrationRequest, { userId });

  if (request === undefined) return null;
  if (request === null) return null;

  const statusInfo = REGISTRATION_STATUS_LABELS[request.status] ?? {
    label: request.status,
    variant: "outline",
    description: "",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Registration Request</CardTitle>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
        <CardDescription>{statusInfo.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2 text-muted-foreground">
          <span>Name</span><span className="text-foreground">{request.name}</span>
          <span>Phone</span><span className="text-foreground">{request.phone}</span>
          {request.matchedWorkspaceCount > 0 && (
            <>
              <span>Matched Workspaces</span>
              <span className="text-foreground">{request.matchedWorkspaceNames.join(", ")}</span>
            </>
          )}
          {request.reviewNote && (
            <>
              <span>Admin Note</span>
              <span className="text-foreground">{request.reviewNote}</span>
            </>
          )}
          {request.temporaryPasswordIssuedAt && (
            <>
              <span>Temp Password</span>
              <span className="text-foreground">
                Issued {formatDistanceToNow(request.temporaryPasswordIssuedAt, { addSuffix: true })}
              </span>
            </>
          )}
          <span>Submitted</span>
          <span className="text-foreground">
            {formatDistanceToNow(request.createdAt, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GeneralSettingsPage() {
  const workspace = useCurrentWorkspace();
  const permissions = useViewerPermissions();
  const { data: session } = useSession();
  const updateWorkspace = useMutation(typedApi.users.workspaces.update);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (workspace) {
      setNewName(workspace.name);
    }
  }, [workspace]);

  if (workspace == null || permissions == null) {
    return <SettingsSkeleton />;
  }

  const defaultPersonalWorkspaceName = buildPersonalWorkspaceName(
    session?.user?.email ?? workspace.slug,
  );

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === workspace.name) return;

    setIsUpdating(true);
    try {
      await updateWorkspace({ workspaceId: workspace._id, name: newName });
      toast.success("Workspace name updated successfully");
    } catch (error) {
      showErrorToast(error, {
        feature: "workspaces",
        title: "Nama workspace belum berhasil diperbarui",
      });
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
              ? `Workspace pribadi Anda otomatis dibuat dari email login, default-nya seperti "${defaultPersonalWorkspaceName}". Nama ini bisa Anda ganti kapan saja.`
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
      {session?.user?.id && <RegistrationStatusCard userId={session.user.id} />}
    </>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6 py-8">
      <Skeleton className="h-10 w-64" />
      <div className="rounded-xl border p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="rounded-xl border p-6 space-y-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-52" />
      </div>
    </div>
  );
}

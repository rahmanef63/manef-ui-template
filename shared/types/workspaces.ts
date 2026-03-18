import type { Id } from "@/shared/types/convex";

export type WorkspaceId = Id<"workspaces">;

export interface BaseWorkspace {
  name: string;
  slug: string;
  isPersonal: boolean;
  pictureUrl?: string | null;
}

export interface WorkspaceSummary extends BaseWorkspace {
  _id: WorkspaceId;
  isDeleted: boolean;
}

export interface WorkspaceDisplayInfo
  extends Pick<BaseWorkspace, "name" | "slug" | "pictureUrl"> {}

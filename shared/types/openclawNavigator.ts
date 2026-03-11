import type { Id } from "@/shared/types/convex";

export interface OpenClawScopeNode {
  _id: Id<"workspaceTrees">;
  agentId?: string;
  agentIds: string[];
  name: string;
  ownerEmail?: string;
  ownerId?: Id<"userProfiles">;
  ownerName: string;
  ownerPhone?: string;
  rootPath: string;
  slug: string;
  type: string;
}

export interface OpenClawScopeRoot extends OpenClawScopeNode {
  childCount: number;
  children: OpenClawScopeNode[];
}

export interface OpenClawScopePayload {
  defaultScopeSlug?: string;
  isAdmin: boolean;
  roots: OpenClawScopeRoot[];
  viewerEmail?: string;
}

import type { Id } from "@/shared/types/convex";

export interface MessageSummary {
  _id: Id<"messages">;
  _creationTime: number;
  text: string;
  author: string;
  authorPictureUrl?: string | null;
  isAuthorDeleted: boolean;
}

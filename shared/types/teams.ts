import type { Id } from "@/shared/types/convex";

export type TeamId = Id<"teams">;

export interface BaseTeam {
  name: string;
  slug: string;
  isPersonal: boolean;
  pictureUrl?: string | null;
}

export interface TeamSummary extends BaseTeam {
  _id: TeamId;
  isDeleted: boolean;
}

export interface TeamDisplayInfo
  extends Pick<BaseTeam, "name" | "slug" | "pictureUrl"> {}

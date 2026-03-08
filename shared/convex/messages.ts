import { makeFunctionReference } from "convex/server";
import { paginationOptsValidator } from "convex/server";
import type { Infer } from "convex/values";
import type { Id } from "@/shared/types/convex";
import type { MessageSummary } from "@/shared/types/messages";

export const listMessagesRef = makeFunctionReference<
  "query",
  {
    teamId: Id<"teams">;
    paginationOpts: Infer<typeof paginationOptsValidator>;
  },
  {
    page: MessageSummary[];
    isDone: boolean;
    continueCursor: string;
  }
>("users/teams/messages:list");

export const createMessageRef = makeFunctionReference<
  "mutation",
  { teamId: Id<"teams">; text: string },
  void
>("users/teams/messages:create");

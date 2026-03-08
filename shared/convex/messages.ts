import { makeFunctionReference } from "convex/server";
import { paginationOptsValidator } from "convex/server";
import type { Infer } from "convex/values";
import type { Id } from "@/shared/types/convex";
import type { MessageSummary } from "@/shared/types/messages";

export const listMessagesRef = makeFunctionReference<
  "query",
  {
    workspaceId: Id<"workspaces">;
    paginationOpts: Infer<typeof paginationOptsValidator>;
  },
  {
    page: MessageSummary[];
    isDone: boolean;
    continueCursor: string;
  }
>("users/workspaces/messages:list");

export const createMessageRef = makeFunctionReference<
  "mutation",
  { workspaceId: Id<"workspaces">; text: string },
  void
>("users/workspaces/messages:create");

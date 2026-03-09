import { makeFunctionReference } from "convex/server";

export const storeUserRef = makeFunctionReference<
  "mutation",
  Record<string, never>,
  string
>("users:store");

export const storeUserFromSessionRef = makeFunctionReference<
  "mutation",
  {
    email: string;
    name?: string;
  },
  string
>("users:storeFromSession");

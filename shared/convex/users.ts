import { makeFunctionReference } from "convex/server";

export const storeUserRef = makeFunctionReference<
  "mutation",
  Record<string, never>,
  string
>("users:store");

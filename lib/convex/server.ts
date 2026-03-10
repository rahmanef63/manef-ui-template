import {
  fetchAction as fetchActionBase,
  fetchMutation as fetchMutationBase,
  fetchQuery as fetchQueryBase,
  type NextjsOptions,
} from "convex/nextjs";
import type {
  ArgsAndOptions,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";
import {
  resolveConvexUrl,
  shouldSkipConvexDeploymentUrlCheck,
} from "@/lib/convex/url";

function getServerConvexUrl() {
  return resolveConvexUrl(
    process.env.CONVEX_SERVER_URL,
    process.env.NEXT_PUBLIC_CONVEX_URL,
  );
}

function withServerUrl(options?: NextjsOptions): NextjsOptions {
  const url = getServerConvexUrl();
  return {
    ...(options ?? {}),
    skipConvexDeploymentUrlCheck:
      options?.skipConvexDeploymentUrlCheck ?? shouldSkipConvexDeploymentUrlCheck(url),
    url,
  };
}

export async function fetchQuery<Query extends FunctionReference<"query">>(
  query: Query,
  ...args: ArgsAndOptions<Query, NextjsOptions>
): Promise<FunctionReturnType<Query>> {
  const [fnArgs, options] = args;
  return fetchQueryBase(query, (fnArgs ?? {}) as never, withServerUrl(options));
}

export async function fetchMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
  ...args: ArgsAndOptions<Mutation, NextjsOptions>
): Promise<FunctionReturnType<Mutation>> {
  const [fnArgs, options] = args;
  return fetchMutationBase(
    mutation,
    (fnArgs ?? {}) as never,
    withServerUrl(options),
  );
}

export async function fetchAction<Action extends FunctionReference<"action">>(
  action: Action,
  ...args: ArgsAndOptions<Action, NextjsOptions>
): Promise<FunctionReturnType<Action>> {
  const [fnArgs, options] = args;
  return fetchActionBase(action, (fnArgs ?? {}) as never, withServerUrl(options));
}

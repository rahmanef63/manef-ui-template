import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@manef/db/api";

// Centralize current Convex interop escape hatches in one place.
// This keeps feature files free from repeated `as any` boilerplate while
// allowing gradual migration back to fully typed generated references.
export const appApi = api as any;
export const useAppQuery = useQuery as any;
export const useAppMutation = useMutation as any;
export const useAppAction = useAction as any;

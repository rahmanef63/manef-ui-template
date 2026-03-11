"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { debugClient } from "@/lib/debug/client";
import { listOpenClawScopesRef } from "@/shared/convex/openclawNavigator";
import type {
  OpenClawScopeNode,
  OpenClawScopePayload,
  OpenClawScopeRoot,
} from "@/shared/types/openclawNavigator";

const ROOT_STORAGE_KEY = "manef:openclaw-root";

function loadStoredValue(key: string) {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(key);
}

function storeValue(key: string, value: string | null) {
  if (typeof window === "undefined") {
    return;
  }
  if (value == null) {
    window.localStorage.removeItem(key);
    return;
  }
  window.localStorage.setItem(key, value);
}

function childStorageKey(rootId: string) {
  return `manef:openclaw-child:${rootId}`;
}

export function useOpenClawNavigator() {
  const payload = useQuery(listOpenClawScopesRef) as OpenClawScopePayload | undefined;
  const params = useParams();
  const routeWorkspaceSlug =
    typeof params?.workspaceSlug === "string" ? params.workspaceSlug : undefined;
  const roots = payload?.roots ?? [];

  const [storedRootId, setStoredRootId] = useState<string | null>(null);
  const [storedChildId, setStoredChildId] = useState<string | null>(null);

  useEffect(() => {
    setStoredRootId(loadStoredValue(ROOT_STORAGE_KEY));
  }, []);

  const routeMatchedRoot = useMemo(
    () =>
      routeWorkspaceSlug
        ? roots.find((root) => root.slug === routeWorkspaceSlug) ?? null
        : null,
    [roots, routeWorkspaceSlug],
  );

  const routeMatchedChild = useMemo(() => {
    if (!routeWorkspaceSlug) {
      return null;
    }
    for (const root of roots) {
      const child = root.children.find((candidate) => candidate.slug === routeWorkspaceSlug);
      if (child) {
        return { child, root };
      }
    }
    return null;
  }, [roots, routeWorkspaceSlug]);

  const selectedRoot = useMemo(() => {
    if (routeMatchedChild?.root) {
      return routeMatchedChild.root;
    }
    if (routeMatchedRoot) {
      return routeMatchedRoot;
    }
    if (payload?.defaultScopeSlug) {
      const byDefaultChild = roots.find((root) =>
        root.children.some((child) => child.slug === payload.defaultScopeSlug),
      );
      if (byDefaultChild) {
        return byDefaultChild;
      }
      const byDefaultRoot = roots.find((root) => root.slug === payload.defaultScopeSlug);
      if (byDefaultRoot) {
        return byDefaultRoot;
      }
    }
    const byStored = roots.find((root) => root._id === storedRootId);
    if (byStored) {
      return byStored;
    }
    return roots[0] ?? null;
  }, [
    payload?.defaultScopeSlug,
    roots,
    routeMatchedChild?.root,
    routeMatchedRoot,
    storedRootId,
  ]);

  useEffect(() => {
    if (!selectedRoot) {
      setStoredChildId(null);
      return;
    }
    setStoredRootId(selectedRoot._id);
    storeValue(ROOT_STORAGE_KEY, selectedRoot._id);
    setStoredChildId(loadStoredValue(childStorageKey(selectedRoot._id)));
  }, [selectedRoot?._id]);

  const selectedChild = useMemo(() => {
    if (!selectedRoot || selectedRoot.children.length === 0) {
      return null;
    }
    if (routeMatchedChild?.root._id === selectedRoot._id) {
      return routeMatchedChild.child;
    }
    if (routeMatchedRoot?._id === selectedRoot._id) {
      return null;
    }
    const byStored = selectedRoot.children.find((child) => child._id === storedChildId);
    return byStored ?? null;
  }, [routeMatchedChild, routeMatchedRoot?._id, selectedRoot, storedChildId]);

  useEffect(() => {
    if (!selectedRoot) {
      return;
    }
    storeValue(
      childStorageKey(selectedRoot._id),
      selectedChild ? selectedChild._id : null,
    );
  }, [selectedChild?._id, selectedRoot?._id]);

  const selectedScope = selectedChild ?? selectedRoot;

  useEffect(() => {
    debugClient("openclaw.scope", {
      isAdmin: payload?.isAdmin ?? false,
      rootCount: roots.length,
      routeWorkspaceSlug: routeWorkspaceSlug ?? null,
      selectedRoot: selectedRoot?.name ?? null,
      selectedChild: selectedChild?.name ?? null,
      defaultScopeSlug: payload?.defaultScopeSlug ?? null,
      selectedScopeAgentIds: selectedScope?.agentIds?.length ?? 0,
    });
  }, [
    payload?.defaultScopeSlug,
    payload?.isAdmin,
    roots.length,
    routeWorkspaceSlug,
    selectedRoot?.name,
    selectedChild?.name,
    selectedScope?.agentIds?.length,
  ]);

  return {
    isAdmin: payload?.isAdmin ?? false,
    isLoading: payload === undefined,
    roots,
    defaultScopeSlug: payload?.defaultScopeSlug,
    selectedRoot,
    selectedChild,
    selectedScope,
    setSelectedRoot(root: OpenClawScopeRoot) {
      setStoredRootId(root._id);
      storeValue(ROOT_STORAGE_KEY, root._id);
      const nextChild = root.children[0]?._id ?? null;
      setStoredChildId(nextChild);
      storeValue(childStorageKey(root._id), nextChild);
    },
    setSelectedChild(child: OpenClawScopeNode | null) {
      const nextChildId = child?._id ?? null;
      setStoredChildId(nextChildId);
      if (selectedRoot) {
        storeValue(childStorageKey(selectedRoot._id), nextChildId);
      }
    },
  };
}

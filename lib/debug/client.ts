"use client";

declare global {
  interface Window {
    __MANEF_DEBUG__?: boolean;
  }
}

function readDebugFlagFromStorage() {
  try {
    return window.localStorage.getItem("manef:debug") === "1";
  } catch {
    return false;
  }
}

export function isManefDebugEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.__MANEF_DEBUG__ === true ||
    readDebugFlagFromStorage() ||
    process.env.NEXT_PUBLIC_MANEF_DEBUG === "1"
  );
}

export function debugClient(scope: string, payload?: unknown) {
  if (!isManefDebugEnabled()) {
    return;
  }

  if (payload === undefined) {
    console.log(`[manef-debug] ${scope}`);
    return;
  }

  console.log(`[manef-debug] ${scope}`, payload);
}

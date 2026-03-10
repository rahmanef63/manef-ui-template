const DEFAULT_CONVEX_URL = "https://dbgg.rahmanef.com";

function normalizeUrl(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

export function resolveConvexUrl(...candidates: Array<string | null | undefined>) {
  for (const candidate of candidates) {
    const normalized = normalizeUrl(candidate);
    if (normalized) {
      return normalized;
    }
  }
  return DEFAULT_CONVEX_URL;
}

export function shouldSkipConvexDeploymentUrlCheck(url: string) {
  try {
    const { hostname } = new URL(url);
    return !(
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".convex.cloud") ||
      hostname.endsWith(".convex.site")
    );
  } catch {
    return false;
  }
}

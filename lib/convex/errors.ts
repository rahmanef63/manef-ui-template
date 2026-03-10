export function isConvexNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const normalizedMessage = error.message.trim().toLowerCase();

  if (
    normalizedMessage === "fetch failed" ||
    normalizedMessage.includes("bad gateway") ||
    normalizedMessage.includes("gateway timeout") ||
    normalizedMessage.includes("service unavailable") ||
    normalizedMessage.includes("upstream connect error") ||
    normalizedMessage.includes("upstream request timeout")
  ) {
    return true;
  }

  const cause = "cause" in error ? error.cause : undefined;
  if (cause === null || typeof cause !== "object") {
    return false;
  }

  const causeCode =
    "code" in cause && typeof cause.code === "string" ? cause.code : undefined;
  const causeName =
    "name" in cause && typeof cause.name === "string" ? cause.name : undefined;

  return [
    "CERT_HAS_EXPIRED",
    "DEPTH_ZERO_SELF_SIGNED_CERT",
    "ECONNREFUSED",
    "ECONNRESET",
    "ENOTFOUND",
    "ETIMEDOUT",
    "SELF_SIGNED_CERT_IN_CHAIN",
    "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    "UND_ERR_CONNECT_TIMEOUT",
  ].includes(causeCode ?? causeName ?? "");
}

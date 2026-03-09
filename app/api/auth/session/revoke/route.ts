import { auth } from "@/auth";
import { authenticateActionRequest } from "@/lib/auth/openclaw";
import { revokeSessionRef } from "@/shared/convex/auth";
import type { Id } from "@/shared/types/convex";
import { fetchMutation } from "convex/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const serviceAuth = await authenticateActionRequest(request, rawBody);
  const session = serviceAuth.mode === "openclaw" ? null : await auth();
  if (
    serviceAuth.mode === "rejected" ||
    (serviceAuth.mode === "anonymous" && !session?.user?.roles.includes("admin"))
  ) {
    return NextResponse.json(
      { status: "forbidden", reason: serviceAuth.mode === "rejected" ? serviceAuth.reason : "forbidden" },
      { status: 403 }
    );
  }

  const body = JSON.parse(rawBody || "{}") as { sessionId?: string };
  if (!body.sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  const result = await fetchMutation(revokeSessionRef, {
    revokedBy:
      serviceAuth.mode === "openclaw"
        ? serviceAuth.actor
        : session?.user?.email ?? session?.user?.id ?? "auth-app:system:unknown",
    sessionId: body.sessionId as Id<"authSessions">,
  });

  return NextResponse.json(
    { status: result },
    { status: result === "not_found" ? 404 : 200 }
  );
}

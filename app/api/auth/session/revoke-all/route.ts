import { auth } from "@/auth";
import { authenticateActionRequest } from "@/lib/auth/openclaw";
import { fetchMutation } from "@/lib/convex/server";
import { revokeAllUserSessionsRef } from "@/shared/convex/auth";
import type { Id } from "@/shared/types/convex";
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

  const body = JSON.parse(rawBody || "{}") as { userId?: string };
  if (!body.userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const result = await fetchMutation(revokeAllUserSessionsRef, {
    revokedBy:
      serviceAuth.mode === "openclaw"
        ? serviceAuth.actor
        : session?.user?.email ?? session?.user?.id ?? "auth-app:system:unknown",
    userId: body.userId as Id<"authUsers">,
  });

  return NextResponse.json(
    { status: result },
    { status: result === "not_found" ? 404 : 200 }
  );
}

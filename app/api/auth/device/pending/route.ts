import { auth } from "@/auth";
import { authenticateActionRequest } from "@/lib/auth/openclaw";
import { fetchQuery } from "@/lib/convex/server";
import { listPendingDevicesRef } from "@/shared/convex/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

  const pendingDevices = await fetchQuery(listPendingDevicesRef, {});
  return NextResponse.json({ items: pendingDevices });
}

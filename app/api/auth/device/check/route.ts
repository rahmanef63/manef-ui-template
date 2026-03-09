import { auth } from "@/auth";
import { buildDeviceContext } from "@/lib/auth/device";
import { getDeviceStatusRef } from "@/shared/convex/auth";
import type { Id } from "@/shared/types/convex";
import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const device = buildDeviceContext(request.headers);
  const status = await fetchQuery(getDeviceStatusRef, {
    deviceHash: device.deviceHash,
    userId: session.user.id as Id<"authUsers">,
  });

  return NextResponse.json({
    deviceId: status?.deviceId ?? null,
    status: status?.status ?? "pending",
  });
}

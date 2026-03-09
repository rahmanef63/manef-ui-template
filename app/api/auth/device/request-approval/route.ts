import { auth } from "@/auth";
import { buildDeviceContext } from "@/lib/auth/device";
import { emitDevicePendingEvent } from "@/lib/auth/openclaw";
import { requestDeviceApprovalRef } from "@/shared/convex/auth";
import type { Id } from "@/shared/types/convex";
import { fetchMutation } from "convex/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const device = buildDeviceContext(request.headers);
  const result = await fetchMutation(requestDeviceApprovalRef, {
    deviceHash: device.deviceHash,
    ip: device.ip,
    label: device.label,
    userAgent: device.userAgent,
    userId: session.user.id as Id<"authUsers">,
  });

  if (result.status === "pending") {
    await emitDevicePendingEvent({
      device: {
        id: result.deviceId,
        label: device.label,
        lastSeenIp: device.ip,
        riskScore: 0,
      },
      policy: {
        policyVersion: session.user.policyVersion ?? 1,
        requireDeviceApproval: true,
      },
      requestContext: {
        ip: device.ip,
        userAgent: device.userAgent,
      },
      user: {
        email: session.user.email ?? "",
        id: session.user.id,
        name: session.user.name ?? undefined,
      },
    });
  }

  return NextResponse.json(result);
}

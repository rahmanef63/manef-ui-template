import { auth } from "@/auth";
import { fetchQuery } from "@/lib/convex/server";
import { listPendingDevicesRef } from "@/shared/convex/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.roles.includes("admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pendingDevices = await fetchQuery(listPendingDevicesRef, {});
  return NextResponse.json({ items: pendingDevices });
}

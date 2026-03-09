import { auth } from "@/auth";
import {
  approveDeviceRef,
  listPendingDevicesRef,
  revokeDeviceRef,
} from "@/shared/convex/auth";
import type { Id } from "@/shared/types/convex";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function approveDeviceAction(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.roles.includes("admin")) {
    redirect("/login");
  }

  const deviceId = String(formData.get("deviceId")) as Id<"authDevices">;
  await fetchMutation(approveDeviceRef, {
    approvedBy: session.user.email ?? session.user.id,
    deviceId,
  });
  revalidatePath("/dashboard/security");
}

async function revokeDeviceAction(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.roles.includes("admin")) {
    redirect("/login");
  }

  const deviceId = String(formData.get("deviceId")) as Id<"authDevices">;
  await fetchMutation(revokeDeviceRef, {
    deviceId,
    revokedBy: session.user.email ?? session.user.id,
  });
  revalidatePath("/dashboard/security");
}

export default async function SecurityPage() {
  const session = await auth();
  if (!session?.user?.roles.includes("admin")) {
    redirect("/dashboard");
  }

  const pendingDevices = await fetchQuery(listPendingDevicesRef, {});

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Device Approval Queue</h1>
          <p className="text-sm text-muted-foreground">
            Pending device approvals for Auth App. This page stays local even if
            OpenClaw notification delivery fails.
          </p>
        </div>

        <div className="rounded-2xl border bg-card">
          <div className="border-b px-5 py-4 text-sm text-muted-foreground">
            {pendingDevices.length} pending device{pendingDevices.length === 1 ? "" : "s"}
          </div>
          <div className="divide-y">
            {pendingDevices.length === 0 ? (
              <div className="px-5 py-8 text-sm text-muted-foreground">
                No pending devices right now.
              </div>
            ) : (
              pendingDevices.map((device) => (
                <div
                  key={device._id}
                  className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{device.name}</div>
                    <div className="text-sm text-muted-foreground">{device.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {device.label ?? "Unknown device"} | IP {device.lastSeenIp ?? "unknown"} | Last seen{" "}
                      {new Date(device.lastSeenAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <form action={approveDeviceAction}>
                      <input type="hidden" name="deviceId" value={device._id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={revokeDeviceAction}>
                      <input type="hidden" name="deviceId" value={device._id} />
                      <button
                        type="submit"
                        className="rounded-lg border px-4 py-2 text-sm font-medium"
                      >
                        Revoke
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

import { signIn } from "@/auth";
import { emitDevicePendingEvent } from "@/lib/auth/openclaw";
import { buildDeviceContext } from "@/lib/auth/device";
import { isConvexNetworkError } from "@/lib/convex/errors";
import { fetchMutation } from "@/lib/convex/server";
import { getErrorPresentationFromCode } from "@/shared/errors/appErrorPresentation";
import { authorizePasswordLoginRef } from "@/shared/convex/auth";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage(props: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; code?: string }>;
}) {
  const searchParams = await props.searchParams;
  const errorKey = searchParams.code ?? searchParams.error;
  const errorPresentation = errorKey
    ? getErrorPresentationFromCode(errorKey, "auth")
    : searchParams.error
      ? getErrorPresentationFromCode("1", "auth")
      : undefined;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl bg-card text-card-foreground shadow-md p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Access your dashboard</p>
        </div>
        {errorPresentation && (
          <div className="space-y-1 rounded bg-destructive/10 px-3 py-3 text-sm text-destructive">
            <p className="font-medium">{errorPresentation.title}</p>
            <p>{errorPresentation.description}</p>
          </div>
        )}
        <form
          action={async (formData: FormData) => {
            "use server";
            try {
              const requestHeaders = await headers();
              const device = buildDeviceContext(requestHeaders);
              const preflight = await fetchMutation(
                authorizePasswordLoginRef,
                {
                  createSession: false,
                  deviceHash: device.deviceHash,
                  identifier: String(formData.get("identifier") ?? ""),
                  ip: device.ip,
                  label: device.label,
                  password: String(formData.get("password") ?? ""),
                  userAgent: device.userAgent,
                }
              );

              if (preflight.code !== "APPROVED") {
                if (preflight.code === "DEVICE_APPROVAL_REQUIRED" && preflight.deviceId) {
                  await emitDevicePendingEvent({
                    device: {
                      id: preflight.deviceId,
                      label: device.label,
                      lastSeenIp: device.ip,
                      riskScore: 0,
                    },
                    policy: {
                      policyVersion: preflight.policyVersion ?? 1,
                      requireDeviceApproval: true,
                    },
                    requestContext: {
                      ip: device.ip,
                      userAgent: device.userAgent,
                    },
                    user: {
                      email: String(formData.get("identifier") ?? ""),
                      id: preflight.userId,
                      name: undefined,
                    },
                  });
                }
                redirect(`/login?code=${preflight.code.toLowerCase()}&callbackUrl=${encodeURIComponent(searchParams.callbackUrl ?? "/dashboard")}`);
              }

              await signIn("credentials", {
                identifier: formData.get("identifier"),
                password: formData.get("password"),
                redirectTo: searchParams.callbackUrl ?? "/dashboard",
              });
            } catch (error) {
              if (error instanceof AuthError) {
                const code =
                  typeof error.cause === "object" &&
                  error.cause !== null &&
                  "code" in error.cause &&
                  typeof error.cause.code === "string"
                    ? error.cause.code
                    : "1";
                redirect(`/login?code=${code}`);
              }
              if (isConvexNetworkError(error)) {
                redirect(
                  `/login?code=service_unavailable&callbackUrl=${encodeURIComponent(searchParams.callbackUrl ?? "/dashboard")}`,
                );
              }
              throw error;
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label htmlFor="identifier" className="text-sm font-medium">Email atau nomor telepon</label>
            <input
              id="identifier" name="identifier" type="text" required
              className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="rahmanef63@gmail.com atau +628..."
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password" name="password" type="password" required
              className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-semibold hover:opacity-90 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}

import { signIn } from "@/auth";
import { emitDevicePendingEvent } from "@/lib/auth/openclaw";
import { buildDeviceContext } from "@/lib/auth/device";
import { isConvexNetworkError } from "@/lib/convex/errors";
import { fetchMutation } from "@/lib/convex/server";
import { getErrorPresentationFromCode } from "@/shared/errors/appErrorPresentation";
import {
  authorizePasswordLoginRef,
  submitPasswordResetRequestRef,
  submitRegistrationRequestRef,
} from "@/shared/convex/auth";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const REGISTRATION_NOTICES = {
  pending_workspace: {
    description:
      "Permintaan Anda sudah tercatat, tetapi workspace belum ditemukan. Hubungi Rahman untuk approval workspace Anda.",
    title: "Workspace belum tersedia",
  },
  ready_for_access: {
    description:
      "Nomor Anda sudah cocok dengan workspace yang ada. Hubungi Rahman untuk mendapatkan password sementara Anda.",
    title: "Workspace sudah terhubung",
  },
  password_changed: {
    description:
      "Password Anda sudah diperbarui. Silakan login lagi menggunakan password baru Anda.",
    title: "Password berhasil diganti",
  },
  password_reset_requested: {
    description:
      "Permintaan reset password sudah dikirim ke admin. Hubungi Rahman untuk mendapatkan password sementara Anda.",
    title: "Permintaan reset password terkirim",
  },
} as const;

export default async function LoginPage(props: {
  searchParams: Promise<{
    callbackUrl?: string;
    code?: string;
    error?: string;
    mode?: string;
    notice?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const mode =
    searchParams.mode === "register"
      ? "register"
      : searchParams.mode === "forgot"
        ? "forgot"
        : "login";
  const errorKey = searchParams.code ?? searchParams.error;
  const errorPresentation = errorKey
    ? getErrorPresentationFromCode(errorKey, "auth")
    : searchParams.error
      ? getErrorPresentationFromCode("1", "auth")
      : undefined;
  const registrationNotice =
    searchParams.notice && searchParams.notice in REGISTRATION_NOTICES
      ? REGISTRATION_NOTICES[
          searchParams.notice as keyof typeof REGISTRATION_NOTICES
        ]
      : undefined;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl bg-card text-card-foreground shadow-md p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "register" ? "Daftar" : "Sign in"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "register"
              ? "Daftarkan nomor Anda agar admin bisa menyiapkan akses workspace."
              : "Access your dashboard"}
          </p>
        </div>
        <div className="grid grid-cols-2 rounded-lg bg-muted p-1 text-sm">
          <Link
            href="/login"
            className={`rounded-md px-3 py-2 text-center font-medium transition-colors ${
              mode === "login"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Masuk
          </Link>
          <Link
            href="/login?mode=register"
            className={`rounded-md px-3 py-2 text-center font-medium transition-colors ${
              mode === "register"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Daftar
          </Link>
        </div>
        <div className="text-right text-sm">
          <Link
            href="/login?mode=forgot"
            className={`font-medium transition-colors ${
              mode === "forgot" ? "text-foreground" : "text-primary hover:opacity-80"
            }`}
          >
            Lupa password?
          </Link>
        </div>
        {errorPresentation && (
          <div className="space-y-1 rounded bg-destructive/10 px-3 py-3 text-sm text-destructive">
            <p className="font-medium">{errorPresentation.title}</p>
            <p>{errorPresentation.description}</p>
          </div>
        )}
        {registrationNotice && (
          <div className="space-y-1 rounded bg-emerald-500/10 px-3 py-3 text-sm text-emerald-700">
            <p className="font-medium">{registrationNotice.title}</p>
            <p>{registrationNotice.description}</p>
          </div>
        )}
        {mode === "register" ? (
          <form
            action={async (formData: FormData) => {
              "use server";
              try {
                const result = await fetchMutation(submitRegistrationRequestRef, {
                  context: String(formData.get("context") ?? ""),
                  name: String(formData.get("name") ?? ""),
                  phone: String(formData.get("phone") ?? ""),
                });
                const notice = result.hasWorkspace
                  ? "ready_for_access"
                  : "pending_workspace";
                redirect(`/login?mode=register&notice=${notice}`);
              } catch (error) {
                if (isConvexNetworkError(error)) {
                  redirect("/login?mode=register&code=service_unavailable");
                }
                throw error;
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium">
                Nomor telepon
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="+62812..."
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Nama
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Nama Anda"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="context" className="text-sm font-medium">
                Kamu siapa?
              </label>
              <textarea
                id="context"
                name="context"
                required
                rows={4}
                className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Jelaskan konteks Anda agar admin paham siapa yang mendaftar."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-semibold hover:opacity-90 transition-colors"
            >
              Kirim permintaan akses
            </button>
          </form>
        ) : mode === "forgot" ? (
          <form
            action={async (formData: FormData) => {
              "use server";
              try {
                await fetchMutation(submitPasswordResetRequestRef, {
                  context: String(formData.get("context") ?? ""),
                  identifier: String(formData.get("identifier") ?? ""),
                });
                redirect("/login?mode=forgot&notice=password_reset_requested");
              } catch (error) {
                if (isConvexNetworkError(error)) {
                  redirect("/login?mode=forgot&code=service_unavailable");
                }
                throw error;
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label htmlFor="identifier" className="text-sm font-medium">
                Email atau nomor telepon
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="rahmanef63@gmail.com atau +628..."
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="context" className="text-sm font-medium">
                Catatan untuk admin
              </label>
              <textarea
                id="context"
                name="context"
                rows={4}
                className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Opsional. Jelaskan konteks reset password Anda."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-semibold hover:opacity-90 transition-colors"
            >
              Kirim permintaan reset password
            </button>
          </form>
        ) : (
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
                  redirectTo: preflight.mustChangePassword
                    ? "/set-password"
                    : searchParams.callbackUrl ?? "/dashboard",
                  identifier: formData.get("identifier"),
                  password: formData.get("password"),
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
        )}
      </div>
    </main>
  );
}

import { auth, signOut } from "@/auth";
import { fetchMutation } from "@/lib/convex/server";
import { changePasswordRef } from "@/shared/convex/auth";
import { redirect } from "next/navigation";

const ERROR_MESSAGES = {
  current_password_invalid: "Password saat ini tidak cocok. Coba lagi dengan password sementara yang benar.",
  password_mismatch: "Konfirmasi password baru tidak cocok.",
  password_too_short: "Password baru minimal 6 karakter.",
  service_unavailable: "Layanan autentikasi sedang tidak bisa dijangkau. Coba lagi beberapa saat lagi.",
} as const;

export default async function SetPasswordPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!session.user.mustChangePassword) {
    redirect("/dashboard");
  }

  const searchParams = await props.searchParams;
  const errorKey = searchParams.error as keyof typeof ERROR_MESSAGES | undefined;
  const errorMessage = errorKey ? ERROR_MESSAGES[errorKey] : undefined;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl bg-card text-card-foreground shadow-md p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ganti password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Anda login dengan password sementara. Buat password baru sebelum masuk ke dashboard.
          </p>
        </div>
        {errorMessage ? (
          <div className="space-y-1 rounded bg-destructive/10 px-3 py-3 text-sm text-destructive">
            <p className="font-medium">Password belum berhasil diperbarui</p>
            <p>{errorMessage}</p>
          </div>
        ) : null}
        <form
          action={async (formData: FormData) => {
            "use server";

            const currentPassword = String(formData.get("currentPassword") ?? "");
            const newPassword = String(formData.get("newPassword") ?? "");
            const confirmPassword = String(formData.get("confirmPassword") ?? "");

            if (newPassword.trim().length < 6) {
              redirect("/set-password?error=password_too_short");
            }
            if (newPassword !== confirmPassword) {
              redirect("/set-password?error=password_mismatch");
            }

            try {
              await fetchMutation(changePasswordRef, {
                currentPassword,
                newPassword,
                userId: session.user.id as any,
              });
            } catch (error) {
              const message = error instanceof Error ? error.message : "";
              if (message.includes("Current password is invalid")) {
                redirect("/set-password?error=current_password_invalid");
              }
              redirect("/set-password?error=service_unavailable");
            }

            await signOut({
              redirectTo: "/login?notice=password_changed",
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label htmlFor="currentPassword" className="text-sm font-medium">
              Password sementara
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="newPassword" className="text-sm font-medium">
              Password baru
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Konfirmasi password baru
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-semibold hover:opacity-90 transition-colors"
          >
            Simpan password baru
          </button>
        </form>
      </div>
    </main>
  );
}

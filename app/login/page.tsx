import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user !== undefined) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main className="container max-w-md py-16">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      {hasError ? (
        <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Invalid email or password.
        </p>
      ) : null}
      <form
        action={async (formData) => {
          "use server";
          try {
            await signIn("credentials", {
              email: String(formData.get("email") ?? ""),
              password: String(formData.get("password") ?? ""),
              redirectTo: "/dashboard",
            });
          } catch (error) {
            if (error instanceof AuthError) {
              redirect("/login?error=1");
            }
            throw error;
          }
        }}
        className="space-y-4"
      >
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </main>
  );
}

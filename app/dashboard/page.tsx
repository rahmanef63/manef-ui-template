import { auth } from "@/auth";
import { fetchMutation } from "@/lib/convex/server";
import { INVITE_PARAM } from "@/shared/constants/invite";
import { storeUserFromSessionRef, storeUserRef } from "@/shared/convex/users";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [INVITE_PARAM]?: string }>;
}) {
  const params = await searchParams;
  const invite = params[INVITE_PARAM];
  const queryString = invite !== undefined ? `?${INVITE_PARAM}=${invite}` : "";
  const callbackUrl = `/dashboard${queryString}`;
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  let workspaceSlug: string;
  try {
    workspaceSlug = await fetchMutation(storeUserFromSessionRef, {
      email: session.user.email,
      name: session.user.name ?? undefined,
    });
  } catch (error) {
    console.error("[DashboardPage] Failed to resolve workspace:", error);
    try {
      workspaceSlug = await fetchMutation(storeUserRef);
    } catch (fallbackError) {
      console.error(
        "[DashboardPage] Fallback identity workspace lookup failed:",
        fallbackError,
      );
      redirect(
        `/login?code=service_unavailable&callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
    }
  }

  if (!workspaceSlug) {
    redirect(
      `/login?code=service_unavailable&callbackUrl=${encodeURIComponent(callbackUrl)}`,
    );
  }

  redirect(`/dashboard/${workspaceSlug}${queryString}`);
}

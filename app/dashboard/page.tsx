import { INVITE_PARAM } from "@/shared/constants/invite";
import { storeUserFromSessionRef, storeUserRef } from "@/shared/convex/users";
import { auth } from "@/auth";
import { fetchMutation } from "@/lib/convex/server";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [INVITE_PARAM]?: string }>;
}) {
  const params = await searchParams;
  const invite = params[INVITE_PARAM];
  const queryString = invite !== undefined ? `?${INVITE_PARAM}=${invite}` : "";
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
    // Fallback: try with the generic store (identity-based)
    try {
      workspaceSlug = await fetchMutation(storeUserRef);
    } catch {
      // Ultimate fallback — redirect to a "main" workspace slug
      workspaceSlug = "main";
    }
  }

  if (!workspaceSlug) {
    workspaceSlug = "main";
  }

  redirect(`/dashboard/${workspaceSlug}${queryString}`);
}

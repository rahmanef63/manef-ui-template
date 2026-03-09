import { INVITE_PARAM } from "@/shared/constants/invite";
import { storeUserFromSessionRef, storeUserRef } from "@/shared/convex/users";
import { auth } from "@/auth";
import { fetchMutation } from "convex/nextjs";
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
  const workspaceSlug = session?.user?.email
    ? await fetchMutation(storeUserFromSessionRef, {
        email: session.user.email,
        name: session.user.name ?? undefined,
      })
    : await fetchMutation(storeUserRef);
  redirect(`/dashboard/${workspaceSlug}${queryString}`);
}

import { INVITE_PARAM } from "@/shared/constants/invite";
import { storeUserRef } from "@/shared/convex/users";
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
  // Do not pass the fake auth token. users.store will fallback to admin@example.com
  const workspaceSlug = await fetchMutation(storeUserRef);
  redirect(`/dashboard/${workspaceSlug}${queryString}`);
}

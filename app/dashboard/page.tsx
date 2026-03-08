import { INVITE_PARAM } from "@/shared/constants/invite";
import { getAuthToken } from "@/shared/auth/getAuthToken";
import { storeUserRef } from "@/shared/convex/users";
import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [INVITE_PARAM]?: string };
}) {
  const invite = searchParams[INVITE_PARAM];
  const queryString = invite !== undefined ? `?${INVITE_PARAM}=${invite}` : "";
  const token = await getAuthToken();
  const teamSlug = await fetchMutation(storeUserRef, {}, { token });
  redirect(`/dashboard/${teamSlug}${queryString}`);
}

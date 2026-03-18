import { auth } from "@/auth";

export async function getAuthToken() {
  const session = await auth();
  if (!session?.user?.email) return undefined;
  // Simple token for server-side Convex queries
  return `session:${session.user.email}`;
}

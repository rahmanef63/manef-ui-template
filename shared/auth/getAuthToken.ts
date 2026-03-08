import { auth } from "@/auth";

export async function getAuthToken() {
  const session = await auth();
  if (session?.user?.email === undefined || session.user.email.length === 0) {
    return undefined;
  }
  return `session:${session.user.email}`;
}

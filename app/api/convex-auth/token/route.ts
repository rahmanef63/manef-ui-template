import { issueConvexAccessToken } from "@/lib/auth/convexJwt";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await issueConvexAccessToken();
  if (!token) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({ token }, { headers: { "Cache-Control": "no-store" } });
}

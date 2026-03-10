import { issueConvexAccessToken } from "@/lib/auth/convexJwt";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = await issueConvexAccessToken();
    if (!token) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    return NextResponse.json(
      { token },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[convex-auth/token] failed to issue token", error);
    return NextResponse.json(
      { error: "convex_auth_unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

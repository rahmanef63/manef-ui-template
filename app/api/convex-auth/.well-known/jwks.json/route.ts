import { getConvexJwk } from "@/lib/auth/convexJwt";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jwk = await getConvexJwk();
    return NextResponse.json(
      { keys: [jwk] },
      { headers: { "Cache-Control": "public, max-age=300" } },
    );
  } catch (error) {
    console.error("[convex-auth/jwks] failed to build jwk", error);
    return NextResponse.json(
      { error: "convex_auth_unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

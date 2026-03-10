import { getConvexJwk } from "@/lib/auth/convexJwt";
import { NextResponse } from "next/server";

export async function GET() {
  const jwk = await getConvexJwk();
  return NextResponse.json(
    { keys: [jwk] },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}

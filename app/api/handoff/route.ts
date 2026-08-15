export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { upsertAthlete } from "@/lib/upsert-athlete";
import { verifyHandoffToken } from "@/lib/handoff";

/**
 * Sign an athlete in from a Shepherd Mental Edge handoff token.
 *
 * The token is HMAC-signed by the main app with a secret only the Shepherd apps
 * share, and carries an identity the main app already verified against its own
 * roster — so we can skip the welcome form entirely.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = verifyHandoffToken(body?.token);

    if (!payload) {
      return NextResponse.json(
        { error: "That sign-in link has expired. Please enter your details." },
        { status: 401 },
      );
    }

    const result = await upsertAthlete({
      email: payload.e,
      full_name: (payload.n || "").trim() || payload.e.split("@")[0],
      team_name: payload.t ?? null,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Handoff sign-in error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

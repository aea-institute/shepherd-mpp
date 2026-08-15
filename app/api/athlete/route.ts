export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { upsertAthlete } from "@/lib/upsert-athlete";

// Upsert an athlete by email. Returns the athlete row (with id) so the
// client can stash it in localStorage. No passwords — email + name only.
export async function POST(req: NextRequest) {
  try {
    const { email, full_name, team_name } = await req.json();

    if (!email?.trim() || !full_name?.trim()) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    const result = await upsertAthlete({ email, full_name, team_name });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Athlete upsert error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

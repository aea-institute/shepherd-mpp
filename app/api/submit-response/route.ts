export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createHandoffToken } from "@/lib/handoff";
import { DASHBOARD_URL } from "@/lib/dashboard";
import { getProtocol } from "@/lib/protocols";

// Store a single protocol's responses. One row per attempt.
export async function POST(req: NextRequest) {
  try {
    const { athlete_id, protocol_number, protocol_slug, responses } = await req.json();

    if (!athlete_id || !protocol_number || !protocol_slug || !responses) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { createServiceClient, devFallbackAllowed } = await import("@/lib/supabase");

    // Local dev without Supabase: accept and no-op so flows complete. The
    // client also caches completion locally. Never runs in production.
    if (devFallbackAllowed()) {
      return NextResponse.json({ success: true, dev: true });
    }

    const supabase = createServiceClient();

    // Verify the athlete exists (and pull identity for the dashboard report).
    const { data: athlete, error: athleteErr } = await supabase
      .from("athletes")
      .select("id, email, full_name, team_name")
      .eq("id", athlete_id)
      .single();

    if (athleteErr || !athlete) {
      return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
    }

    const { error: insertErr } = await supabase.from("mpp_responses").insert({
      athlete_id,
      protocol_number,
      protocol_slug,
      responses,
    });

    if (insertErr) throw insertErr;

    // Report the completion to the main app's coach dashboard — best effort.
    // Reuses the shared handoff secret (no new env). Sends only WHICH protocol
    // was completed, never the athlete's answers. Never blocks the athlete.
    try {
      const token = athlete.email
        ? createHandoffToken({
            n: athlete.full_name ?? "",
            e: athlete.email,
            t: athlete.team_name ?? null,
            s: null,
          })
        : null;
      if (token) {
        await fetch(`${DASHBOARD_URL}/api/mpp-completion`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            protocol_slug,
            protocol_title: getProtocol(protocol_slug)?.title ?? null,
          }),
        });
      }
    } catch (reportErr) {
      console.error("mpp-completion report failed (non-fatal):", reportErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit response error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Find-or-create an athlete by email and return them with their completed
// protocols. Shared by /api/athlete (details typed in) and /api/handoff
// (identity handed over from Shepherd Mental Edge).

export type UpsertResult = {
  athlete: {
    id: string;
    email: string;
    full_name: string;
    team_name: string | null;
  };
  completed: number[];
};

export async function upsertAthlete(input: {
  email: string;
  full_name: string;
  team_name?: string | null;
}): Promise<UpsertResult> {
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanName = input.full_name.trim();
  const cleanTeam = input.team_name?.trim() || null;

  const { createServiceClient, devFallbackAllowed, devAthleteId } = await import("@/lib/supabase");

  // Local dev without Supabase: stable in-memory athlete so the full flow is
  // testable. Never runs in production.
  if (devFallbackAllowed()) {
    return {
      athlete: {
        id: devAthleteId(cleanEmail),
        email: cleanEmail,
        full_name: cleanName,
        team_name: cleanTeam,
      },
      completed: [],
    };
  }

  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("athletes")
    .select("*")
    .eq("email", cleanEmail)
    .maybeSingle();

  let athlete = existing;

  if (athlete) {
    // Refresh name/team in case they changed
    const { data: updated, error: updErr } = await supabase
      .from("athletes")
      .update({ full_name: cleanName, team_name: cleanTeam })
      .eq("id", athlete.id)
      .select("*")
      .single();
    if (updErr) throw updErr;
    athlete = updated;
  } else {
    const { data: created, error: insErr } = await supabase
      .from("athletes")
      .insert({ email: cleanEmail, full_name: cleanName, team_name: cleanTeam })
      .select("*")
      .single();
    if (insErr) throw insErr;
    athlete = created;
  }

  const { data: rows } = await supabase
    .from("mpp_responses")
    .select("protocol_number")
    .eq("athlete_id", athlete.id);

  const completed = [...new Set((rows || []).map((r) => r.protocol_number))].sort(
    (a, b) => a - b
  );

  return { athlete, completed };
}

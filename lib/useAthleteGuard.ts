"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAthlete, setAthlete, setCompleted, type Athlete } from "./athlete";

/**
 * Guards a protocol page.
 *
 * If there's no athlete session on this device, first check for a Shepherd
 * Mental Edge handoff token in the URL and sign them in with it — that's what
 * lets a deep link like /journey?sme=… land on the journey instead of bouncing
 * back to the welcome form. Failing that, redirect to landing.
 */
export function useAthleteGuard(): { athlete: Athlete | null; ready: boolean } {
  const router = useRouter();
  const [athlete, setAthleteState] = useState<Athlete | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = getAthlete();
    if (existing) {
      setAthleteState(existing);
      setReady(true);
      return;
    }

    const token =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("sme")
        : null;

    if (!token) {
      router.replace("/");
      return;
    }

    let cancelled = false;

    fetch("/api/handoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (cancelled) return;

        setAthlete(data.athlete);
        setCompleted(data.completed || []);
        setAthleteState(data.athlete);
        setReady(true);

        // Drop the token from the address bar once it's been used.
        const url = new URL(window.location.href);
        url.searchParams.delete("sme");
        window.history.replaceState({}, "", url.toString());
      })
      .catch(() => {
        if (!cancelled) router.replace("/");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return { athlete, ready };
}

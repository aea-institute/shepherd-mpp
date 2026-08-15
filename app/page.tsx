"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import WelcomeForm from "@/components/WelcomeForm";
import { getAthlete, setAthlete, setCompleted } from "@/lib/athlete";

export default function LandingPage() {
  const router = useRouter();
  // Hold the welcome form back until we know whether this athlete is already
  // signed in or arrived with a handoff token.
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    // Already signed in on this device? Skip straight to the journey.
    if (getAthlete()) {
      router.replace("/journey");
      return;
    }

    // Arrived from Shepherd Mental Edge with a signed identity? Sign in silently.
    const token = new URLSearchParams(window.location.search).get("sme");
    if (!token) {
      setBooting(false);
      return;
    }

    fetch("/api/handoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setAthlete(data.athlete);
        setCompleted(data.completed || []);
        router.replace("/journey");
      })
      .catch(() => {
        // Expired or misconfigured — fall back to the welcome form.
        setBooting(false);
      });
  }, [router]);

  return (
    <main className="screen flex flex-col min-h-screen pb-12">
      <header className="pt-8">
        <Wordmark />
      </header>

      <section className="mt-14">
        <p className="eyebrow mb-4">The Shepherd Mental Edge</p>
        <h1
          className="font-display"
          style={{ fontSize: 40, lineHeight: 1.02, color: "var(--cream)" }}
        >
          SHEPHERD
          <br />
          MENTAL EDGE
          <br />
          PROTOCOLS
        </h1>
        <p
          className="font-display"
          style={{ fontSize: 22, lineHeight: 1.1, color: "var(--gold)", marginTop: 10 }}
        >
          (Overcoming Your Goliaths)
        </p>
        <p
          style={{
            marginTop: 18,
            fontSize: 16,
            lineHeight: 1.5,
            color: "var(--muted)",
            maxWidth: 340,
          }}
        >
          7 exercises that separate good athletes from great ones.
        </p>
      </section>

      <section className="card mt-10 p-6">
        {booting ? (
          <p style={{ fontSize: 14, color: "var(--muted)", textAlign: "center" }}>
            Signing you in…
          </p>
        ) : (
          <>
            <p
              className="font-head"
              style={{ fontSize: 13, fontWeight: 700, color: "var(--cream)", marginBottom: 16 }}
            >
              Enter your details to begin.
            </p>
            <WelcomeForm />
          </>
        )}
      </section>

      <p
        style={{
          marginTop: "auto",
          paddingTop: 28,
          fontSize: 12,
          color: "var(--muted)",
          textAlign: "center",
        }}
      >
        Your progress saves automatically after each protocol.
      </p>
    </main>
  );
}

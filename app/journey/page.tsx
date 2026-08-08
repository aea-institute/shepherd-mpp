"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import { PROTOCOLS, ACCENT_HEX, COMPLETE_HEX } from "@/lib/protocols";
import { getAthlete, getCompleted, clearAthlete, type Athlete } from "@/lib/athlete";

export default function JourneyPage() {
  const router = useRouter();
  const [athlete, setAth] = useState<Athlete | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = getAthlete();
    if (!a) {
      router.replace("/");
      return;
    }
    setAth(a);
    setCompleted(getCompleted());
    setReady(true);
  }, [router]);

  if (!ready || !athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span style={{ color: "var(--muted)", fontSize: 14 }}>Loading…</span>
      </div>
    );
  }

  // Count only completions for currently-visible protocols, so stale saves from
  // hidden/old-numbered protocols can't push the counter past PROTOCOLS.length.
  const doneCount = completed.filter((n) => PROTOCOLS.some((p) => p.number === n)).length;
  const firstName = athlete.full_name.split(" ")[0];

  return (
    <main className="screen flex flex-col min-h-screen pb-12">
      <header className="pt-8 flex items-center justify-between">
        <Wordmark size={54} />
        <button
          onClick={() => {
            clearAthlete();
            router.replace("/");
          }}
          className="font-head"
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: 12,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Sign out
        </button>
      </header>

      <section className="mt-9">
        <p className="eyebrow mb-3">Welcome, {firstName}</p>
        <h1 className="font-display" style={{ fontSize: 30, lineHeight: 1.05, color: "var(--cream)" }}>
          YOUR PROTOCOLS
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <div className="progress-track" style={{ maxWidth: 200 }}>
            <div className="progress-fill" style={{ width: `${(doneCount / PROTOCOLS.length) * 100}%` }} />
          </div>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {doneCount}/{PROTOCOLS.length} complete
          </span>
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-3.5">
        {/* Orientation — not a protocol; links to the /welcome overview */}
        <Link href="/welcome" style={{ textDecoration: "none" }}>
          <div
            className="module-card p-5 flex items-center gap-4"
            style={{ borderColor: "var(--gold)" }}
          >
            <div
              className="font-head flex items-center justify-center shrink-0"
              style={{
                width: 46,
                height: 46,
                borderRadius: 13,
                background: "var(--gold)",
                color: "#ffffff",
                border: "1px solid var(--gold)",
                fontSize: 20,
              }}
            >
              ★
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                className="font-display"
                style={{ fontSize: 16, fontWeight: 700, color: "var(--cream)", lineHeight: 1.25 }}
              >
                Start Here
              </p>
              <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3, lineHeight: 1.3 }}>
                “Overcoming Your Goliaths”
              </p>
              <span
                className="font-head"
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  fontSize: 9.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "var(--gold)",
                }}
              >
                Orientation
              </span>
            </div>
          </div>
        </Link>

        {PROTOCOLS.map((p) => {
          const isDone = completed.includes(p.number);
          const hex = ACCENT_HEX[p.accent];
          const badge = isDone ? COMPLETE_HEX : hex;
          return (
            <Link key={p.slug} href={p.route} style={{ textDecoration: "none" }}>
              <div className={`module-card ${isDone ? "done" : ""} p-5 flex items-center gap-4`}>
                <div
                  className="font-display flex items-center justify-center shrink-0"
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 13,
                    background: isDone ? badge : "rgba(176,141,60,0.10)",
                    color: isDone ? "#ffffff" : hex,
                    border: `1px solid ${isDone ? badge : "var(--border)"}`,
                    fontSize: 19,
                  }}
                >
                  {p.number}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="font-display"
                    style={{ fontSize: 16, fontWeight: 700, color: "var(--cream)", lineHeight: 1.25 }}
                  >
                    {p.title}
                  </p>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3, lineHeight: 1.3 }}>
                    {p.subtitle}
                  </p>
                  <span
                    className="font-head"
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      fontSize: 9.5,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: hex,
                    }}
                  >
                    {p.output}
                  </span>
                </div>

                <span style={{ fontSize: 18, color: isDone ? COMPLETE_HEX : "var(--muted)" }}>
                  {isDone ? "✓" : "→"}
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}

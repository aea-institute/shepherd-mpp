"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepHeader from "@/components/StepHeader";
import Wordmark from "@/components/Wordmark";
import Scripture from "@/components/Scripture";
import SaveError from "@/components/SaveError";
import { SCRIPTURE } from "@/lib/protocols";
import { Loading } from "@/components/StepUI";
import { useAthleteGuard } from "@/lib/useAthleteGuard";
import { saveResponse, SAVE_ERROR } from "@/lib/storage";

const TOTAL = 2;

type Category = { key: string; label: string; options: string[] };

const CATEGORIES: Category[] = [
  {
    key: "energy",
    label: "Energy",
    options: [
      "I bring high energy every single day",
      "I set the tone with my intensity",
      "I never let my energy negatively affect my teammates.",
      "I am the spark when the team needs a lift",
      "I control my energy regardless of the score",
    ],
  },
  {
    key: "effort",
    label: "Effort",
    options: [
      "I give maximum effort every rep, every play",
      "I never take a play off",
      "I outwork everyone in the room",
      "I compete like every moment matters",
      "I finish every drill at full speed",
    ],
  },
  {
    key: "daily_habit",
    label: "Daily Habit",
    options: [
      "I am always on time — early is on time",
      "I watch film every week without being asked",
      "I take care of my body: sleep, nutrition, recovery",
      "I prepare mentally before every practice and game",
      "I review my goals every morning",
    ],
  },
  {
    key: "teammate",
    label: "Teammate",
    options: [
      "I hold myself to the highest standard so others rise",
      "I encourage teammates after every mistake",
      "I never throw a teammate under the bus",
      "I celebrate others' success like it's my own",
      "I am the teammate I wish I had",
    ],
  },
];

export default function NonNegotiablesPage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!ready || !athlete) return <Loading />;

  const allPicked = CATEGORIES.every((c) => picks[c.key]);
  const chosen = CATEGORIES.map((c) => ({ category: c.label, statement: picks[c.key] }));

  async function goToReveal() {
    if (saved) {
      setStep(2);
      return;
    }
    setSaving(true);
    setSaveError("");
    const ok = await saveResponse(3, "non-negotiables", { non_negotiables: chosen });
    setSaving(false);
    if (!ok) {
      setSaveError(SAVE_ERROR);
      return;
    }
    setSaved(true);
    setStep(2);
  }

  return (
    <main className="screen flex flex-col min-h-screen pb-10">
      <StepHeader
        eyebrow="Protocol 3 · Non-Negotiables"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep(1)}
      />

      {/* STEP 1 — Pick four */}
      {step === 1 && (
        <section className="screen mt-2 flex flex-col flex-1">
          <h1 className="font-display" style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.2, color: "var(--cream)" }}>
            Your 4 Non-Negotiables.
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
            The standards you never break — as an athlete. Pick one from each.
          </p>

          <div className="mt-7 flex flex-col gap-5">
            {CATEGORIES.map((c, i) => (
              <div key={c.key}>
                <label
                  className="font-head flex items-center gap-2"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: picks[c.key] ? "var(--gold)" : "var(--muted)",
                    marginBottom: 8,
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      background: picks[c.key] ? "var(--gold)" : "var(--navy-card)",
                      color: picks[c.key] ? "#fff" : "var(--muted)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                    }}
                  >
                    {i + 1}
                  </span>
                  {c.label}
                </label>
                <select
                  className="select-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
                  value={picks[c.key] || ""}
                  onChange={(e) => setPicks((p) => ({ ...p, [c.key]: e.target.value }))}
                >
                  <option value="" disabled>
                    Choose your {c.label.toLowerCase()} standard…
                  </option>
                  {c.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={goToReveal}
            disabled={!allPicked || saving}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-8"
          >
            {saving ? "Saving…" : "Lock them in →"}
          </button>
          {saveError && <SaveError message={saveError} />}
        </section>
      )}

      {/* STEP 2 — Display + screenshot prompt */}
      {step === 2 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <p className="eyebrow mb-3" style={{ textAlign: "center" }}>
            {athlete.full_name}
          </p>
          <h2
            className="font-display"
            style={{ fontSize: 26, textAlign: "center", color: "var(--cream)", marginBottom: 14 }}
          >
            MY 4 NON-NEGOTIABLES
          </h2>
          <div className="mb-5" style={{ textAlign: "center" }}>
            <Scripture verse={SCRIPTURE["non-negotiables"].verse} reference={SCRIPTURE["non-negotiables"].reference} align="center" />
          </div>

          <div className="card p-5 flex flex-col gap-3" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f6f3ec 100%)" }}>
            {chosen.map((row, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 p-3.5"
                style={{ borderRadius: 13, background: "rgba(176,141,60,0.08)", border: "1px solid rgba(176,141,60,0.22)" }}
              >
                <span
                  className="font-display flex items-center justify-center shrink-0"
                  style={{ width: 30, height: 30, borderRadius: 9, background: "var(--gold)", color: "#fff", fontSize: 15 }}
                >
                  {i + 1}
                </span>
                <div>
                  <p
                    className="font-head"
                    style={{ fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}
                  >
                    {row.category}
                  </p>
                  <p style={{ fontSize: 14.5, color: "var(--cream)", marginTop: 3, lineHeight: 1.35, fontWeight: 500 }}>
                    {row.statement}
                  </p>
                </div>
              </div>
            ))}
            <div className="mt-2 flex justify-center">
              <Wordmark size={56} />
            </div>
          </div>

          <p style={{ fontSize: 13.5, color: "var(--cream)", marginTop: 20, textAlign: "center", lineHeight: 1.5 }}>
            Screenshot this and save it to your Photos.
          </p>
          <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, textAlign: "center" }}>
            {saving ? "Saving…" : "Saved to your profile."}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <button className="btn-ghost w-full rounded-xl py-3.5 text-sm" onClick={() => router.push("/journey")}>
              Back to Protocols
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

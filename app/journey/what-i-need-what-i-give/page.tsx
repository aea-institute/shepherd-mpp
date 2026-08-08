"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepHeader from "@/components/StepHeader";
import Scripture from "@/components/Scripture";
import { SCRIPTURE } from "@/lib/protocols";
import { Loading, Section, Label, Textarea } from "@/components/StepUI";
import { useAthleteGuard } from "@/lib/useAthleteGuard";
import { saveResponse, SAVE_ERROR } from "@/lib/storage";
import SaveError from "@/components/SaveError";

const TOTAL = 5;

const NEED_SUGGESTIONS = ["Encouragement", "Accountability", "Trust", "Honesty", "Energy", "Patience"];
const GIVE_SUGGESTIONS = ["Energy", "Honesty", "Consistency", "Effort", "Support", "Leadership"];

export default function WhatINeedWhatIGivePage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [needs, setNeeds] = useState<string[]>(["", "", ""]);
  const [gives, setGives] = useState<string[]>(["", "", ""]);
  const [commitment, setCommitment] = useState("");
  const [feeling, setFeeling] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!ready || !athlete) return <Loading />;

  const trimmedNeeds = needs.map((n) => n.trim());
  const trimmedGives = gives.map((g) => g.trim());
  const needsValid = trimmedNeeds.every(Boolean);
  const givesValid = trimmedGives.every(Boolean);

  function setNeed(i: number, value: string) {
    setNeeds((prev) => prev.map((n, idx) => (idx === i ? value : n)));
  }
  function setGive(i: number, value: string) {
    setGives((prev) => prev.map((g, idx) => (idx === i ? value : g)));
  }
  function fillNeed(text: string) {
    const target = needs.findIndex((n) => !n.trim());
    if (target !== -1) setNeed(target, text);
  }
  function fillGive(text: string) {
    const target = gives.findIndex((g) => !g.trim());
    if (target !== -1) setGive(target, text);
  }

  async function goToReveal() {
    if (saved) {
      setStep(5);
      return;
    }
    setSaving(true);
    setSaveError("");
    const ok = await saveResponse(4, "what-i-need-what-i-give", {
      needs: trimmedNeeds as [string, string, string],
      gives: trimmedGives as [string, string, string],
      commitment: commitment.trim(),
      feeling: feeling.trim(),
    });
    setSaving(false);
    if (!ok) {
      setSaveError(SAVE_ERROR);
      return;
    }
    setSaved(true);
    setStep(5);
  }

  const notesText = `WHAT I NEED, WHAT I GIVE\n\nI NEED:\n1. ${trimmedNeeds[0]}\n2. ${trimmedNeeds[1]}\n3. ${trimmedNeeds[2]}\n\nI GIVE:\n1. ${trimmedGives[0]}\n2. ${trimmedGives[1]}\n3. ${trimmedGives[2]}\n\nMY COMMITMENT:\n${commitment.trim()}\n\n— Shepherd Coach Network`;

  async function copyToNotes() {
    try {
      await navigator.clipboard.writeText(notesText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="screen flex flex-col min-h-screen pb-10">
      <StepHeader
        eyebrow="Protocol 4 · Need & Give"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
      />

      {/* STEP 1 — What you need */}
      {step === 1 && (
        <Section
          title="What you need."
          hint="Three things you need from your team to perform at your best. Tap a suggestion or write your own."
        >
          <div className="flex flex-col gap-2.5">
            {needs.map((n, i) => (
              <input
                key={i}
                className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
                placeholder={`Need ${i + 1}`}
                value={n}
                onChange={(e) => setNeed(i, e.target.value)}
              />
            ))}
          </div>

          <div className="mt-5">
            <Label>Suggestions</Label>
            <div className="flex flex-wrap gap-2">
              {NEED_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => fillNeed(s)} className="chip px-3.5 py-2" style={{ fontSize: 13 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!needsValid}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 2 — What you give */}
      {step === 2 && (
        <Section
          title="What you give."
          hint="Three things you'll give your team no matter what. Tap a suggestion or write your own."
        >
          <div className="flex flex-col gap-2.5">
            {gives.map((g, i) => (
              <input
                key={i}
                className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
                placeholder={`Give ${i + 1}`}
                value={g}
                onChange={(e) => setGive(i, e.target.value)}
              />
            ))}
          </div>

          <div className="mt-5">
            <Label>Suggestions</Label>
            <div className="flex flex-wrap gap-2">
              {GIVE_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => fillGive(s)} className="chip px-3.5 py-2" style={{ fontSize: 13 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={!givesValid}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 3 — Your commitment */}
      {step === 3 && (
        <Section
          title="Your commitment."
          hint="One or two sentences declaring you'll be both a strong receiver and a generous giver."
        >
          <Label>Your commitment</Label>
          <Textarea
            value={commitment}
            onChange={setCommitment}
            placeholder="I commit to asking for what I need and giving without being asked…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            One or two sentences — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(4)}
            disabled={!commitment.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 4 — How it feels */}
      {step === 4 && (
        <Section title="How it feels." hint="Describe what it feels like to live this exchange with your teammates.">
          <Label>How it feels</Label>
          <Textarea
            value={feeling}
            onChange={setFeeling}
            placeholder="When I give and receive like this, my team feels…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={goToReveal}
            disabled={!feeling.trim() || saving}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            {saving ? "Saving…" : "Reveal my exchange →"}
          </button>
          {saveError && <SaveError message={saveError} />}
        </Section>
      )}

      {/* STEP 5 — Bold dramatic display + screenshot prompt */}
      {step === 5 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <p className="eyebrow mb-3" style={{ textAlign: "center" }}>
            {athlete.full_name}
          </p>
          <h2
            className="font-display"
            style={{ fontSize: 26, textAlign: "center", color: "var(--cream)", marginBottom: 14 }}
          >
            WHAT I NEED, WHAT I GIVE
          </h2>
          <div className="mb-5" style={{ textAlign: "center" }}>
            <Scripture
              verse={SCRIPTURE["what-i-need-what-i-give"].verse}
              reference={SCRIPTURE["what-i-need-what-i-give"].reference}
              align="center"
            />
          </div>

          <div
            className="card"
            style={{ padding: "0", background: "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f3ec 75%)" }}
          >
            <div className="flex" style={{ borderBottom: "1px solid var(--border)" }}>
              <Column heading="I Need" items={trimmedNeeds} divider />
              <Column heading="I Give" items={trimmedGives} />
            </div>
            <div style={{ padding: "22px 22px" }}>
              <p
                className="font-head"
                style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700, marginBottom: 8 }}
              >
                My Commitment
              </p>
              <p style={{ fontSize: 14.5, color: "var(--cream)", lineHeight: 1.5, fontWeight: 500 }}>
                {commitment.trim()}
              </p>
            </div>
          </div>

          <p style={{ fontSize: 13.5, color: "var(--cream)", marginTop: 22, textAlign: "center", lineHeight: 1.5 }}>
            Copy this, or screenshot it to keep on your phone.
          </p>
          <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, textAlign: "center" }}>
            {saving ? "Saving…" : "Saved to your profile."}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <button className="btn-gold w-full rounded-xl py-4 text-sm" onClick={copyToNotes}>
              {copied ? "✓ Copied — paste into Notes" : "⧉ Copy for Notes"}
            </button>
            <button className="btn-ghost w-full rounded-xl py-3.5 text-sm" onClick={() => router.push("/journey")}>
              Back to Protocols
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

/* ---------- local UI ---------- */

function Column({ heading, items, divider }: { heading: string; items: string[]; divider?: boolean }) {
  return (
    <div
      className="flex-1"
      style={{ padding: "22px 22px", borderRight: divider ? "1px solid var(--border)" : "none" }}
    >
      <p
        className="font-head"
        style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700, marginBottom: 12 }}
      >
        {heading}
      </p>
      <div className="flex flex-col gap-3">
        {items.map((text, i) => (
          <p
            key={i}
            className="font-display"
            style={{ fontSize: 17, color: "var(--cream)", lineHeight: 1.2, fontWeight: 700, textTransform: "uppercase" }}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}

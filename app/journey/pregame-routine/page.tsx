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
import { downloadPregameRoutinePdf } from "@/lib/pdf";

const TOTAL = 6;

export default function PregameRoutinePage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState("");
  const [approach, setApproach] = useState("");
  const [mentalPrep, setMentalPrep] = useState("");
  const [physicalPrep, setPhysicalPrep] = useState("");
  const [emotionalCues, setEmotionalCues] = useState("");
  const [reflection, setReflection] = useState("");
  const [visualization, setVisualization] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!ready || !athlete) return <Loading />;

  const timelineValid = Boolean(mentalPrep.trim() && physicalPrep.trim() && emotionalCues.trim());

  async function goToReveal() {
    if (saved) {
      setStep(6);
      return;
    }
    setSaving(true);
    setSaveError("");
    const ok = await saveResponse(7, "pregame-routine", {
      objective: objective.trim(),
      approach: approach.trim(),
      mental_prep: mentalPrep.trim(),
      physical_prep: physicalPrep.trim(),
      emotional_cues: emotionalCues.trim(),
      reflection: reflection.trim(),
      visualization: visualization.trim(),
    });
    setSaving(false);
    if (!ok) {
      setSaveError(SAVE_ERROR);
      return;
    }
    setSaved(true);
    setStep(6);
  }

  const notesText = `MY PRE-GAME ROUTINE\n\nOBJECTIVE:\n${objective.trim()}\n\nMENTAL PREP:\n${mentalPrep.trim()}\n\nPHYSICAL PREP:\n${physicalPrep.trim()}\n\nEMOTIONAL CUES:\n${emotionalCues.trim()}\n\n— Shepherd Coach Network`;

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
        eyebrow="Protocol 7 · Pre-Game Routine"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
      />

      {/* STEP 1 — Your objective */}
      {step === 1 && (
        <Section title="Your objective." hint="One clear, controllable objective for your next practice or game.">
          <Label>Your objective</Label>
          <input
            className="input-ink w-full rounded-xl px-4 py-3.5 text-[16px]"
            placeholder="I will focus on quick footwork today."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            autoFocus
          />
          <button
            onClick={() => setStep(2)}
            disabled={!objective.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 2 — Your approach */}
      {step === 2 && (
        <Section title="Your approach." hint="How will you work on it? Be specific — which drills, which moments.">
          <Label>Your approach</Label>
          <Textarea
            value={approach}
            onChange={setApproach}
            placeholder="I'll work on it during…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(3)}
            disabled={!approach.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 3 — Your timeline */}
      {step === 3 && (
        <Section title="Your timeline." hint="Your routine from wake-up to game time.">
          <div className="flex flex-col gap-5">
            <div>
              <Label>Mental prep</Label>
              <Textarea
                value={mentalPrep}
                onChange={setMentalPrep}
                placeholder="Visualization, self-talk…"
                minHeight={100}
              />
            </div>
            <div>
              <Label>Physical prep</Label>
              <Textarea
                value={physicalPrep}
                onChange={setPhysicalPrep}
                placeholder="Nutrition, warm-up, stretches…"
                minHeight={100}
              />
            </div>
            <div>
              <Label>Emotional cues</Label>
              <Textarea
                value={emotionalCues}
                onChange={setEmotionalCues}
                placeholder="Music, rituals, huddles…"
                minHeight={100}
              />
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two each — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(4)}
            disabled={!timelineValid}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 4 — Why it works */}
      {step === 4 && (
        <Section title="Why it works." hint="How does this routine keep you focused and ready?">
          <Label>Why it works</Label>
          <Textarea
            value={reflection}
            onChange={setReflection}
            placeholder="This routine keeps me focused because…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(5)}
            disabled={!reflection.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 5 — Walk it through */}
      {step === 5 && (
        <Section title="Walk it through." hint="Close your eyes and mentally walk your routine. What did it feel like?">
          <Label>Your walk-through</Label>
          <Textarea
            value={visualization}
            onChange={setVisualization}
            placeholder="Walking through it, I felt…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={goToReveal}
            disabled={!visualization.trim() || saving}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            {saving ? "Saving…" : "Reveal my routine →"}
          </button>
          {saveError && <SaveError message={saveError} />}
        </Section>
      )}

      {/* STEP 6 — Bold dramatic display */}
      {step === 6 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <p className="eyebrow mb-4" style={{ textAlign: "center" }}>
            Your Pre-Game Routine
          </p>
          <div className="mb-5" style={{ textAlign: "center" }}>
            <Scripture
              verse={SCRIPTURE["pregame-routine"].verse}
              reference={SCRIPTURE["pregame-routine"].reference}
              align="center"
            />
          </div>

          <div
            className="card flex flex-col"
            style={{ padding: "8px 0", background: "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f3ec 75%)" }}
          >
            <TimelineBlock label="Objective" text={objective.trim()} highlight />
            <TimelineBlock label="Mental Prep" text={mentalPrep.trim()} />
            <TimelineBlock label="Physical Prep" text={physicalPrep.trim()} />
            <TimelineBlock label="Emotional Cues" text={emotionalCues.trim()} last />
          </div>

          <p style={{ fontSize: 13.5, color: "var(--cream)", marginTop: 22, textAlign: "center", lineHeight: 1.5 }}>
            Download your routine, or copy it to your Notes app.
          </p>
          <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, textAlign: "center" }}>
            {saving ? "Saving…" : "Saved to your profile."}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <button
              className="btn-gold w-full rounded-xl py-4 text-sm"
              onClick={() =>
                downloadPregameRoutinePdf({
                  athleteName: athlete.full_name,
                  objective: objective.trim(),
                  mentalPrep: mentalPrep.trim(),
                  physicalPrep: physicalPrep.trim(),
                  emotionalCues: emotionalCues.trim(),
                })
              }
            >
              ↓ Download PDF
            </button>
            <button className="btn-ghost w-full rounded-xl py-3.5 text-sm" onClick={copyToNotes}>
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

function TimelineBlock({ label, text, highlight, last }: { label: string; text: string; highlight?: boolean; last?: boolean }) {
  return (
    <div style={{ padding: "20px 22px", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <p
        className="font-head"
        style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700, marginBottom: 8 }}
      >
        {label}
      </p>
      <p
        className={highlight ? "font-display" : undefined}
        style={
          highlight
            ? { fontSize: 19, color: "var(--cream)", lineHeight: 1.25, fontWeight: 700, textTransform: "uppercase" }
            : { fontSize: 14, color: "var(--cream)", lineHeight: 1.45, fontWeight: 500 }
        }
      >
        {text}
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepHeader from "@/components/StepHeader";
import Scripture from "@/components/Scripture";
import { SCRIPTURE } from "@/lib/protocols";
import { Loading, Section, Label } from "@/components/StepUI";
import { useAthleteGuard } from "@/lib/useAthleteGuard";
import { saveResponse, SAVE_ERROR } from "@/lib/storage";
import SaveError from "@/components/SaveError";

const TOTAL = 4;

const PHYSICAL_OPTIONS = [
  "Clap twice",
  "Roll shoulders",
  "Tap chest",
  "Bounce on your toes",
  "Shake out your hands",
  "Gear adjustment",
];

const BREATH_OPTIONS = ["One deep breath", "Two deep breaths", "Three slow breaths"];

const MANTRA_EXAMPLES = ["Next play.", "Reset.", "Move on.", "Lock in."];

export default function ResetPage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [physical, setPhysical] = useState("");
  const [physicalCustom, setPhysicalCustom] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [breath, setBreath] = useState("");
  const [mantra, setMantra] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!ready || !athlete) return <Loading />;

  const physicalFinal = useCustom ? physicalCustom.trim() : physical;
  const mantraWords = mantra.trim().split(/\s+/).filter(Boolean);
  const mantraValid = mantraWords.length >= 1 && mantraWords.length <= 3;

  async function goToReveal() {
    if (saved) {
      setStep(4);
      return;
    }
    setSaving(true);
    setSaveError("");
    const ok = await saveResponse(2, "reset", {
      physical_action: physicalFinal,
      breath_work: breath,
      mantra: mantra.trim(),
    });
    setSaving(false);
    if (!ok) {
      setSaveError(SAVE_ERROR);
      return;
    }
    setSaved(true);
    setStep(4);
  }

  const notesText = `MY RESET PROTOCOL\n\n1. ${physicalFinal}\n2. ${breath}\n3. "${mantra.trim()}"\n\n— Shepherd Coach Network`;

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
        eyebrow="Protocol 2 · Reset"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
      />

      {/* STEP 1 — Physical action */}
      {step === 1 && (
        <Section
          title="Pick your physical action."
          hint="One small move that snaps you back into the moment after a mistake. Pick one — or write your own."
        >
          <div className="flex flex-col gap-2.5">
            {PHYSICAL_OPTIONS.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={!useCustom && physical === opt}
                onClick={() => {
                  setPhysical(opt);
                  setUseCustom(false);
                }}
              />
            ))}
            <Chip
              label="✎ Write your own"
              selected={useCustom}
              onClick={() => setUseCustom(true)}
            />
            {useCustom && (
              <input
                className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px] mt-1"
                placeholder="Your physical action"
                value={physicalCustom}
                onChange={(e) => setPhysicalCustom(e.target.value)}
                autoFocus
              />
            )}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!physicalFinal}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 2 — Breath work */}
      {step === 2 && (
        <Section title="Add your breath." hint="Breathing resets your body. How many breaths?">
          <div className="flex flex-col gap-2.5">
            {BREATH_OPTIONS.map((opt) => (
              <Chip key={opt} label={opt} selected={breath === opt} onClick={() => setBreath(opt)} />
            ))}
          </div>
          <button
            onClick={() => setStep(3)}
            disabled={!breath}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 3 — Mantra */}
      {step === 3 && (
        <Section title="Choose your mantra." hint="1 to 3 words you say to lock back in. Short. Sharp. Yours.">
          <Label>Your mantra</Label>
          <input
            className="input-ink w-full rounded-xl px-4 py-3.5 text-[16px]"
            placeholder="Next play."
            value={mantra}
            onChange={(e) => setMantra(e.target.value)}
            autoFocus
          />
          <p
            style={{
              fontSize: 12,
              color: mantraWords.length > 3 ? "#c84a4a" : "var(--muted)",
              marginTop: 8,
            }}
          >
            {mantraWords.length > 3 ? "Keep it to 3 words or fewer." : "1–3 words."}
          </p>

          <div className="mt-5">
            <Label>Examples</Label>
            <div className="flex flex-wrap gap-2">
              {MANTRA_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setMantra(ex)}
                  className="chip px-3.5 py-2"
                  style={{ fontSize: 13 }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={goToReveal}
            disabled={!mantraValid || saving}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            {saving ? "Saving…" : "Reveal my reset →"}
          </button>
          {saveError && <SaveError message={saveError} />}
        </Section>
      )}

      {/* STEP 4 — Bold dramatic display */}
      {step === 4 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <p className="eyebrow mb-4" style={{ textAlign: "center" }}>
            Your Reset Protocol
          </p>
          <div className="mb-5" style={{ textAlign: "center" }}>
            <Scripture verse={SCRIPTURE.reset.verse} reference={SCRIPTURE.reset.reference} align="center" />
          </div>

          <div
            className="card glow-anim flex flex-col items-center justify-center text-center"
            style={{
              padding: "44px 22px",
              background: "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f3ec 70%)",
            }}
          >
            <Big n={1} text={physicalFinal} />
            <Divider />
            <Big n={2} text={breath} />
            <Divider />
            <div className="flex flex-col items-center">
              <StepNum n={3} />
              <p
                className="font-display"
                style={{
                  fontSize: 34,
                  lineHeight: 1.05,
                  color: "var(--gold)",
                  marginTop: 8,
                  textTransform: "uppercase",
                }}
              >
                “{mantra.trim()}”
              </p>
            </div>
          </div>

          <p style={{ fontSize: 13.5, color: "var(--cream)", marginTop: 22, textAlign: "center", lineHeight: 1.5 }}>
            Add this to your Notes app so you always have it.
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

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`chip ${selected ? "selected" : ""} w-full px-4 py-3.5`} style={{ fontSize: 15 }}>
      {label}
    </button>
  );
}

function StepNum({ n }: { n: number }) {
  return (
    <span
      className="font-head"
      style={{
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--muted)",
        fontWeight: 700,
      }}
    >
      Step {n}
    </span>
  );
}

function Big({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex flex-col items-center">
      <StepNum n={n} />
      <p
        className="font-display"
        style={{ fontSize: 26, lineHeight: 1.1, color: "var(--cream)", marginTop: 8, textTransform: "uppercase" }}
      >
        {text}
      </p>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 30, height: 2, background: "var(--border)", margin: "20px 0" }} />;
}

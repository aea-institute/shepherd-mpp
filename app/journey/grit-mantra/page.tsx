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

const MANTRA_EXAMPLES = ["I don't quit when it's hard.", "Adversity makes me.", "Earn it.", "Keep swinging."];

export default function GritMantraPage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [challenge, setChallenge] = useState("");
  const [mantra, setMantra] = useState("");
  const [meaning, setMeaning] = useState("");
  const [spoken, setSpoken] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!ready || !athlete) return <Loading />;

  const mantraWords = mantra.trim().split(/\s+/).filter(Boolean);
  const mantraValid = mantraWords.length >= 1 && mantraWords.length <= 7;

  async function goToReveal() {
    if (saved) {
      setStep(5);
      return;
    }
    setSaving(true);
    setSaveError("");
    const ok = await saveResponse(6, "grit-mantra", {
      challenge: challenge.trim(),
      mantra: mantra.trim(),
      meaning: meaning.trim(),
      spoken: spoken.trim(),
    });
    setSaving(false);
    if (!ok) {
      setSaveError(SAVE_ERROR);
      return;
    }
    setSaved(true);
    setStep(5);
  }

  const notesText = `MY GRIT MANTRA\n\n"${mantra.trim()}"\n\n— Shepherd Coach Network`;

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
        eyebrow="Protocol 6 · Grit Mantra"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
      />

      {/* STEP 1 — Reflect on a challenge */}
      {step === 1 && (
        <Section title="Reflect on a challenge." hint="Think of a time you pushed through adversity. Describe it briefly.">
          <Label>Your challenge</Label>
          <Textarea
            value={challenge}
            onChange={setChallenge}
            placeholder="There was a time when…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(2)}
            disabled={!challenge.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 2 — Write your mantra */}
      {step === 2 && (
        <Section title="Write your mantra." hint="Seven words or fewer. Short. Sharp. Yours.">
          <Label>Your mantra</Label>
          <input
            className="input-ink w-full rounded-xl px-4 py-3.5 text-[16px]"
            placeholder="I don't quit when it's hard."
            value={mantra}
            onChange={(e) => setMantra(e.target.value)}
            autoFocus
          />
          <p
            style={{
              fontSize: 12,
              color: mantraWords.length > 7 ? "#c84a4a" : "var(--muted)",
              marginTop: 8,
            }}
          >
            {mantraWords.length > 7 ? "Keep it to 7 words or fewer." : "1–7 words."}
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
            onClick={() => setStep(3)}
            disabled={!mantraValid}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 3 — Add meaning */}
      {step === 3 && (
        <Section title="Add meaning." hint="What does this mantra mean to you, and how does it fuel your perseverance?">
          <Label>Its meaning</Label>
          <Textarea
            value={meaning}
            onChange={setMeaning}
            placeholder="This mantra means…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(4)}
            disabled={!meaning.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 4 — Say it out loud */}
      {step === 4 && (
        <Section title="Say it out loud." hint="Say your mantra out loud five times. How did it feel?">
          <Label>How it felt</Label>
          <Textarea
            value={spoken}
            onChange={setSpoken}
            placeholder="Saying it out loud, I felt…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={goToReveal}
            disabled={!spoken.trim() || saving}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            {saving ? "Saving…" : "Reveal my mantra →"}
          </button>
          {saveError && <SaveError message={saveError} />}
        </Section>
      )}

      {/* STEP 5 — Bold dramatic display */}
      {step === 5 && (
        <section className="pop-in mt-2 flex flex-col flex-1">
          <p className="eyebrow mb-4" style={{ textAlign: "center" }}>
            Your Grit Mantra
          </p>
          <div className="mb-5" style={{ textAlign: "center" }}>
            <Scripture
              verse={SCRIPTURE["grit-mantra"].verse}
              reference={SCRIPTURE["grit-mantra"].reference}
              align="center"
            />
          </div>

          <div
            className="card glow-anim flex flex-col items-center justify-center text-center"
            style={{
              padding: "48px 22px",
              background: "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f3ec 70%)",
            }}
          >
            <p
              className="font-display"
              style={{
                fontSize: 34,
                lineHeight: 1.05,
                color: "var(--gold)",
                textTransform: "uppercase",
              }}
            >
              &ldquo;{mantra.trim()}&rdquo;
            </p>
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

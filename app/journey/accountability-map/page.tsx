"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepHeader from "@/components/StepHeader";
import Wordmark from "@/components/Wordmark";
import Scripture from "@/components/Scripture";
import { SCRIPTURE } from "@/lib/protocols";
import { Loading, Section, Label, Textarea } from "@/components/StepUI";
import { useAthleteGuard } from "@/lib/useAthleteGuard";
import { saveResponse, SAVE_ERROR } from "@/lib/storage";
import SaveError from "@/components/SaveError";
import { downloadAccountabilityMapPdf } from "@/lib/pdf";

const TOTAL = 5;

export default function AccountabilityMapPage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [circle, setCircle] = useState<string[]>(["", "", "", "", ""]);
  // Support text is stored per slot index (parallel to `circle`) so each
  // person's textarea has independent state that can't collide on name.
  const [support, setSupport] = useState<string[]>(["", "", "", "", ""]);
  const [promise, setPromise] = useState("");
  const [checkin, setCheckin] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!ready || !athlete) return <Loading />;

  // Named people, keeping their original slot index so each person's support
  // text stays tied to that specific person. First 3 slots are required.
  const namedPeople = circle
    .map((name, i) => ({ name: name.trim(), i }))
    .filter((x) => x.name);
  const people = namedPeople.map((x) => x.name);
  const circleValid = circle.slice(0, 3).every((p) => p.trim());
  const supportValid = namedPeople.every((x) => support[x.i].trim());

  function setPerson(i: number, value: string) {
    setCircle((prev) => prev.map((p, idx) => (idx === i ? value : p)));
  }

  function setSupportAt(i: number, value: string) {
    setSupport((prev) => prev.map((s, idx) => (idx === i ? value : s)));
  }

  async function goToReveal() {
    if (saved) {
      setStep(5);
      return;
    }
    setSaving(true);
    setSaveError("");
    const trimmedSupport: Record<string, string> = {};
    namedPeople.forEach((x) => {
      trimmedSupport[x.name] = support[x.i].trim();
    });
    const ok = await saveResponse(5, "accountability-map", {
      people,
      support: trimmedSupport,
      promise: promise.trim(),
      checkin: checkin.trim(),
    });
    setSaving(false);
    if (!ok) {
      setSaveError(SAVE_ERROR);
      return;
    }
    setSaved(true);
    setStep(5);
  }

  return (
    <main className="screen flex flex-col min-h-screen pb-10">
      <StepHeader
        eyebrow="Protocol 5 · Accountability Map"
        step={step}
        total={TOTAL}
        backToJourney={step === 1}
        onBack={() => setStep((s) => Math.max(1, s - 1))}
      />

      {/* STEP 1 — Name your circle */}
      {step === 1 && (
        <Section
          title="Name your circle."
          hint="List 3–5 people — coaches, teammates, family, mentors — who keep you accountable."
        >
          <div className="flex flex-col gap-2.5">
            {circle.map((p, i) => (
              <input
                key={i}
                className="input-ink w-full rounded-xl px-4 py-3.5 text-[15px]"
                placeholder={i < 3 ? `Person ${i + 1}` : `Person ${i + 1} (optional)`}
                value={p}
                onChange={(e) => setPerson(i, e.target.value)}
              />
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!circleValid}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 2 — How they hold you */}
      {step === 2 && (
        <Section
          title="How they hold you."
          hint="For each person, 2–3 sentences on how they support your goals and challenge you to grow."
        >
          <div className="flex flex-col gap-5">
            {namedPeople.map(({ name, i }) => (
              <div key={i}>
                <Label>{name}</Label>
                <Textarea
                  value={support[i]}
                  onChange={(v) => setSupportAt(i, v)}
                  placeholder={`How ${name} supports and challenges you…`}
                  minHeight={110}
                />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A few sentences each — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(3)}
            disabled={!supportValid}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 3 — Your promise */}
      {step === 3 && (
        <Section title="Your promise." hint="A short personal promise committing to accountability.">
          <Label>Your promise</Label>
          <Textarea
            value={promise}
            onChange={setPromise}
            placeholder="I promise to show up fully and lean on my circle for strength and growth."
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            One or two sentences — aim for 100–300 characters.
          </p>
          <button
            onClick={() => setStep(4)}
            disabled={!promise.trim()}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            Continue →
          </button>
        </Section>
      )}

      {/* STEP 4 — Your check-in */}
      {step === 4 && (
        <Section title="Your check-in." hint="How will you check in with your accountability partners regularly?">
          <Label>Your check-in</Label>
          <Textarea
            value={checkin}
            onChange={setCheckin}
            placeholder="Every week I'll check in by…"
          />
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            A sentence or two — aim for 100–300 characters.
          </p>
          <button
            onClick={goToReveal}
            disabled={!checkin.trim() || saving}
            className="btn-gold w-full rounded-xl py-4 text-sm mt-7"
          >
            {saving ? "Saving…" : "Reveal my map →"}
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
            MY ACCOUNTABILITY MAP
          </h2>
          <div className="mb-5" style={{ textAlign: "center" }}>
            <Scripture
              verse={SCRIPTURE["accountability-map"].verse}
              reference={SCRIPTURE["accountability-map"].reference}
              align="center"
            />
          </div>

          <div
            className="card flex flex-col"
            style={{ padding: "8px 0", background: "radial-gradient(circle at 50% 0%, #ffffff 0%, #f6f3ec 75%)" }}
          >
            {namedPeople.map(({ name, i }, idx) => (
              <div key={i} style={{ padding: "20px 22px", borderBottom: idx < namedPeople.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-display" style={{ fontSize: 30, color: "var(--gold)", lineHeight: 1 }}>
                    {idx + 1}
                  </span>
                  <span
                    className="font-display"
                    style={{ fontSize: 19, color: "var(--cream)", lineHeight: 1.2, fontWeight: 700, textTransform: "uppercase" }}
                  >
                    {name}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "var(--cream)", lineHeight: 1.45, fontWeight: 500 }}>
                  {support[i].trim()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6" style={{ textAlign: "center" }}>
            <p
              className="font-head"
              style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700, marginBottom: 8 }}
            >
              My Promise
            </p>
            <p
              className="font-display"
              style={{ fontSize: 22, color: "var(--gold)", lineHeight: 1.25, fontWeight: 700 }}
            >
              &ldquo;{promise.trim()}&rdquo;
            </p>
          </div>

          <div className="mt-5 flex justify-center">
            <Wordmark size={56} />
          </div>

          <p style={{ fontSize: 13.5, color: "var(--cream)", marginTop: 20, textAlign: "center", lineHeight: 1.5 }}>
            Download your map, or screenshot it to keep your circle close.
          </p>
          <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4, textAlign: "center" }}>
            {saving ? "Saving…" : "Saved to your profile."}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <button
              className="btn-gold w-full rounded-xl py-4 text-sm"
              onClick={() =>
                downloadAccountabilityMapPdf({
                  athleteName: athlete.full_name,
                  people: namedPeople.map(({ name, i }) => ({ name, support: support[i].trim() })),
                  promise: promise.trim(),
                  checkin: checkin.trim(),
                })
              }
            >
              ↓ Download PDF
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

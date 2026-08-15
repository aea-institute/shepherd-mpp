"use client";

import { useRouter } from "next/navigation";
import { DASHBOARD_URL } from "@/lib/dashboard";

type Props = {
  eyebrow: string;
  step: number;
  total: number;
  onBack?: () => void;
  /** When true (step 1), back returns to the journey page */
  backToJourney?: boolean;
};

export default function StepHeader({ eyebrow, step, total, onBack, backToJourney }: Props) {
  const router = useRouter();
  const pct = Math.round((step / total) * 100);

  function handleBack() {
    if (backToJourney) {
      router.push("/journey");
    } else if (onBack) {
      onBack();
    }
  }

  return (
    <div className="pt-7 pb-5">
      <a
        href={DASHBOARD_URL}
        className="font-head"
        style={{
          display: "inline-block",
          color: "var(--gold)",
          fontSize: 12,
          textDecoration: "none",
          letterSpacing: "0.04em",
          marginBottom: 12,
        }}
      >
        ← Dashboard
      </a>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="font-head"
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, letterSpacing: "0.06em" }}>
        STEP {step} OF {total}
      </p>
    </div>
  );
}

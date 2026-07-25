"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/StepUI";
import { useAthleteGuard } from "@/lib/useAthleteGuard";

// Standalone orientation — NOT a protocol. No save, no saveResponse, no
// Supabase write. Guarded client-side via useAthleteGuard (same pattern as
// every protocol page): no athlete on this device → bounce to the landing.
//
// Body copy is reproduced verbatim from david-factor-athlete.md (repo root).
// "Introduction" is the eyebrow label (retained from the layout); the athlete
// source begins at the next line. The HEADING below is unchanged. Do not
// reword, condense, or re-punctuate. The four "* " lines are the bulleted list.
const HEADING = "The David vs Goliath Shepherd Mental Edge Factor!";

const BODY: string[] = [
  "Introduction",
  "Long before the story of David and Goliath, there is an even more important narrative unfolding in the life of David. The story of David in the wilderness.",
  "Years before David ever stepped into the spotlight, he was faithful in obscurity, training his mind, body, and spirit for the battles he would later face. While tending his father's sheep, far from the crowd and far from recognition, David was doing the unseen work. Fighting lions and bears that no one witnessed (1 Samuel 17:34-36). Developing unseen habits, disciplines, and a mindset that would later separate him from everyone else in that valley. His preparation was quiet, unglamorous, but deeply intentional.",
  "And when the moment came, he was ready.",
  "In the heat of battle, the army of Israel looked at the size of the opposition and panicked under pressure. David looked at the same giant and stepped forward. The difference wasn't size, strength, or skill – it was mindset. Despite the paralyzing pressure of the opponent in front of him, David stayed laser focused on the size of his God. That focus gave him a deep, inner confidence and composure to face his giant and come out victorious on the other side.",
  "He didn't show up with armor or a sword. His weapon was a stone. Small. Simple. But in the hands of someone who had done the unseen work, it was enough to give him the edge.",
  "That is The DAVID Factor.",
  "And here's what that means for you.",
  "Your mental edge isn't built in the spotlight. It's built in the small, daily behaviors that most athletes overlook. Small habits. Small mindset shifts. Small, intentional choices made consistently over time. That's what separates the athlete who crumbles under pressure from the one who rises to meet it.",
  "That's what this manual is for.",
  "As an athlete, you face your own goliaths every single day. Distractions, mistakes, setbacks, nerves before a big game, the voice in your head after a bad play. These are not signs that something is wrong with you. They are part of competing. The athletes who perform consistently aren't the ones who avoid these challenges. They're the ones who learn how to handle them.",
  "Mental performance isn't about being perfect or never feeling nervous. It's about developing the small, practical tools that help you reset faster, stay focused, build confidence, and respond better when things don't go your way. Just like speed, strength, or technique, mental skills like confidence, composure, focus, and resilience can also be trained.",
  "As a Shepherd athlete, we believe your mental game goes far deeper than performance. Scripture is filled with principles of mindset, perseverance, self-talk, courage, joy, and self-control. These are the very qualities that defined David and the very qualities that define mentally strong athletes today. This manual brings those principles into your daily training and competition.",
  "The DAVID Factor gives you 12 core mental skills, one for each week of your season. Each chapter is short, clear, and built for real practices and real competition. When you commit to working through these skills, you will learn how to:",
  "* Compete with confidence, composure, and consistency",
  "* Handle pressure and mistakes more effectively",
  "* Bounce back when things get hard",
  "* Play with greater freedom and enjoyment",
  "The best part? These skills don't just impact your performance. They carry over into school, relationships, and every area of your life. And every skill in this manual points back to the One who made you, equipped you, and called you to compete.",
  "You have giants in front of you. Pressure. Doubt. Fear. Opponents. Moments that feel bigger than you.",
  "David faced his giant and won – not because he was the most physically gifted or talented.  David overcame because he had done the unseen work of learning to trust God and stay focused on Him at all times (Psalm 16:8), giving him an edge when it mattered most.",
  "Now it's your turn.",
  "It's time to unlock your spiritual growth and your mental edge.",
  "It's time to face your giants.",
  "It's time to develop your DAVID Factor.",
];

type Block = { type: "p"; text: string } | { type: "ul"; items: string[] };

export default function WelcomePage() {
  const { athlete, ready } = useAthleteGuard();
  const router = useRouter();

  if (!ready || !athlete) return <Loading />;

  const label = BODY[0]; // "Introduction"

  // Group the remaining lines into paragraphs and one bulleted list, so the
  // source's "* " lines render as a real <ul> exactly where they appear.
  const blocks: Block[] = [];
  for (const line of BODY.slice(1)) {
    if (line.startsWith("* ")) {
      const item = line.slice(2);
      const last = blocks[blocks.length - 1];
      if (last && last.type === "ul") last.items.push(item);
      else blocks.push({ type: "ul", items: [item] });
    } else {
      blocks.push({ type: "p", text: line });
    }
  }

  return (
    <main className="screen flex flex-col min-h-screen pb-12">
      {/* Back to the protocol list — this is a sub-page reached from /journey */}
      <div className="pt-7 pb-2 flex items-center justify-between">
        <button
          onClick={() => router.push("/journey")}
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
        <span className="eyebrow">Start Here</span>
      </div>

      <section className="mt-6">
        <p className="eyebrow mb-3">{label}</p>
        <h1
          className="font-display"
          style={{ fontSize: 29, lineHeight: 1.12, color: "var(--cream)" }}
        >
          {HEADING}
        </h1>
      </section>

      <section className="mt-6 flex flex-col gap-4">
        {blocks.map((b, i) =>
          b.type === "p" ? (
            <p key={i} style={{ fontSize: 15, lineHeight: 1.65, color: "var(--muted)" }}>
              {b.text}
            </p>
          ) : (
            <ul
              key={i}
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 11,
                margin: "2px 0",
              }}
            >
              {b.items.map((item, j) => (
                <li key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--gold)",
                      flexShrink: 0,
                      marginTop: 8,
                    }}
                  />
                  <span style={{ fontSize: 15, lineHeight: 1.5, color: "var(--cream)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )
        )}
      </section>

      <div className="mt-10">
        <Link href="/journey" style={{ textDecoration: "none" }}>
          <button className="btn-gold w-full rounded-xl py-4 text-sm">
            Start the Protocols →
          </button>
        </Link>
      </div>
    </main>
  );
}

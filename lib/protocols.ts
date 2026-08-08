export type Protocol = {
  number: number;
  slug: string;
  route: string;
  title: string;
  subtitle: string;
  output: string;
  accent: "lime" | "orange" | "blue" | "violet" | "cream";
};

export const PROTOCOLS: Protocol[] = [
  {
    number: 1,
    slug: "mission",
    route: "/journey/mission",
    title: "Aspirational Mission Statement",
    subtitle: "Dedicate this season to someone who matters.",
    output: "Downloadable PDF",
    accent: "lime",
  },
  // HIDDEN per Matt 8/6 — do not delete, may restore
  // {
  //   number: 2,
  //   slug: "press-release",
  //   route: "/journey/press-release",
  //   title: "Mythical Press Release",
  //   subtitle: "Write the championship recap before it happens.",
  //   output: "Downloadable PDF",
  //   accent: "blue",
  // },
  {
    number: 2,
    slug: "reset",
    route: "/journey/reset",
    title: "Reset Protocol",
    subtitle: "Your 3-step bounce-back after a mistake.",
    output: "Save to Notes",
    accent: "orange",
  },
  {
    number: 3,
    slug: "non-negotiables",
    route: "/journey/non-negotiables",
    title: "Four Non-Negotiables",
    subtitle: "The standards you never break.",
    output: "Screenshot to Photos",
    accent: "violet",
  },
  // HIDDEN per Matt 8/6 — do not delete, may restore
  // {
  //   number: 5,
  //   slug: "team-standards",
  //   route: "/journey/team-standards",
  //   title: "Team Standards",
  //   subtitle: "What your team always exemplifies.",
  //   output: "Screenshot to keep",
  //   accent: "cream",
  // },
  {
    number: 4,
    slug: "what-i-need-what-i-give",
    route: "/journey/what-i-need-what-i-give",
    title: "What I Need, What I Give",
    subtitle: "The exchange you make with your team.",
    output: "Save to Notes",
    accent: "cream",
  },
  {
    number: 5,
    slug: "accountability-map",
    route: "/journey/accountability-map",
    title: "The Accountability Map",
    subtitle: "The circle that keeps you honest.",
    output: "Downloadable PDF",
    accent: "lime",
  },
  // HIDDEN per Matt 8/6 — do not delete, may restore
  // {
  //   number: 8,
  //   slug: "scouting-report",
  //   route: "/journey/scouting-report",
  //   title: "Opponent Scouting Report",
  //   subtitle: "What you want your rival to say about you.",
  //   output: "Save to Notes",
  //   accent: "blue",
  // },
  {
    number: 6,
    slug: "grit-mantra",
    route: "/journey/grit-mantra",
    title: "Grit Mantra Creation",
    subtitle: "Seven words that fuel the fight.",
    output: "Save to Notes",
    accent: "orange",
  },
  {
    number: 7,
    slug: "pregame-routine",
    route: "/journey/pregame-routine",
    title: "Pre-Practice & Game Routine",
    subtitle: "Win the warmup. Own the game.",
    output: "Downloadable PDF",
    accent: "violet",
  },
  // HIDDEN per Matt 8/6 — do not delete, may restore
  // {
  //   number: 11,
  //   slug: "pressure-protocol",
  //   route: "/journey/pressure-protocol",
  //   title: "Pressure Moment Protocol",
  //   subtitle: "Your calm before the storm.",
  //   output: "Save to Notes",
  //   accent: "orange",
  // },
  // HIDDEN per Matt 8/6 — do not delete, may restore
  // {
  //   number: 12,
  //   slug: "three-play-reset",
  //   route: "/journey/three-play-reset",
  //   title: "The 3-Play Reset Strategy",
  //   subtitle: "Three moves that get you to the next play.",
  //   output: "Save to Notes",
  //   accent: "orange",
  // },
  // HIDDEN per Matt 8/6 — do not delete, may restore
  // {
  //   number: 13,
  //   slug: "postgame-review",
  //   route: "/journey/postgame-review",
  //   title: "Post Game Review System",
  //   subtitle: "Break down the game. Lock in the lesson.",
  //   output: "Downloadable PDF",
  //   accent: "blue",
  // },
];

export function getProtocol(slug: string): Protocol | undefined {
  return PROTOCOLS.find((p) => p.slug === slug);
}

export const ACCENT_HEX: Record<Protocol["accent"], string> = {
  lime: "#b08d3c",
  orange: "#b08d3c",
  blue: "#b08d3c",
  violet: "#b08d3c",
  cream: "#b08d3c",
};

// Completed / success state — used for the "done" badge + check on the journey list.
export const COMPLETE_HEX = "#3a5a40";

// Scripture anchor shown on each protocol's reveal/output screen, keyed by slug.
export const SCRIPTURE: Record<string, { verse: string; reference: string }> = {
  mission: {
    verse: "Commit to the Lord whatever you do, and he will establish your plans.",
    reference: "Proverbs 16:3",
  },
  "press-release": {
    verse: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13",
  },
  reset: {
    verse: "But those who hope in the Lord will renew their strength.",
    reference: "Isaiah 40:31",
  },
  "non-negotiables": {
    verse: "Whatever you do, work at it with all your heart, as working for the Lord.",
    reference: "Colossians 3:23",
  },
  "team-standards": {
    verse: "As iron sharpens iron, so one person sharpens another.",
    reference: "Proverbs 27:17",
  },
  "what-i-need-what-i-give": {
    verse: "Each of you should use whatever gift you have received to serve others.",
    reference: "1 Peter 4:10",
  },
  "accountability-map": {
    verse: "Two are better than one, because they have a good return for their labor.",
    reference: "Ecclesiastes 4:9",
  },
  "scouting-report": {
    verse: "A good name is more desirable than great riches.",
    reference: "Proverbs 22:1",
  },
  "grit-mantra": {
    verse: "Let us run with perseverance the race marked out for us.",
    reference: "Hebrews 12:1",
  },
  "pregame-routine": {
    verse: "The plans of the diligent lead to profit.",
    reference: "Proverbs 21:5",
  },
  "pressure-protocol": {
    verse: "Do not be anxious about anything, but in every situation, present your requests to God.",
    reference: "Philippians 4:6",
  },
  "three-play-reset": {
    verse: "Though he may stumble, he will not fall, for the Lord upholds him with his hand.",
    reference: "Psalm 37:24",
  },
  "postgame-review": {
    verse: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.",
    reference: "Romans 12:2",
  },
};

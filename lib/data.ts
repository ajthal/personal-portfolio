import type { IconName } from "@/components/icons/Icon";

export type Stat = { label: string; val: number; icon: IconName };
export type Req = { label: string; val: string };
export type Link = { label: string; href: string; icon: IconName };

export type ProjectItem = {
  id: string;
  name: string;
  subtitle?: string;
  icon: IconName;
  hero?: string;
  flavor?: string;
  body?: string[];
  stats?: Stat[];
  req?: Req[];
  links?: Link[];
  thumbs?: string[];
  showcase?: string | false;
  images?: string[];
  locked?: boolean;
};

export type GalleryImage = {
  src: string;
  width: number;
  height: number;
};

export type GalleryItem = {
  id: string;
  name: string;
  subtitle?: string;
  count: number;
  flavor?: string;
  seed?: number;
  images?: GalleryImage[];
};

export type Category = {
  id: string;
  label: { rpg: string; plain: string };
  subtitle: string;
  icon: IconName;
  flavor: string;
  layout: "inventory" | "gallery";
  items: (ProjectItem | GalleryItem)[];
};

export type CharacterData = {
  name: string;
  title: string;
  covenant: string;
  flavor: string;
  bio: string[];
  stats: Stat[];
  attrs: { label: string; val: string }[];
  contacts: { label: string; val: string; href: string; icon: IconName }[];
};

export const CATEGORIES: Category[] = [
  {
    id: "tech",
    label: { rpg: "NEW GAME", plain: "TECH PROJECTS" },
    subtitle: "Scripts, systems, and strange little engines.",
    icon: "Sword",
    flavor: "Tools forged in code. Each one answers a problem met on the road.",
    layout: "inventory",
    items: [
      {
        id: "noomibodi",
        name: "NoomiBodi",
        subtitle: "AI nutrition companion",
        icon: "Gem",
        hero: "NoomiBodi — hero screenshot",
        flavor: "\"A quiet counsel at the hearth — it listens to what you have eaten, and tells you what you have become.\"",
        body: [
          "A production AI-assisted nutrition app for iOS and Android, built end-to-end as a solo project across roughly two months and four shipped TestFlight releases — about 74K lines of source, 91 TypeScript files, and a small fleet of Swift, Objective-C, and Deno glue. The core loop: the user snaps a photo or describes a meal in plain language, Claude Sonnet 4.6 returns structured macros through the Anthropic Messages API, the app logs the meal to Supabase, refreshes the iOS home-screen widget through a custom Objective-C bridge, and — when a streak milestone trips — fans out push notifications via Firebase Cloud Messaging.",
          "The agent loop is the project's beating heart. Prompt caching cuts per-request cost roughly ninety percent on cache hits, but only if the prefix is byte-identical — so the system prompt is split into a static, cache-tagged block (role, tool schemas, marker grammar) and a dynamic per-request block (today's totals, profile, persistent memory) that is deliberately left untagged. A regex-based intent classifier buckets each message into meal-log, data-query, suggestion, or general, and ships zero to twelve tool definitions accordingly — omitting the tools key entirely when empty, since the API rejects empty arrays. The tool-calling loop is bounded to four rounds and trips a circuit breaker if cumulative input tokens cross twenty thousand, surrendering gracefully rather than letting runaway recursion eat the rate limit. Rate-limit handling is class-aware: 429s honor the retry-after header with a single retry; 5xx and overload errors get exponential backoff.",
          "Long-running chats use a three-tier memory architecture. Verbatim messages and a rolling summary live in AsyncStorage with hard caps (100 messages, 2,000 chars); a persistent string of distilled user facts — allergies, goals, hard constraints preserved verbatim — lives in Postgres and survives auto-clears. Three triggers (message count, summary length, weekly elapsed) fire a Claude-driven extraction pass that merges the conversation into permanent memory before wiping the transient layers. A previous silent failure where rate-limited summarizations let context grow unbounded was fixed by routing every error through a per-request usage and observability table.",
          "On the native side: a WidgetKit extension with home-screen and lock-screen widgets across four families. Data crosses the React Native / native boundary through an App Group and a custom Objective-C bridge that calls WidgetCenter.reloadAllTimelines via runtime reflection — keeping it buildable on older SDKs. Push notifications come from a Supabase Deno Edge Function that mints OAuth2 tokens for Firebase Cloud Messaging HTTP v1 on demand: RSA-signing JWTs against a service account with Web Crypto's SubtleCrypto, then exchanging the signed assertion at Google's token endpoint before fanning the message out to friends.",
          "The Postgres schema is thirteen tables, forty Row-Level Security policies, four RPCs, and nineteen indexes — every mutation auth-checked at the database level, including a custom claim_device_token RPC that atomically reassigns FCM tokens between users. The client is offline-first: meal and weight writes funnel through a discriminated-union queue with type-narrowing guards, persisted to AsyncStorage and flushed on reconnect. A 40-line stale-while-revalidate hook used across eighteen screens stands in for React Query, with mutation-driven invalidation and a thirty-second freshness window."
        ],
        stats: [
          { label: "LLM Agents", val: 18, icon: "Tome" },
          { label: "React Native", val: 17, icon: "Flame" },
          { label: "TypeScript", val: 17, icon: "Scroll" },
          { label: "iOS Native", val: 16, icon: "Gem" },
          { label: "Postgres + RLS", val: 15, icon: "Key" }
        ],
        req: [
          { label: "Role", val: "Sole Engineer" },
          { label: "Status", val: "Shipped — TestFlight" },
          { label: "Platform", val: "iOS / Android" },
          { label: "Scale", val: "~74K LOC · 13 tables" },
          { label: "Year", val: "2025—2026" }
        ],
        links: [
          { label: "GITHUB", href: "https://github.com/ajthal/noomi-bodi", icon: "Scroll" }
        ],
        images: [],
        thumbs: [
          "NoomiBodi — photo meal capture",
          "NoomiBodi — AI coach chat",
          "NoomiBodi — daily summary",
          "NoomiBodi — iOS home widget"
        ]
      } as ProjectItem,
      { id: "placeholder-1", name: "— Empty —", locked: true, icon: "Ring" } as ProjectItem,
      { id: "placeholder-2", name: "— Empty —", locked: true, icon: "Helm" } as ProjectItem,
      { id: "placeholder-3", name: "— Empty —", locked: true, icon: "Shield" } as ProjectItem,
    ]
  },
  {
    id: "photo",
    label: { rpg: "LOAD GAME", plain: "PHOTOGRAPHY" },
    subtitle: "Places I have walked, framed and remembered.",
    icon: "Camera",
    flavor: "Light captured in distant cities. Each archive a pilgrimage.",
    layout: "gallery",
    items: []
  },
  {
    id: "creative",
    label: { rpg: "INVENTORY", plain: "CREATIVE DESIGN" },
    subtitle: "Paper, ink, and custom cardstock.",
    icon: "Palette",
    flavor: "Trinkets and curios from the maker's bench.",
    layout: "inventory",
    items: [
      {
        id: "edh",
        name: "Yuriko Ninja Tribal — Alter Deck",
        subtitle: "Custom MTG alter deck · EDH",
        icon: "Scroll",
        hero: "Yuriko Ninja Tribal — hero card",
        flavor: "\"From shadow they came, and into shadow they returned — every card sworn to one tongue.\"",
        body: [
          "A fully-custom Magic: The Gathering Commander (EDH) deck built around Yuriko, the Tiger's Shadow — Dimir ninja tribal. Every card runs on a hand-built \"shrine frame\" template I designed and applied across the set, giving the deck a single unified look from commander down to basic lands.",
          "176 unique cards in total, tokens and emblems included. What started as roughly 80 cards scope-crept into a full sideboard for tuning the power level, plus a red splash that lets the deck swap commanders into Goro-Goro and Satoru. Art was sourced and composited digitally, proofed through MPCFill, and printed via MakePlayingCards.",
          "All artwork was sourced from existing pieces found online and assembled into the frame — this is a personal project, not for sale. The full set is free to download and print yourself; Drive link to the side."
        ],
        stats: [
          { label: "Art Direction", val: 17, icon: "Palette" },
          { label: "Illustration", val: 14, icon: "Pen" },
          { label: "Typography", val: 16, icon: "Scroll" },
          { label: "Photoshop", val: 16, icon: "Gem" },
          { label: "Print Prep", val: 15, icon: "Key" }
        ],
        req: [
          { label: "Commander", val: "Yuriko, the Tiger's Shadow" },
          { label: "Colors", val: "Dimir (U/B)" },
          { label: "Cards", val: "176 (incl. tokens)" },
          { label: "Year", val: "2023" }
        ],
        links: [
          { label: "FULL DECK ON DRIVE", href: "https://drive.google.com/drive/folders/15uQ6p5tqwTonfXk2ATQpOTL7KWrrTVBA?usp=drive_link", icon: "Tome" }
        ],
        images: [],
        thumbs: [
          "Yuriko — commander alter",
          "Ninja creatures",
          "Lands & islands",
          "Spells & ninjutsu"
        ]
      } as ProjectItem,
      {
        id: "darksouls",
        name: "Dark Souls — Alter Deck",
        subtitle: "Custom MTG alter deck · EDH",
        icon: "Helm",
        hero: "Dark Souls alters — hero card",
        flavor: "\"Bearer of the curse — seek souls. Larger, more powerful souls.\"",
        body: [
          "A custom Magic: The Gathering Commander (EDH) deck themed around Dark Souls. The core conceit takes the Theros gods of MTG and recasts each one as a Dark Souls boss, with the rest of the deck filled out from across the Souls bestiary. Cards use the standard MTG frame — the work here is in the art selection and pairings, not the template itself.",
          "107 unique cards in total. Art was sourced and composited digitally, proofed through MPCFill, and printed via MakePlayingCards.",
          "All artwork was sourced from existing pieces found online and assembled into the cards — this is a personal project, not for sale. The full set is free to download and print yourself; Drive link to the side."
        ],
        stats: [
          { label: "Art Direction", val: 16, icon: "Palette" },
          { label: "Illustration", val: 15, icon: "Pen" },
          { label: "Typography", val: 15, icon: "Scroll" },
          { label: "Photoshop", val: 15, icon: "Gem" },
          { label: "Print Prep", val: 14, icon: "Key" }
        ],
        req: [
          { label: "Theme", val: "Theros gods as Souls bosses" },
          { label: "Cards", val: "107" },
          { label: "Year", val: "2023" }
        ],
        links: [
          { label: "FULL DECK ON DRIVE", href: "https://drive.google.com/drive/folders/1hcCWog_J6lADNWUAjwpqBpzM4tkyTNsZ", icon: "Tome" }
        ],
        images: [],
        thumbs: [
          "Bosses — alters",
          "Knights & hollows",
          "Bonfires & lands",
          "Sorceries & miracles"
        ]
      } as ProjectItem,
      {
        id: "poker",
        name: "Custom Poker Deck",
        subtitle: "A 52-card design system",
        icon: "Diamond",
        hero: "Poker deck — hero spread",
        flavor: "\"Four suits, thirteen ranks, one hand drawn by mine own.\"",
        body: [
          "A 52-card poker deck I made nearly end-to-end. The card template, the card back, and the tuck box were all designed from scratch in Photoshop, and the imagery on the cards was made entirely by me and my friends — close to 99% original work.",
          "Every card except the two jokers uses real photographs we took during a 2024–2025 trip through Hong Kong, Macau, and Taiwan. The jokers are the one exception — those are photoshops of my own face and a friend's face composited onto existing joker art.",
          "No download for this one. Friends appear in some of the photographs, so the full deck stays private — only the showcase image is up here."
        ],
        stats: [
          { label: "Art Direction", val: 16, icon: "Palette" },
          { label: "Illustration", val: 15, icon: "Pen" },
          { label: "Systems", val: 17, icon: "Scroll" },
          { label: "Photoshop", val: 16, icon: "Gem" },
          { label: "Lightroom", val: 15, icon: "Flame" },
          { label: "Print Prep", val: 14, icon: "Key" }
        ],
        req: [
          { label: "Cards", val: "52 + 2" },
          { label: "Photography", val: "Hong Kong / Macau / Taiwan" },
          { label: "Year", val: "2025" }
        ],
        links: [],
        images: [],
        thumbs: [
          "Poker — court cards",
          "Poker — aces",
          "Poker — card back",
          "Poker — suit detail"
        ]
      } as ProjectItem,
      { id: "placeholder-c1", name: "— Empty —", locked: true, icon: "Ring" } as ProjectItem,
    ]
  }
];

export const CHARACTER: CharacterData = {
  name: "ANDREW THALHEIMER",
  title: "Software Engineer",
  covenant: "The Maker's Path",
  flavor: "\"I build things, then I take them apart to see why they worked.\"",
  bio: [
    "A full-stack engineer with three years of professional experience in regulated financial services, plus a perpetual rotation of side projects spanning AI applications, mobile development, and analog design.",
    "Comfortable across the stack, happiest when a tangled problem resolves into a system that's quiet, explicable, and earned.",
    "Outside of code, I shoot photography and design card decks in Lightroom and Photoshop."
  ],
  stats: [
    { label: "Curiosity", val: 18, icon: "Gem" },
    { label: "Craft", val: 17, icon: "Sword" },
    { label: "Velocity", val: 15, icon: "Flame" },
    { label: "Resilience", val: 16, icon: "Shield" },
    { label: "Taste", val: 16, icon: "Palette" },
    { label: "Communication", val: 15, icon: "Scroll" }
  ],
  attrs: [
    { label: "Frontend", val: "A" },
    { label: "Backend", val: "A" },
    { label: "Systems", val: "B" },
    { label: "AI / LLM", val: "A-" },
    { label: "Design", val: "B" },
    { label: "Infra", val: "C" }
  ],
  contacts: [
    { label: "EMAIL", val: "andrewjthalheimer.dev@proton.me", href: "mailto:andrewjthalheimer.dev@proton.me", icon: "Mail" },
    { label: "GITHUB", val: "github.com/ajthal", href: "https://github.com/ajthal", icon: "Scroll" },
    { label: "LINKEDIN", val: "linkedin.com/in/andrewthalheimer", href: "https://www.linkedin.com/in/andrewthalheimer", icon: "Tome" },
  ]
};

export function isGalleryItem(item: ProjectItem | GalleryItem): item is GalleryItem {
  return "count" in item;
}

export function isProjectItem(item: ProjectItem | GalleryItem): item is ProjectItem {
  return !("count" in item);
}

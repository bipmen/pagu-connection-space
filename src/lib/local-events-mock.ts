// MOCK Local Events store — curated events selected/recommended by Pagu.
// Frontend-only: static data, no persistence, no backend.

export type LocalEventBadge = "pagu-pick" | "partner" | "local-highlight";

export const LOCAL_EVENT_BADGE_LABEL: Record<LocalEventBadge, string> = {
  "pagu-pick": "Pagu Pick",
  partner: "Partner Event",
  "local-highlight": "Local Highlight",
};

export type LocalEvent = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  city: string;
  venue: string;
  organizer: string;
  badge: LocalEventBadge;
  cta: { label: string; href: string };
  featured?: boolean;
  postedDaysAgo?: number;
};

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const LOCAL_EVENTS: LocalEvent[] = [
  // Featured by Pagu
  {
    id: "le_pagu_syncup_oct",
    title: "Sync Up! Cologne — Autumn Edition",
    description:
      "Pagu's signature speed-friendship rounds for FLINTA* people. Short 1:1 conversations, no pressure, real connection.",
    category: "Social",
    date: daysFromNow(9),
    time: "19:00",
    city: "Cologne",
    venue: "Bumann & SOHN, Mülheim",
    organizer: "Pagu Collective",
    badge: "pagu-pick",
    cta: { label: "Reserve your spot", href: "/events#sync-up" },
    featured: true,
    postedDaysAgo: 2,
  },
  {
    id: "le_pagu_brunch_circle",
    title: "Pagu Brunch Circle",
    description:
      "A slow Sunday brunch hosted by Pagu — small table, warm conversation, new faces.",
    category: "Social",
    date: daysFromNow(16),
    time: "11:30",
    city: "Cologne",
    venue: "Café Ludwig, Ehrenstraße",
    organizer: "Pagu Collective",
    badge: "pagu-pick",
    cta: { label: "Join the circle", href: "/events#brunch" },
    featured: true,
    postedDaysAgo: 4,
  },

  // Partner events
  {
    id: "le_partner_queerfilm",
    title: "Queer Short Film Night",
    description:
      "A curated evening of short films from FLINTA* and queer directors, followed by an open Q&A.",
    category: "Culture",
    date: daysFromNow(12),
    time: "20:00",
    city: "Cologne",
    venue: "Filmhaus Köln",
    organizer: "Filmhaus Köln × Pagu",
    badge: "partner",
    cta: { label: "Get tickets", href: "#" },
    postedDaysAgo: 6,
  },
  {
    id: "le_partner_yoga",
    title: "Trauma-Informed Yoga (FLINTA* only)",
    description:
      "Gentle, grounding session with our partner studio. All bodies welcome, no experience needed.",
    category: "Wellness",
    date: daysFromNow(5),
    time: "10:00",
    city: "Cologne",
    venue: "Studio Atem, Südstadt",
    organizer: "Studio Atem",
    badge: "partner",
    cta: { label: "Book a spot", href: "#" },
    postedDaysAgo: 1,
  },
  {
    id: "le_partner_zine",
    title: "Zine-Making Workshop",
    description:
      "Cut, paste, photocopy. A hands-on workshop with a Berlin-based zine collective Pagu loves.",
    category: "Culture",
    date: daysFromNow(21),
    time: "15:00",
    city: "Berlin",
    venue: "Spore Initiative, Neukölln",
    organizer: "Spore × Pagu",
    badge: "partner",
    cta: { label: "Sign up", href: "#" },
    postedDaysAgo: 8,
  },

  // More local highlights
  {
    id: "le_local_market",
    title: "Belgisches Viertel Night Market",
    description:
      "Independent makers, food stalls, and live DJ sets in the heart of the Belgian Quarter.",
    category: "Social",
    date: daysFromNow(3),
    time: "18:00",
    city: "Cologne",
    venue: "Brüsseler Platz",
    organizer: "Veedel Kollektiv",
    badge: "local-highlight",
    cta: { label: "More info", href: "#" },
    postedDaysAgo: 0,
  },
  {
    id: "le_local_poetry",
    title: "Open Mic: Poetry & Spoken Word",
    description:
      "A warm, inclusive open mic — bring a poem, a story, or just your ears.",
    category: "Culture",
    date: daysFromNow(7),
    time: "19:30",
    city: "Cologne",
    venue: "Acephale, Ehrenfeld",
    organizer: "Stadt der Worte e.V.",
    badge: "local-highlight",
    cta: { label: "More info", href: "#" },
    postedDaysAgo: 3,
  },
  {
    id: "le_local_run",
    title: "Sunday Slow Run by the Rhine",
    description:
      "A no-pace, no-pressure 5K with coffee after. Beginners very welcome.",
    category: "Outdoors",
    date: daysFromNow(6),
    time: "09:30",
    city: "Cologne",
    venue: "Rheinpark entrance",
    organizer: "Rhein Slow Runners",
    badge: "local-highlight",
    cta: { label: "More info", href: "#" },
    postedDaysAgo: 5,
  },
  {
    id: "le_local_clay",
    title: "Drop-In Clay Studio",
    description:
      "Two hours at the wheel with all materials included. Walk in, leave with something you made.",
    category: "Culture",
    date: daysFromNow(14),
    time: "17:00",
    city: "Berlin",
    venue: "Tonzeit Studio, Neukölln",
    organizer: "Tonzeit",
    badge: "local-highlight",
    cta: { label: "More info", href: "#" },
    postedDaysAgo: 10,
  },
];

export function getFeaturedLocalEvents() {
  return LOCAL_EVENTS.filter((e) => e.badge === "pagu-pick");
}
export function getPartnerLocalEvents() {
  return LOCAL_EVENTS.filter((e) => e.badge === "partner");
}
export function getMoreLocalEvents() {
  return LOCAL_EVENTS.filter((e) => e.badge === "local-highlight");
}
export function getRecentlyPostedLocalEvents(limit = 4) {
  return [...LOCAL_EVENTS]
    .sort((a, b) => (a.postedDaysAgo ?? 99) - (b.postedDaysAgo ?? 99))
    .slice(0, limit);
}

export function listLocalCities(): string[] {
  return Array.from(new Set(LOCAL_EVENTS.map((e) => e.city))).sort();
}

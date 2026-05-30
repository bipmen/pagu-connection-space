// MOCK Local Events store — curated events selected/recommended by Pagu.
// Frontend-only: static data, no persistence, no backend.

export type LocalEventBadge = "pagu-pick" | "partner" | "local-highlight";

export const LOCAL_EVENT_BADGE_LABEL: Record<LocalEventBadge, string> = {
  "pagu-pick": "Pagu Pick",
  partner: "Partner Event",
  "local-highlight": "Local Highlight",
};

export type LocalEventCtaType = "tickets" | "spot";

export const LOCAL_EVENT_CTA_LABEL: Record<LocalEventCtaType, string> = {
  tickets: "Get Tickets",
  spot: "Book a Spot",
};

export type LocalEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  city: string;
  venue: string;
  organizer: string;
  badge: LocalEventBadge;
  ctaType: LocalEventCtaType;
  attendees: number;
  eventType: string;
  hostedAtSafeSpace?: boolean;
  featured?: boolean;
  postedDaysAgo?: number;
};

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

type SeedEvent = Omit<LocalEvent, "slug" | "ctaType"> & {
  slug?: string;
  ctaType?: LocalEventCtaType;
};

const RAW_EVENTS: SeedEvent[] = [
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
    attendees: 32,
    eventType: "In-person · FLINTA* only",
    hostedAtSafeSpace: true,
    featured: true,
    postedDaysAgo: 2,
  },
  {
    id: "le_pagu_brunch_circle",
    slug: "community-brunch",
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
    attendees: 14,
    eventType: "In-person · Members & friends",
    hostedAtSafeSpace: true,
    featured: true,
    postedDaysAgo: 4,
  },
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
    attendees: 86,
    eventType: "In-person · Open to all FLINTA* & allies",
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
    attendees: 12,
    eventType: "In-person · FLINTA* only",
    hostedAtSafeSpace: true,
    postedDaysAgo: 1,
  },
  {
    id: "le_partner_zine",
    slug: "queer-book-club",
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
    attendees: 18,
    eventType: "In-person · Workshop",
    postedDaysAgo: 8,
  },
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
    attendees: 220,
    eventType: "Outdoors · Open to all",
    postedDaysAgo: 0,
  },
  {
    id: "le_local_poetry",
    slug: "museum-meetup",
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
    attendees: 45,
    eventType: "In-person · Open mic",
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
    attendees: 28,
    eventType: "Outdoors · Beginner friendly",
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
    attendees: 9,
    eventType: "In-person · Drop-in workshop",
    postedDaysAgo: 10,
  },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Deterministic, randomized-looking CTA distribution across events.
// Alternates "tickets" / "spot" based on a stable hash of the id so the
// mix is consistent across renders without being predictable per section.
function pickCta(id: string): LocalEventCtaType {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 2 === 0 ? "tickets" : "spot";
}

export const LOCAL_EVENTS: LocalEvent[] = RAW_EVENTS.map((e) => ({
  ...e,
  slug: e.slug ?? slugify(e.title),
  ctaType: e.ctaType ?? pickCta(e.id),
}));

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

export function getLocalEventBySlug(slug: string): LocalEvent | undefined {
  return LOCAL_EVENTS.find((e) => e.slug === slug);
}

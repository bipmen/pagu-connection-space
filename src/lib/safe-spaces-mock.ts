// MOCK Safe Spaces, applications, reviews, reports. All persisted to
// localStorage. Designed so a future Postgres schema can map 1:1:
// safe_spaces, safe_space_certifications, safe_space_reviews,
// safe_space_reports, safe_space_applications.

import { useEffect, useState } from "react";

export type SafeSpaceCategory =
  | "Cultural Center"
  | "Bar"
  | "Music Venue"
  | "Café"
  | "Community Space"
  | "Art Gallery"
  | "Collective Space"
  | "Community Center";

export type SafeSpace = {
  id: string;
  name: string;
  category: SafeSpaceCategory;
  city: string;
  address: string;
  description: string;
  hours: string;
  rating: number; // 0..5
  reviewsCount: number;
  certifiedSince: number; // year
  // Mock position on the discover map, 0..100 percent.
  mapX: number;
  mapY: number;
};

export type SpaceReview = {
  id: string;
  spaceId: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: number;
};

export type ReportReason =
  | "staff"
  | "discrimination"
  | "accessibility"
  | "safety"
  | "other";

export const REPORT_REASON_LABEL: Record<ReportReason, string> = {
  staff: "Staff Issue",
  discrimination: "Discrimination",
  accessibility: "Accessibility Issue",
  safety: "Safety Concern",
  other: "Other",
};

export type SpaceReport = {
  id: string;
  spaceId: string;
  reason: ReportReason;
  note: string;
  createdAt: number;
};

export type SpaceApplication = {
  id: string;
  businessName: string;
  category: string;
  contactPerson: string;
  email: string;
  website: string;
  motivation: string;
  status: "applied" | "training_scheduled" | "training_completed" | "certified";
  createdAt: number;
};

type Store = {
  reviews: SpaceReview[];
  reports: SpaceReport[];
  applications: SpaceApplication[];
};

const KEY = "pagu.safe_spaces.v1";
const listeners = new Set<() => void>();

export const SAFE_SPACES: SafeSpace[] = [
  {
    id: "ss_feuerwache",
    name: "Alte Feuerwache",
    category: "Cultural Center",
    city: "Cologne",
    address: "Melchiorstraße 3, Köln",
    description:
      "A historic firehouse turned cultural center. Hosts FLINTA*-friendly readings, workshops and dance nights.",
    hours: "Mon–Sun, 10:00 – 23:00",
    rating: 4.8,
    reviewsCount: 124,
    certifiedSince: 2026,
    mapX: 38,
    mapY: 32,
  },
  {
    id: "ss_asimmetric",
    name: "Asimmetric Bar",
    category: "Bar",
    city: "Cologne",
    address: "Ehrenstraße 22, Köln",
    description: "A queer-owned cocktail bar with trained staff and a calm back room.",
    hours: "Tue–Sat, 18:00 – 02:00",
    rating: 4.7,
    reviewsCount: 89,
    certifiedSince: 2026,
    mapX: 55,
    mapY: 48,
  },
  {
    id: "ss_nachtigall",
    name: "Nachtigall",
    category: "Music Venue",
    city: "Cologne",
    address: "Luxemburger Str. 14, Köln",
    description: "Intimate music venue centering FLINTA* and BIPOC artists.",
    hours: "Wed–Sun, 19:00 – 03:00",
    rating: 4.9,
    reviewsCount: 212,
    certifiedSince: 2026,
    mapX: 30,
    mapY: 64,
  },
  {
    id: "ss_oya",
    name: "Oya Köln",
    category: "Café",
    city: "Cologne",
    address: "Venloer Str. 47, Köln",
    description: "Slow café with vegan brunch, books and a community pin board.",
    hours: "Daily, 08:30 – 19:00",
    rating: 4.8,
    reviewsCount: 156,
    certifiedSince: 2026,
    mapX: 46,
    mapY: 28,
  },
  {
    id: "ss_kulturraum",
    name: "Kultur Raum",
    category: "Community Space",
    city: "Cologne",
    address: "Brüsseler Platz 8, Köln",
    description: "Multi-use room for workshops, support circles and small events.",
    hours: "By booking",
    rating: 4.6,
    reviewsCount: 41,
    certifiedSince: 2026,
    mapX: 64,
    mapY: 36,
  },
  {
    id: "ss_bunker101",
    name: "Bunker101",
    category: "Art Gallery",
    city: "Cologne",
    address: "Aachener Str. 101, Köln",
    description: "Underground art gallery showcasing FLINTA* artists and zines.",
    hours: "Thu–Sun, 14:00 – 21:00",
    rating: 4.7,
    reviewsCount: 73,
    certifiedSince: 2026,
    mapX: 22,
    mapY: 45,
  },
  {
    id: "ss_motoki",
    name: "Motoki Collective",
    category: "Collective Space",
    city: "Cologne",
    address: "Severinstraße 60, Köln",
    description: "A worker-owned collective space hosting healing, art and food.",
    hours: "Mon–Fri, 11:00 – 20:00",
    rating: 4.9,
    reviewsCount: 58,
    certifiedSince: 2026,
    mapX: 70,
    mapY: 62,
  },
  {
    id: "ss_buze",
    name: "BüZe",
    category: "Community Center",
    city: "Cologne",
    address: "Berliner Str. 77, Köln",
    description: "Neighbourhood community center with childcare, library and event hall.",
    hours: "Mon–Sat, 09:00 – 22:00",
    rating: 4.7,
    reviewsCount: 198,
    certifiedSince: 2026,
    mapX: 52,
    mapY: 72,
  },
];

const SEED_REVIEWS: SpaceReview[] = SAFE_SPACES.flatMap((s) => [
  {
    id: `r_${s.id}_1`,
    spaceId: s.id,
    authorName: "Mira",
    rating: 5,
    text: "I felt welcome and safe.",
    createdAt: Date.now() - 86400_000 * 9,
  },
  {
    id: `r_${s.id}_2`,
    spaceId: s.id,
    authorName: "Lina",
    rating: 5,
    text: "Great atmosphere and respectful staff.",
    createdAt: Date.now() - 86400_000 * 4,
  },
  {
    id: `r_${s.id}_3`,
    spaceId: s.id,
    authorName: "Yuki",
    rating: 4,
    text: "Wonderful community space.",
    createdAt: Date.now() - 86400_000 * 1,
  },
]);

function read(): Store {
  if (typeof window === "undefined")
    return { reviews: SEED_REVIEWS, reports: [], applications: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const init: Store = { reviews: SEED_REVIEWS, reports: [], applications: [] };
      window.localStorage.setItem(KEY, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw) as Store;
  } catch {
    return { reviews: SEED_REVIEWS, reports: [], applications: [] };
  }
}

function write(s: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function listSafeSpaces(): SafeSpace[] {
  return SAFE_SPACES;
}

export function getSafeSpace(id: string): SafeSpace | null {
  return SAFE_SPACES.find((s) => s.id === id) ?? null;
}

export function listReviewsFor(spaceId: string): SpaceReview[] {
  return read().reviews.filter((r) => r.spaceId === spaceId);
}

export function submitReport(input: Omit<SpaceReport, "id" | "createdAt">) {
  const s = read();
  const r: SpaceReport = {
    ...input,
    id: `rep_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: Date.now(),
  };
  write({ ...s, reports: [...s.reports, r] });
  return r;
}

export function submitApplication(
  input: Omit<SpaceApplication, "id" | "createdAt" | "status">,
): SpaceApplication {
  const s = read();
  const a: SpaceApplication = {
    ...input,
    id: `app_${Math.random().toString(36).slice(2, 10)}`,
    status: "applied",
    createdAt: Date.now(),
  };
  write({ ...s, applications: [...s.applications, a] });
  return a;
}

export function useSafeSpacesStore() {
  const [, setT] = useState(0);
  useEffect(() => {
    const l = () => setT((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
}

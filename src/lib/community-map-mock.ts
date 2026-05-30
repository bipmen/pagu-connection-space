// Unified mock layer for the Community Map. Wraps existing safe-spaces,
// discover events and discover people so a future Postgres schema can map 1:1:
// cities, safe_spaces, events, availability_sessions, connection_requests, chats, reviews, reports, certifications.

import { SAFE_SPACES, type SafeSpace } from "@/lib/safe-spaces-mock";
import { DISCOVER_EVENTS, DISCOVER_PEOPLE, type DiscoverEvent, type DiscoverPerson } from "@/lib/discover-mock";

export type CommunityFilter = "community" | "activities" | "places" | "people";

export const FILTER_LABEL: Record<CommunityFilter, string> = {
  community: "Community",
  activities: "Activities",
  places: "Places",
  people: "People",
};

export type City = {
  id: string;
  name: string;
  country: string;
};

export const CITIES: City[] = [
  { id: "cologne", name: "Cologne", country: "Germany" },
  { id: "berlin", name: "Berlin", country: "Germany" },
  { id: "hamburg", name: "Hamburg", country: "Germany" },
  { id: "munich", name: "Munich", country: "Germany" },
];

export const DEFAULT_CITY = CITIES[0];

export type CitySummary = {
  events: number;
  spaces: number;
  people: number;
  total: number;
};

function cityMatch(target: string, city: string) {
  return target.toLowerCase() === city.toLowerCase();
}

export function summarizeCity(cityName: string): CitySummary {
  // Currently all seed data lives in Cologne. Other cities show as empty
  // so the Empty City state can render.
  const events = cityMatch(cityName, "Cologne") ? DISCOVER_EVENTS.length : 0;
  const spaces = SAFE_SPACES.filter((s) => cityMatch(s.city, cityName)).length;
  const people = cityMatch(cityName, "Cologne") ? DISCOVER_PEOPLE.length : 0;
  return { events, spaces, people, total: events + spaces + people };
}

// Certification flow shared with safe-space profile
export const CERTIFICATION_STAGES = [
  "Applied",
  "Training Scheduled",
  "Training Completed",
  "Certified Safe Space",
  "Annual Renewal",
] as const;
export type CertificationStage = (typeof CERTIFICATION_STAGES)[number];

// Default mock stage for a certified space (4/5). Revocation reasons used in copy.
export const CERTIFICATION_VALID_MONTHS = 12;
export const REVOCATION_REASONS = [
  "Repeated complaints",
  "Discrimination reports",
  "Safety violations",
];

// Distance helper used by people markers / preview cards
export function formatDistance(m: number) {
  return m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`;
}

// ---------------- Markers ----------------

export type CommunityMarker =
  | { id: string; kind: "place"; x: number; y: number; data: SafeSpace }
  | { id: string; kind: "activity"; x: number; y: number; data: DiscoverEvent }
  | { id: string; kind: "person"; x: number; y: number; data: DiscoverPerson }
  | { id: string; kind: "cluster"; x: number; y: number; count: number; userIds: string[] };

export type MarkersInput = {
  filter: CommunityFilter;
  availableNowOnly: boolean;
  city: string;
  query: string;
  zoom: number; // 1 = base, >1 = zoomed in
};

function matches(text: string, q: string) {
  return !q.trim() || text.toLowerCase().includes(q.trim().toLowerCase());
}

// Simple grid clustering for people when zoomed out
function clusterPeople(people: DiscoverPerson[], cellSize: number) {
  const cells = new Map<string, DiscoverPerson[]>();
  for (const p of people) {
    const key = `${Math.floor(p.mapX / cellSize)}:${Math.floor(p.mapY / cellSize)}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key)!.push(p);
  }
  const out: CommunityMarker[] = [];
  for (const group of cells.values()) {
    if (group.length === 1) {
      const p = group[0];
      out.push({ id: `person:${p.userId}`, kind: "person", x: p.mapX, y: p.mapY, data: p });
    } else {
      const avgX = group.reduce((s, p) => s + p.mapX, 0) / group.length;
      const avgY = group.reduce((s, p) => s + p.mapY, 0) / group.length;
      out.push({
        id: `cluster:${group.map((g) => g.userId).join(",")}`,
        kind: "cluster",
        x: avgX,
        y: avgY,
        count: group.length,
        userIds: group.map((g) => g.userId),
      });
    }
  }
  return out;
}

export function buildMarkers({ filter, availableNowOnly, city, query, zoom }: MarkersInput): CommunityMarker[] {
  if (!cityMatch(city, "Cologne")) return [];

  const showPlaces = !availableNowOnly && (filter === "community" || filter === "places");
  const showActivities = !availableNowOnly && (filter === "community" || filter === "activities");
  const showPeople = filter === "community" || filter === "people" || availableNowOnly;

  const out: CommunityMarker[] = [];
  if (showPlaces) {
    for (const s of SAFE_SPACES) {
      if (!matches(s.name + " " + s.category, query)) continue;
      out.push({ id: `place:${s.id}`, kind: "place", x: s.mapX, y: s.mapY, data: s });
    }
  }
  if (showActivities) {
    for (const e of DISCOVER_EVENTS) {
      if (!matches(e.title + " " + e.location, query)) continue;
      out.push({ id: `activity:${e.id}`, kind: "activity", x: e.mapX, y: e.mapY, data: e });
    }
  }
  if (showPeople) {
    const people = DISCOVER_PEOPLE.filter((p) => matches(p.name + " " + p.bio, query));
    // Cluster when zoomed out; show individuals when zoomed in
    const cellSize = zoom >= 1.6 ? 6 : zoom >= 1.2 ? 12 : 18;
    out.push(...clusterPeople(people, cellSize));
  }
  return out;
}

// MOCK events store — replace with backend later. Persisted in localStorage.

import { useEffect, useState } from "react";

export const EVENT_CATEGORIES = [
  "Social",
  "Culture",
  "Outdoors",
  "Wellness",
  "Professional",
  "Nightlife",
  "Other",
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_TYPES = ["public", "request", "invite"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  public: "Public Event",
  request: "Request to Join",
  invite: "Invite Only",
};

export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "waitlist";

export type ApplicationAnswer = { question: string; answer: string };

export type Application = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  status: ApplicationStatus;
  answers: ApplicationAnswer[];
  createdAt: number;
};

export type CommunityEvent = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  city: string;
  location: string;
  maxAttendees: number;
  type: EventType;
  organizerId: string;
  organizerName: string;
  questions: string[]; // 1..3
  createdAt: number;
};

type Store = {
  events: CommunityEvent[];
  applications: Application[];
};

const STORAGE_KEY = "pagu.events.v1";
const listeners = new Set<() => void>();

const SEED: CommunityEvent[] = [
  {
    id: "ev_seed_1",
    title: "Sunday Brunch & Slow Talk",
    description:
      "A long, easy brunch in a cozy Cologne café. We share what's on our minds — no agenda, just real conversation among FLINTA* people.",
    category: "Social",
    date: nextSunday(),
    time: "11:30",
    city: "Cologne",
    location: "Café Ludwig, Ehrenstraße",
    maxAttendees: 8,
    type: "request",
    organizerId: "u_seed_org",
    organizerName: "Lina",
    questions: [
      "What draws you to this brunch?",
      "Is there a topic you'd love to talk about?",
    ],
    createdAt: Date.now() - 86400_000 * 3,
  },
  {
    id: "ev_seed_2",
    title: "Forest Walk in Königsforst",
    description:
      "A slow morning walk through Königsforst — fresh air, easy pace, and unhurried conversation. Beginners welcome.",
    category: "Outdoors",
    date: nextSaturday(),
    time: "10:00",
    city: "Cologne",
    location: "Königsforst, S-Bahn Forsbach",
    maxAttendees: 12,
    type: "public",
    organizerId: "u_seed_org2",
    organizerName: "Mira",
    questions: ["How comfortable are you walking ~6 km?"],
    createdAt: Date.now() - 86400_000 * 2,
  },
  {
    id: "ev_seed_3",
    title: "Pottery & Tea",
    description:
      "An open studio evening — try the wheel, sip tea, leave with something you made.",
    category: "Culture",
    date: in14Days(),
    time: "18:30",
    city: "Berlin",
    location: "Studio Tonzeit, Neukölln",
    maxAttendees: 6,
    type: "invite",
    organizerId: "u_seed_org3",
    organizerName: "Yuki",
    questions: [
      "Have you tried pottery before?",
      "Why do you want to join this small circle?",
    ],
    createdAt: Date.now() - 86400_000,
  },
];

function nextSaturday() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return d.toISOString().slice(0, 10);
}
function nextSunday() {
  const d = new Date();
  d.setDate(d.getDate() + ((0 - d.getDay() + 7) % 7 || 7));
  return d.toISOString().slice(0, 10);
}
function in14Days() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

function read(): Store {
  if (typeof window === "undefined") return { events: SEED, applications: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const init: Store = { events: SEED, applications: [] };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw) as Store;
  } catch {
    return { events: SEED, applications: [] };
  }
}

function write(store: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export type EventFilters = {
  q?: string;
  category?: EventCategory | "all";
  city?: string | "all";
  date?: string; // ISO yyyy-mm-dd
  aroundMe?: { city: string } | null;
};

export function listEvents(filters: EventFilters = {}): CommunityEvent[] {
  const { events } = read();
  return events
    .filter((e) => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        if (!e.title.toLowerCase().includes(q)) return false;
      }
      if (filters.category && filters.category !== "all" && e.category !== filters.category)
        return false;
      if (filters.city && filters.city !== "all" && e.city !== filters.city) return false;
      if (filters.date && e.date !== filters.date) return false;
      if (filters.aroundMe && e.city !== filters.aroundMe.city) return false;
      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function listCities(): string[] {
  const { events } = read();
  return Array.from(new Set(events.map((e) => e.city))).sort();
}

export function getEvent(id: string): CommunityEvent | null {
  return read().events.find((e) => e.id === id) ?? null;
}

export function createEvent(
  input: Omit<CommunityEvent, "id" | "createdAt">,
): CommunityEvent {
  const store = read();
  const ev: CommunityEvent = {
    ...input,
    id: `ev_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: Date.now(),
  };
  store.events.unshift(ev);
  write(store);
  return ev;
}

export function getApplicationsForEvent(eventId: string): Application[] {
  return read().applications.filter((a) => a.eventId === eventId);
}

export function getUserApplication(
  eventId: string,
  userId: string,
): Application | null {
  return (
    read().applications.find(
      (a) => a.eventId === eventId && a.userId === userId,
    ) ?? null
  );
}

export function applyToEvent(input: {
  eventId: string;
  userId: string;
  userName: string;
  answers: ApplicationAnswer[];
}): Application {
  const store = read();
  const ev = store.events.find((e) => e.id === input.eventId);
  if (!ev) throw new Error("Event not found");

  const approvedCount = store.applications.filter(
    (a) => a.eventId === input.eventId && a.status === "approved",
  ).length;

  // Public events auto-approve; request/invite go to pending; full → waitlist
  let status: ApplicationStatus = "pending";
  if (approvedCount >= ev.maxAttendees) status = "waitlist";
  else if (ev.type === "public") status = "approved";

  const app: Application = {
    id: `app_${Math.random().toString(36).slice(2, 10)}`,
    eventId: input.eventId,
    userId: input.userId,
    userName: input.userName,
    status,
    answers: input.answers,
    createdAt: Date.now(),
  };
  // Replace if exists
  store.applications = store.applications.filter(
    (a) => !(a.eventId === input.eventId && a.userId === input.userId),
  );
  store.applications.push(app);
  write(store);
  return app;
}

export function countApprovedAttendees(eventId: string): number {
  return read().applications.filter(
    (a) => a.eventId === eventId && a.status === "approved",
  ).length;
}

// ---------- Reports (mock) ----------

export const REPORT_REASONS = [
  "Safety concern",
  "Harassment or discrimination",
  "Misleading information",
  "Spam or scam",
  "Event is not FLINTA*-safe",
  "Other",
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export type EventReport = {
  id: string;
  eventId: string;
  userId: string;
  reason: ReportReason;
  note?: string;
  createdAt: number;
};

const REPORTS_KEY = "pagu.event-reports.v1";

function readReports(): EventReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REPORTS_KEY);
    return raw ? (JSON.parse(raw) as EventReport[]) : [];
  } catch {
    return [];
  }
}

function writeReports(reports: EventReport[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function hasUserReportedEvent(eventId: string, userId: string): boolean {
  return readReports().some((r) => r.eventId === eventId && r.userId === userId);
}

export function reportEvent(input: {
  eventId: string;
  userId: string;
  reason: ReportReason;
  note?: string;
}): EventReport {
  const reports = readReports();
  const report: EventReport = {
    id: `rep_${Math.random().toString(36).slice(2, 10)}`,
    eventId: input.eventId,
    userId: input.userId,
    reason: input.reason,
    note: input.note?.trim() ? input.note.trim() : undefined,
    createdAt: Date.now(),
  };
  reports.push(report);
  writeReports(reports);
  return report;
}


export function useEventsStore() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return tick;
}

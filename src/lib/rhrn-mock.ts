// MOCK "Right Here Right Now" store — replace with backend later.
// All state in localStorage. Designed so a future Neon/Postgres schema can
// map 1:1 (availability_sessions, connection_requests, chats, messages,
// blocks, reports).

import { useEffect, useState } from "react";
import { DISCOVER_PEOPLE, type DiscoverPerson } from "@/lib/discover-mock";



export const INTENTIONS = [
  { id: "coffee", emoji: "☕", label: "Coffee" },
  { id: "culture", emoji: "🎨", label: "Culture" },
  { id: "walk", emoji: "🚶", label: "Walk" },
  { id: "concert", emoji: "🎵", label: "Concert Buddy" },
  { id: "conversation", emoji: "💬", label: "Conversation" },
  { id: "friends", emoji: "🌈", label: "New Friends" },
  { id: "dating", emoji: "❤️", label: "Open to Dating" },
  { id: "study", emoji: "📚", label: "Study Partner" },
  { id: "other", emoji: "✨", label: "Other" },
] as const;
export type IntentionId = (typeof INTENTIONS)[number]["id"];

export const RADIUS_OPTIONS = [
  { value: 100, label: "100m" },
  { value: 500, label: "500m" },
  { value: 1000, label: "1km" },
  { value: 5000, label: "5km" },
] as const;

export const SESSION_DURATION_MS = 30 * 60 * 1000;

export type AvailabilitySession = {
  userId: string;
  name: string;
  bio: string;
  interests: string[];
  languages: string[];
  city: string;
  memberSince: number;
  organizer: boolean;
  intentions: IntentionId[];
  radiusMeters: number;
  // Mock distance from current user, in meters.
  distanceFromMe: number;
  startedAt: number;
  expiresAt: number;
};

export type ConnectionRequest = {
  id: string;
  fromUserId: string;
  fromName: string;
  toUserId: string;
  icebreaker: string;
  status: "pending" | "accepted" | "declined";
  createdAt: number;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  fromUserId: string;
  text: string;
  createdAt: number;
  readAt?: number;
};

export type Chat = {
  id: string; // sorted userIds joined by ":"
  participantIds: [string, string];
  participantNames: Record<string, string>;
  createdAt: number;
};

export type ReportReason =
  | "harassment"
  | "discrimination"
  | "fake_profile"
  | "inappropriate"
  | "other";

export type Report = {
  id: string;
  fromUserId: string;
  targetUserId: string;
  reason: ReportReason;
  note: string;
  createdAt: number;
};

type Store = {
  sessions: AvailabilitySession[];
  requests: ConnectionRequest[];
  chats: Chat[];
  messages: ChatMessage[];
  blocks: { byUserId: string; targetUserId: string }[];
  reports: Report[];
};

const KEY = "pagu.rhrn.v1";
const listeners = new Set<() => void>();

function emptyStore(): Store {
  return { sessions: [], requests: [], chats: [], messages: [], blocks: [], reports: [] };
}

function read(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seedStore();
    return JSON.parse(raw) as Store;
  } catch {
    return emptyStore();
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

// Seed a few mock available members so the discovery view isn't empty.
function seedStore(): Store {
  const now = Date.now();
  const mk = (
    userId: string,
    name: string,
    bio: string,
    distanceFromMe: number,
    intentions: IntentionId[],
    interests: string[],
    languages: string[],
    organizer = false,
  ): AvailabilitySession => ({
    userId,
    name,
    bio,
    interests,
    languages,
    city: "Cologne",
    memberSince: now - 1000 * 60 * 60 * 24 * 120,
    organizer,
    intentions,
    radiusMeters: 5000,
    distanceFromMe,
    startedAt: now - 1000 * 60 * 3,
    expiresAt: now + SESSION_DURATION_MS - 1000 * 60 * 3,
  });
  const s: Store = {
    ...emptyStore(),
    sessions: [
      mk("seed_1", "Alex", "Likes long walks and oat lattes.", 45, ["coffee", "walk"], ["coffee", "art"], ["EN", "DE"]),
      mk("seed_2", "Yuki", "Museum nerd, visiting town.", 320, ["culture", "conversation"], ["museums", "design"], ["EN", "JP"], true),
      mk("seed_3", "Sam", "Concert buddy needed tonight.", 1200, ["concert", "friends"], ["indie", "techno"], ["EN"]),
    ],
  };
  write(s);
  return s;
}

function useStoreSync() {
  const [, setT] = useState(0);
  useEffect(() => {
    const l = () => setT((t) => t + 1);
    listeners.add(l);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) l();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
}

// ---------- Sessions ----------

export function getMySession(userId: string): AvailabilitySession | null {
  const s = read();
  const mine = s.sessions.find((x) => x.userId === userId);
  if (!mine) return null;
  if (mine.expiresAt <= Date.now()) {
    write({ ...s, sessions: s.sessions.filter((x) => x.userId !== userId) });
    return null;
  }
  return mine;
}

export function becomeAvailable(input: Omit<AvailabilitySession, "startedAt" | "expiresAt" | "distanceFromMe"> & { distanceFromMe?: number }) {
  const s = read();
  const now = Date.now();
  const session: AvailabilitySession = {
    ...input,
    distanceFromMe: 0,
    startedAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };
  const next = {
    ...s,
    sessions: [...s.sessions.filter((x) => x.userId !== input.userId), session],
  };
  write(next);
  return session;
}

export function goInvisible(userId: string) {
  const s = read();
  write({ ...s, sessions: s.sessions.filter((x) => x.userId !== userId) });
}

const INTENTION_LABEL_TO_ID: Record<string, IntentionId> = {
  coffee: "coffee",
  culture: "culture",
  walk: "walk",
  "concert buddy": "concert",
  conversation: "conversation",
  "new friends": "friends",
  "open to dating": "dating",
  "study partner": "study",
  other: "other",
};

function discoverPersonToSession(p: DiscoverPerson): AvailabilitySession {
  const now = Date.now();
  return {
    userId: p.userId,
    name: p.name,
    bio: p.bio,
    interests: p.interests,
    languages: p.languages,
    city: "Cologne",
    memberSince: p.memberSince,
    organizer: p.organizer,
    intentions: p.intentions
      .map((i) => INTENTION_LABEL_TO_ID[i.label.toLowerCase()])
      .filter(Boolean) as IntentionId[],
    radiusMeters: 5000,
    distanceFromMe: p.distanceMeters,
    startedAt: now - 5 * 60_000,
    expiresAt: now + 25 * 60_000,
  };
}

export function listAvailable(currentUserId: string): AvailabilitySession[] {
  const s = read();
  const now = Date.now();
  const blockedByMe = new Set(s.blocks.filter((b) => b.byUserId === currentUserId).map((b) => b.targetUserId));
  const blockedMe = new Set(s.blocks.filter((b) => b.targetUserId === currentUserId).map((b) => b.byUserId));
  const stored = s.sessions.filter((x) => x.expiresAt > now);
  const storedIds = new Set(stored.map((x) => x.userId));
  const fromDiscover = DISCOVER_PEOPLE
    .filter((p) => !storedIds.has(p.userId))
    .map(discoverPersonToSession);
  return [...stored, ...fromDiscover]
    .filter((x) => x.userId !== currentUserId)
    .filter((x) => !blockedByMe.has(x.userId) && !blockedMe.has(x.userId))
    .sort((a, b) => a.distanceFromMe - b.distanceFromMe);
}

export function getSessionByUserId(userId: string): AvailabilitySession | null {
  const stored = read().sessions.find((x) => x.userId === userId);
  if (stored) return stored;
  const p = DISCOVER_PEOPLE.find((d) => d.userId === userId);
  return p ? discoverPersonToSession(p) : null;
}

// ---------- Demo seeding ----------

// Seeds one mock conversation so a new user immediately sees what RHRN chat
// looks like. Idempotent — only seeds once per current user.
export function ensureSeedChats(currentUserId: string, currentUserName: string) {
  if (typeof window === "undefined") return;
  const flagKey = `pagu.rhrn.seeded.${currentUserId}`;
  if (window.localStorage.getItem(flagKey)) return;

  const s = read();
  const partner = DISCOVER_PEOPLE.find((p) => p.userId === "p2"); // Yuki
  if (!partner) return;
  const chatId = [currentUserId, partner.userId].sort().join(":");
  if (s.chats.find((c) => c.id === chatId)) {
    window.localStorage.setItem(flagKey, "1");
    return;
  }
  const now = Date.now();
  const chat: Chat = {
    id: chatId,
    participantIds: [currentUserId, partner.userId].sort() as [string, string],
    participantNames: { [currentUserId]: currentUserName, [partner.userId]: partner.name },
    createdAt: now - 1000 * 60 * 45,
  };
  const mkMsg = (from: string, text: string, minsAgo: number): ChatMessage => ({
    id: `m_seed_${Math.random().toString(36).slice(2, 10)}`,
    chatId,
    fromUserId: from,
    text,
    createdAt: now - minsAgo * 60_000,
  });
  const messages: ChatMessage[] = [
    mkMsg(partner.userId, "Hey! Want to grab a coffee?", 42),
    mkMsg(currentUserId, "Yes! I'm free in about an hour ☕", 38),
    mkMsg(partner.userId, "Perfect. Café Riese, near the museum?", 35),
    mkMsg(currentUserId, "Love that spot. See you there 🌸", 33),
    mkMsg(partner.userId, "Looking forward to it!", 30),
  ];
  // Also create an accepted incoming request so the Requests inbox has context.
  const req: ConnectionRequest = {
    id: `req_seed_${Math.random().toString(36).slice(2, 8)}`,
    fromUserId: partner.userId,
    fromName: partner.name,
    toUserId: currentUserId,
    icebreaker: "Want to grab a coffee?",
    status: "accepted",
    createdAt: now - 1000 * 60 * 50,
  };
  write({
    ...s,
    chats: [...s.chats, chat],
    messages: [...s.messages, ...messages],
    requests: [...s.requests, req],
  });
  window.localStorage.setItem(flagKey, "1");
}



// ---------- Requests ----------

export function sendRequest(input: Omit<ConnectionRequest, "id" | "status" | "createdAt">) {
  const s = read();
  const req: ConnectionRequest = {
    ...input,
    id: `req_${Math.random().toString(36).slice(2, 10)}`,
    status: "pending",
    createdAt: Date.now(),
  };
  write({ ...s, requests: [...s.requests, req] });
  return req;
}

export function listIncomingRequests(userId: string): ConnectionRequest[] {
  return read().requests.filter((r) => r.toUserId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

export function listOutgoingRequests(userId: string): ConnectionRequest[] {
  return read().requests.filter((r) => r.fromUserId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

export function respondToRequest(id: string, decision: "accepted" | "declined") {
  const s = read();
  const req = s.requests.find((r) => r.id === id);
  if (!req) return;
  req.status = decision;
  let chats = s.chats;
  let messages = s.messages;
  if (decision === "accepted") {
    const chatId = [req.fromUserId, req.toUserId].sort().join(":");
    if (!chats.find((c) => c.id === chatId)) {
      chats = [
        ...chats,
        {
          id: chatId,
          participantIds: [req.fromUserId, req.toUserId].sort() as [string, string],
          participantNames: { [req.fromUserId]: req.fromName, [req.toUserId]: "You" },
          createdAt: Date.now(),
        },
      ];
      messages = [
        ...messages,
        {
          id: `m_${Math.random().toString(36).slice(2, 10)}`,
          chatId,
          fromUserId: req.fromUserId,
          text: req.icebreaker,
          createdAt: Date.now(),
        },
      ];
    }
  }
  write({ ...s, requests: [...s.requests], chats, messages });
}

// ---------- Chat ----------

export function listChats(userId: string): Chat[] {
  return read().chats.filter((c) => c.participantIds.includes(userId));
}

export function getChat(chatId: string): Chat | null {
  return read().chats.find((c) => c.id === chatId) ?? null;
}

export function listMessages(chatId: string): ChatMessage[] {
  return read().messages.filter((m) => m.chatId === chatId).sort((a, b) => a.createdAt - b.createdAt);
}

export function sendMessage(chatId: string, fromUserId: string, text: string) {
  const s = read();
  const msg: ChatMessage = {
    id: `m_${Math.random().toString(36).slice(2, 10)}`,
    chatId,
    fromUserId,
    text,
    createdAt: Date.now(),
  };
  write({ ...s, messages: [...s.messages, msg] });
}

// ---------- Safety ----------

export function blockUser(byUserId: string, targetUserId: string) {
  const s = read();
  if (s.blocks.find((b) => b.byUserId === byUserId && b.targetUserId === targetUserId)) return;
  write({ ...s, blocks: [...s.blocks, { byUserId, targetUserId }] });
}

export function reportUser(input: Omit<Report, "id" | "createdAt">) {
  const s = read();
  const r: Report = { ...input, id: `rep_${Math.random().toString(36).slice(2, 10)}`, createdAt: Date.now() };
  write({ ...s, reports: [...s.reports, r] });
  return r;
}

// ---------- Reactive hooks ----------

export function useMySession(userId: string | undefined) {
  useStoreSync();
  if (!userId) return null;
  return getMySession(userId);
}

export function useAvailable(userId: string | undefined) {
  useStoreSync();
  if (!userId) return [];
  return listAvailable(userId);
}

export function useIncomingRequests(userId: string | undefined) {
  useStoreSync();
  if (!userId) return [];
  return listIncomingRequests(userId);
}

export function useChats(userId: string | undefined) {
  useStoreSync();
  if (!userId) return [];
  return listChats(userId);
}

export function useChatMessages(chatId: string | undefined) {
  useStoreSync();
  if (!chatId) return [];
  return listMessages(chatId);
}

// ---------- Eligibility ----------

export type Eligibility = {
  loggedIn: boolean;
  approved: boolean;
  profileComplete: boolean;
  guidelinesAccepted: boolean;
};

const GUIDELINES_KEY = "pagu.rhrn.guidelines.v1";

export function hasAcceptedGuidelines(userId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(GUIDELINES_KEY);
    if (!raw) return false;
    const obj = JSON.parse(raw) as Record<string, boolean>;
    return !!obj[userId];
  } catch {
    return false;
  }
}

export function acceptGuidelines(userId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(GUIDELINES_KEY);
    const obj = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    obj[userId] = true;
    window.localStorage.setItem(GUIDELINES_KEY, JSON.stringify(obj));
    listeners.forEach((l) => l());
  } catch {
    /* ignore */
  }
}

export function getEligibility(user: {
  id: string;
  bio?: string;
  city?: string;
} | null): Eligibility {
  if (!user) {
    return { loggedIn: false, approved: false, profileComplete: false, guidelinesAccepted: false };
  }
  return {
    loggedIn: true,
    approved: true, // mock: every signed-in user is approved
    profileComplete: !!(user.bio && user.bio.trim().length > 0 && user.city),
    guidelinesAccepted: hasAcceptedGuidelines(user.id),
  };
}

export function isEligible(e: Eligibility): boolean {
  return e.loggedIn && e.approved && e.profileComplete && e.guidelinesAccepted;
}

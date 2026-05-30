// MOCK session store — replace when real backend lands.
// Persists logged-in user in localStorage. Subscribers re-render on change.

import { useEffect, useState } from "react";

export type SessionUser = {
  id: string;
  name: string;
  method: "email" | "phone";
  identifier: string;
  city: string;
  bio: string;
  interests: string[];
  attended_events_count: number;
  organizer_unlocked: boolean;
  createdAt: number;
};

const STORAGE_KEY = "pagu.session.v1";
const listeners = new Set<() => void>();

function readStorage(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

function writeStorage(user: SessionUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function getCurrentUser(): SessionUser | null {
  return readStorage();
}

export function isProfileComplete(
  user: Pick<SessionUser, "bio" | "city"> | null | undefined,
): boolean {
  return !!(user?.bio?.trim() && user.city?.trim());
}

export function signIn(input: {
  name?: string;
  method: "email" | "phone";
  identifier: string;
}): SessionUser {
  const existing = readStorage();
  const user: SessionUser =
    existing && existing.identifier === input.identifier
      ? existing
      : {
          id: `u_${Math.random().toString(36).slice(2, 10)}`,
          name: input.name?.trim() || input.identifier.split("@")[0] || "Member",
          method: input.method,
          identifier: input.identifier,
          city: "Cologne",
          bio: "",
          interests: [],
          // Demo: every new user has attended 1 event so organizer is unlocked.
          // In real backend this comes from actual attendance records.
          attended_events_count: 1,
          organizer_unlocked: true,
          createdAt: Date.now(),
        };
  writeStorage(user);
  return user;
}

export function signOut() {
  writeStorage(null);
}

export function updateCurrentUser(patch: Partial<SessionUser>) {
  const u = readStorage();
  if (!u) return;
  writeStorage({ ...u, ...patch });
}

export function useCurrentUser(): SessionUser | null {
  // Always start null to match SSR; hydrate from storage after mount.
  const [user, setUser] = useState<SessionUser | null>(null);
  useEffect(() => {
    setUser(readStorage());
    const l = () => setUser(readStorage());
    listeners.add(l);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) l();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return user;
}

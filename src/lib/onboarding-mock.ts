// MOCK onboarding state — stored in localStorage, keyed per user identifier.
// Replace when real backend lands.

import { useEffect, useState } from "react";

export type OnboardingAnswers = {
  contribution: string;
  attractedToPagu: string;
  communityChallenges: string;
};

export type OnboardingState = {
  valuesAccepted: boolean;
  rulesOpened: boolean;
  rulesAccepted: boolean;
  flintaConfirmed: boolean;
  answers: OnboardingAnswers;
  onboardingCompleted: boolean;
};

const STORAGE_KEY = "pagu.onboarding.v1";

export const EMPTY_ONBOARDING: OnboardingState = {
  valuesAccepted: false,
  rulesOpened: false,
  rulesAccepted: false,
  flintaConfirmed: false,
  answers: { contribution: "", attractedToPagu: "", communityChallenges: "" },
  onboardingCompleted: false,
};

type Registry = Record<string, OnboardingState>;

function readAll(): Registry {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Registry) : {};
  } catch {
    return {};
  }
}

function writeAll(reg: Registry) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reg));
  } catch {
    /* ignore */
  }
}

export function getOnboarding(identifier: string): OnboardingState {
  if (!identifier) return EMPTY_ONBOARDING;
  return readAll()[identifier] ?? EMPTY_ONBOARDING;
}

export function saveOnboarding(identifier: string, state: OnboardingState) {
  if (!identifier) return;
  const all = readAll();
  all[identifier] = state;
  writeAll(all);
}

export function isOnboardingComplete(identifier: string | undefined | null): boolean {
  if (!identifier) return false;
  return getOnboarding(identifier).onboardingCompleted === true;
}

export function useOnboarding(identifier: string | undefined | null) {
  const [state, setState] = useState<OnboardingState>(EMPTY_ONBOARDING);
  useEffect(() => {
    if (!identifier) return;
    setState(getOnboarding(identifier));
  }, [identifier]);
  return [state, setState] as const;
}

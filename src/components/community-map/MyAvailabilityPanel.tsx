import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Sparkles,
  Clock,
  Eye,
  EyeOff,
  Inbox,
  MessageCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCurrentUser } from "@/lib/session-mock";
import {
  INTENTIONS,
  RADIUS_OPTIONS,
  acceptGuidelines,
  becomeAvailable,
  ensureSeedChats,
  getEligibility,
  goInvisible,
  isEligible,
  useChats,
  useIncomingRequests,
  useMySession,
  type IntentionId,
} from "@/lib/rhrn-mock";

/**
 * Self "Available Now" controls embedded inside the Community Map.
 * Collapsible so the map stays the visual center.
 */
export function MyAvailabilityPanel() {
  const user = useCurrentUser();
  const mine = useMySession(user?.id);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) ensureSeedChats(user.id, user.name);
  }, [user]);

  if (!user) return null;

  const isActive = !!mine;

  return (
    <Card className="border-emerald-500/30 bg-emerald-500/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"
            }`}
          />
          <span className="font-medium text-foreground">
            {isActive ? "You're Available Now" : "Become Available Now"}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {isActive ? "Manage your session" : "Open to spontaneous connection"}
          </span>
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && (
        <CardContent className="pt-0 pb-4 space-y-4">
          <PanelBody />
        </CardContent>
      )}
    </Card>
  );
}

function PanelBody() {
  const user = useCurrentUser();
  const mine = useMySession(user?.id);
  if (!user) return null;
  const eligibility = getEligibility(user);

  if (!isEligible(eligibility)) return <EligibilityGate userId={user.id} eligibility={eligibility} />;
  return mine ? <ActiveView /> : <Onboarding />;
}

function EligibilityGate({
  userId,
  eligibility,
}: {
  userId: string;
  eligibility: ReturnType<typeof getEligibility>;
}) {
  const [accepted, setAccepted] = useState(eligibility.guidelinesAccepted);
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Consent, respect, and inclusion are expected at all times.
      </p>
      <ul className="space-y-2 text-sm">
        <Check item="Approved community member" ok={eligibility.approved} />
        <Check
          item="Profile completed (bio + city)"
          ok={eligibility.profileComplete}
          action={
            !eligibility.profileComplete && (
              <Link to="/profile" className="text-gold underline">
                Complete profile
              </Link>
            )
          }
        />
        <Check item="Accepted community guidelines" ok={accepted} />
      </ul>
      {!eligibility.guidelinesAccepted && (
        <label className="flex items-start gap-3 rounded-lg border border-border/60 p-3 cursor-pointer">
          <Checkbox checked={accepted} onCheckedChange={(v) => setAccepted(!!v)} className="mt-0.5" />
          <span className="text-sm text-muted-foreground">
            I agree to engage with kindness, respect consent, and treat every FLINTA* member with care.
          </span>
        </label>
      )}
      <Button
        variant="hero"
        size="lg"
        className="w-full"
        disabled={!eligibility.profileComplete || !accepted}
        onClick={() => {
          if (accepted) acceptGuidelines(userId);
        }}
      >
        Continue
      </Button>
    </div>
  );
}

function Check({ item, ok, action }: { item: string; ok: boolean; action?: React.ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2">
      <span className="flex items-center gap-2">
        <span className={ok ? "text-gold" : "text-muted-foreground"}>{ok ? "●" : "○"}</span>
        <span>{item}</span>
      </span>
      {action}
    </li>
  );
}

function Onboarding() {
  const [step, setStep] = useState<"intro" | "configure">("intro");
  const [radius, setRadius] = useState<number>(1000);
  const [intentions, setIntentions] = useState<IntentionId[]>([]);
  const user = useCurrentUser()!;

  if (step === "intro") {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-border/60 bg-card/50 p-4 text-sm space-y-2">
          <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> Only approximate distance is shared.</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Your exact location is never shown.</p>
          <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /> Availability ends automatically after 30 minutes.</p>
        </div>
        <Button variant="hero" size="lg" className="w-full" onClick={() => setStep("configure")}>
          <Sparkles className="h-4 w-4" /> Become Available
        </Button>
        <RequestsAndChatsLinks />
      </div>
    );
  }

  function toggle(id: IntentionId) {
    setIntentions((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function activate() {
    becomeAvailable({
      userId: user.id,
      name: user.name,
      bio: user.bio || "",
      interests: user.interests || [],
      languages: ["EN"],
      city: user.city || "",
      memberSince: user.createdAt,
      organizer: !!user.organizer_unlocked,
      intentions,
      radiusMeters: radius,
    });
  }

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <Label>Availability radius</Label>
        <div className="grid grid-cols-4 gap-2">
          {RADIUS_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setRadius(o.value)}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                radius === o.value
                  ? "border-gold bg-gold/10 text-foreground"
                  : "border-border/60 text-muted-foreground hover:bg-accent"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <Label>What are you looking for right now?</Label>
        <div className="flex flex-wrap gap-2">
          {INTENTIONS.map((i) => {
            const active = intentions.includes(i.id);
            return (
              <button
                key={i.id}
                onClick={() => toggle(i.id)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-gold bg-gold/10 text-foreground"
                    : "border-border/60 text-muted-foreground hover:bg-accent"
                }`}
              >
                <span className="mr-1">{i.emoji}</span>
                {i.label}
              </button>
            );
          })}
        </div>
      </section>

      <Button
        variant="hero"
        size="lg"
        className="w-full"
        disabled={intentions.length === 0}
        onClick={activate}
      >
        <Eye className="h-4 w-4" /> Become Available
      </Button>
    </div>
  );
}

function ActiveView() {
  const user = useCurrentUser()!;
  const mine = useMySession(user.id);
  const remaining = useCountdown(mine?.expiresAt);
  if (!mine) return null;

  if (!remaining) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-sm text-muted-foreground">Your availability session has ended.</p>
        <Button variant="hero" size="lg" onClick={() => goInvisible(user.id)}>
          Become Available Again
        </Button>
      </div>
    );
  }

  const radiusLabel = RADIUS_OPTIONS.find((r) => r.value === mine.radiusMeters)?.label ?? `${mine.radiusMeters}m`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
          <span><Clock className="h-3.5 w-3.5 inline mr-1" /> {remaining} left</span>
          <span><MapPin className="h-3.5 w-3.5 inline mr-1" /> Radius {radiusLabel}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => goInvisible(user.id)}>
          <EyeOff className="h-3.5 w-3.5" /> Go Invisible
        </Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {mine.intentions.map((id) => {
          const i = INTENTIONS.find((x) => x.id === id)!;
          return (
            <Badge key={id} variant="secondary" className="font-normal">
              {i.emoji} {i.label}
            </Badge>
          );
        })}
      </div>
      <RequestsAndChatsLinks />
    </div>
  );
}

function RequestsAndChatsLinks() {
  const user = useCurrentUser();
  const requests = useIncomingRequests(user?.id);
  const chats = useChats(user?.id);
  const pending = requests.filter((r) => r.status === "pending").length;
  return (
    <div className="grid grid-cols-2 gap-3">
      <Link to="/rhrn/requests" className="rounded-lg border border-border/60 bg-card p-3 flex items-center gap-2 hover:bg-accent transition-colors">
        <Inbox className="h-4 w-4 text-gold" />
        <span className="text-sm">Requests</span>
        {pending > 0 && <span className="ml-auto text-xs rounded-full bg-gold text-gold-foreground px-2 py-0.5">{pending}</span>}
      </Link>
      <Link to="/rhrn/chats" className="rounded-lg border border-border/60 bg-card p-3 flex items-center gap-2 hover:bg-accent transition-colors">
        <MessageCircle className="h-4 w-4 text-gold" />
        <span className="text-sm">Chats</span>
        {chats.length > 0 && <span className="ml-auto text-xs text-muted-foreground">{chats.length}</span>}
      </Link>
    </div>
  );
}

function useCountdown(expiresAt: number | undefined): string | null {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = (expiresAt ?? 0) - now;
  if (ms <= 0) return null;
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  if (mins >= 1) return `${mins} minute${mins === 1 ? "" : "s"}`;
  return `${secs}s`;
}

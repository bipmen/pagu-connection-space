import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { useCurrentUser } from "@/lib/session-mock";
import {
  INTENTIONS,
  RADIUS_OPTIONS,
  SESSION_DURATION_MS,
  acceptGuidelines,
  becomeAvailable,
  getEligibility,
  goInvisible,
  isEligible,
  useAvailable,
  useChats,
  useIncomingRequests,
  useMySession,
  type IntentionId,
} from "@/lib/rhrn-mock";
import { GoInvisibleFab } from "@/components/rhrn/invisible-button";

export const Route = createFileRoute("/rhrn/")({
  head: () => ({
    meta: [
      { title: "Right Here Right Now — Pagu" },
      { name: "description", content: "Connect with nearby community members open to spontaneous, respectful connection." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RhrnIndex,
});

function RhrnIndex() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const mine = useMySession(user?.id);
  const eligibility = getEligibility(user);

  useEffect(() => {
    if (user === null && typeof window !== "undefined") {
      // wait one tick; useCurrentUser hydrates after mount
    }
  }, [user]);

  if (!user) {
    return (
      <Shell>
        <EmptyGate
          title="Sign in to continue"
          body="Right Here Right Now is for approved Pagu members."
          cta={<Button asChild variant="hero"><Link to="/login">Sign in</Link></Button>}
        />
      </Shell>
    );
  }

  if (!isEligible(eligibility)) {
    return (
      <Shell>
        <EligibilityGate userId={user.id} eligibility={eligibility} />
      </Shell>
    );
  }

  return (
    <Shell>
      {mine ? <ActiveView /> : <Onboarding />}
      <GoInvisibleFab />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-3xl px-5 py-8 lg:py-12">{children}</main>
      <Footer />
    </div>
  );
}

function EmptyGate({ title, body, cta }: { title: string; body: string; cta: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-8 text-center space-y-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{body}</p>
        <div className="pt-2">{cta}</div>
      </CardContent>
    </Card>
  );
}

function EligibilityGate({ userId, eligibility }: { userId: string; eligibility: ReturnType<typeof getEligibility> }) {
  const [accepted, setAccepted] = useState(eligibility.guidelinesAccepted);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Right Here Right Now</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          This feature exists to encourage respectful community connection.
          Consent, respect, and inclusion are expected at all times.
        </p>
        <ul className="space-y-2 text-sm">
          <Check item="Approved community member" ok={eligibility.approved} />
          <Check item="Profile completed (bio + city)" ok={eligibility.profileComplete} action={!eligibility.profileComplete && <Link to="/profile" className="text-gold underline">Complete profile</Link>} />
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
      </CardContent>
    </Card>
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" /> Right Here Right Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-muted-foreground">
            Connect with nearby community members who are open to spontaneous connection right now.
          </p>
          <div className="rounded-lg border border-border/60 bg-card/50 p-4 text-sm space-y-2">
            <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> This feature shares approximate distance only.</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Your exact location is never shown.</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /> Availability ends automatically after 30 minutes.</p>
          </div>
          <Button variant="hero" size="lg" className="w-full" onClick={() => setStep("configure")}>
            Become Available
          </Button>
          <RequestsAndChatsLinks />
        </CardContent>
      </Card>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Set your availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <p className="text-xs text-muted-foreground">
          Your session will end automatically after 30 minutes. You can Go Invisible at any time.
        </p>

        <Button
          variant="hero"
          size="lg"
          className="w-full"
          disabled={intentions.length === 0}
          onClick={activate}
        >
          <Eye className="h-4 w-4" /> Become Available
        </Button>
      </CardContent>
    </Card>
  );
}

function ActiveView() {
  const user = useCurrentUser();
  const mine = useMySession(user?.id);
  const others = useAvailable(user?.id);
  const remaining = useCountdown(mine?.expiresAt);
  if (!user || !mine) return null;

  if (!remaining) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-xl font-semibold">Your availability session has ended.</h2>
          <p className="text-muted-foreground">
            Want to keep connecting? Become available again.
          </p>
          <Button variant="hero" size="lg" onClick={() => goInvisible(user.id)}>
            Become Available Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const radiusLabel = RADIUS_OPTIONS.find((r) => r.value === mine.radiusMeters)?.label ?? `${mine.radiusMeters}m`;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium">Available Now</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => goInvisible(user.id)}>
              <EyeOff className="h-3.5 w-3.5" /> Go Invisible
            </Button>
          </div>
          <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
            <span><Clock className="h-3.5 w-3.5 inline mr-1" /> Available for {remaining}</span>
            <span><MapPin className="h-3.5 w-3.5 inline mr-1" /> Radius {radiusLabel}</span>
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
        </CardContent>
      </Card>

      <RequestsAndChatsLinks />

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Nearby right now</h2>
          <span className="text-xs text-muted-foreground">{others.length} member{others.length === 1 ? "" : "s"}</span>
        </div>
        {others.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              No one nearby right now. Check back in a few minutes.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {others.map((s) => <MemberCard key={s.userId} s={s} />)}
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center pt-2">
          Consent, respect, and inclusion are expected at all times.
        </p>
      </section>
    </div>
  );
}

function MemberCard({ s }: { s: ReturnType<typeof useAvailable>[number] }) {
  return (
    <Link
      to="/rhrn/$id"
      params={{ id: s.userId }}
      className="block rounded-xl border border-border/60 bg-card p-4 hover:border-gold/40 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{s.name}</span>
        <span className="text-xs text-muted-foreground">{formatDistance(s.distanceFromMe)}</span>
      </div>
      {s.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.bio}</p>}
      <div className="flex flex-wrap gap-1 mt-2">
        {s.intentions.slice(0, 3).map((id) => {
          const i = INTENTIONS.find((x) => x.id === id)!;
          return (
            <span key={id} className="text-xs rounded-full bg-secondary/60 px-2 py-0.5">
              {i.emoji} {i.label}
            </span>
          );
        })}
      </div>
      {s.organizer && <p className="text-xs text-gold mt-2">✨ Organizer</p>}
    </Link>
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

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)}m away`;
  return `${(m / 1000).toFixed(1)}km away`;
}

function useCountdown(expiresAt: number): string | null {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = expiresAt - now;
  if (ms <= 0) return null;
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  if (mins >= 1) return `${mins} minute${mins === 1 ? "" : "s"}`;
  return `${secs}s`;
}

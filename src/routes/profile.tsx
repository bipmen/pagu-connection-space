import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  Sparkles,
  Calendar,
  MessageCircle,
  
  UserRound,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { isProfileComplete, useCurrentUser } from "@/lib/session-mock";
import {
  ensureSeedChats,
  useAvailable,
  useChats,
  
  useMySession,
} from "@/lib/rhrn-mock";
import { listEvents } from "@/lib/events-mock";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Pagu" },
      { name: "description", content: "Your Pagu hub: profile, discovery, and community activity in one place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const mySession = useMySession(user?.id);
  const nearby = useAvailable(user?.id);
  const chats = useChats(user?.id);

  useEffect(() => {
    if (user) ensureSeedChats(user.id, user.name);
  }, [user]);

  useEffect(() => {
    if (user && !isProfileComplete(user)) {
      navigate({ to: "/profile-setup" });
    }
  }, [navigate, user]);

  // Soft gate: bounce to login if no user (after hydration tick).
  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof window !== "undefined" && !window.localStorage.getItem("pagu.session.v1")) {
        navigate({ to: "/login" });
      }
    }, 50);
    return () => clearTimeout(t);
  }, [navigate]);

  if (!user) {
    return (
      <Shell>
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-2xl font-semibold">Sign in to view your profile</h1>
            <Button asChild variant="hero">
              <Link to="/login">Sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  if (!isProfileComplete(user)) {
    return (
      <Shell>
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-2xl font-semibold">Complete your profile to continue</h1>
            <p className="text-muted-foreground">
              You are almost in. Add a few details first, then your profile will be ready.
            </p>
            <Button asChild variant="hero">
              <Link to="/profile-setup">Complete profile</Link>
            </Button>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  
  const upcomingEvents = listEvents()
    .filter((e) => e.date >= new Date().toISOString().slice(0, 10))
    .slice(0, 3);

  const cityEventsCount = user.city
    ? listEvents().filter(
        (e) =>
          e.date >= new Date().toISOString().slice(0, 10) &&
          e.city.toLowerCase() === user.city!.toLowerCase(),
      ).length
    : 0;


  return (
    <Shell>
      <div className="space-y-8">
        {/* Welcome */}
        <section className="space-y-2">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-3xl md:text-4xl">Hi, {user.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPin className="h-3.5 w-3.5" /> {user.city || "City not set"}
            {user.organizer_unlocked && (
              <Badge variant="secondary" className="ml-2 font-normal">✨ Organizer</Badge>
            )}
          </p>
        </section>

        {/* Status grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatusTile
            icon={mySession ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            label="RHRN"
            value={mySession ? "Available" : "Invisible"}
            tone={mySession ? "live" : "muted"}
          />
          <StatusTile
            icon={<MessageCircle className="h-4 w-4" />}
            label="Chats"
            value={`${chats.length} active`}
            tone={chats.length > 0 ? "accent" : "muted"}
          />
          <StatusTile
            icon={<Sparkles className="h-4 w-4" />}
            label="Nearby now"
            value={`${nearby.length} members`}
            tone="muted"
          />
          <StatusTile
            icon={<Calendar className="h-4 w-4" />}
            label="Events"
            value={`${cityEventsCount} in ${user.city || "your city"}`}
            tone={cityEventsCount > 0 ? "accent" : "muted"}
          />
        </section>


        {/* Quick access to logged-in features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            to="/events"
            icon={<Calendar className="h-5 w-5 text-gold" />}
            title="Events"
            body="Discover, create and join community activities."
            cta="Open Events"
          />
          <FeatureCard
            to="/community-map"
            icon={<Compass className="h-5 w-5 text-gold" />}
            title="Discovery"
            body="Activities, Safe Spaces and people open to connect — all in one map."
            cta="Open map"
          />
          <FeatureCard
            to="/profile-setup"
            icon={<UserRound className="h-5 w-5 text-gold" />}
            title="Profile details"
            body="Edit your bio, city, and interests."
            cta="Edit details"
          />
        </section>

        {/* Activity */}
        <section>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-gold" /> Your conversations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {chats.length === 0 ? (
                <p className="text-sm text-muted-foreground">No conversations yet. Send an icebreaker from Discovery.</p>
              ) : (
                <>
                  {chats.slice(0, 3).map((c) => {
                    const otherId = c.participantIds.find((x) => x !== user.id)!;
                    const otherName = c.participantNames[otherId] || "Member";
                    return (
                      <Link
                        key={c.id}
                        to="/rhrn/chat/$id"
                        params={{ id: c.id }}
                        className="flex items-center justify-between text-sm border-b border-border/40 last:border-0 pb-2 last:pb-0 hover:text-foreground"
                      >
                        <span className="font-medium">{otherName}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </Link>
                    );
                  })}
                  <Link to="/rhrn/chats" className="text-xs text-gold inline-flex items-center gap-1 pt-1">
                    Open inbox <ArrowRight className="h-3 w-3" />
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </section>


        {/* Upcoming events */}
        <section>
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gold" /> Upcoming community events
              </CardTitle>
              <Link to="/community-events" className="text-xs text-gold inline-flex items-center gap-1">
                Browse all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events scheduled.</p>
              ) : (
                upcomingEvents.map((e) => (
                  <Link
                    key={e.id}
                    to="/community-events/$id"
                    params={{ id: e.id }}
                    className="flex items-center justify-between text-sm border-b border-border/40 last:border-0 pb-2 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{e.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(e.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {e.time} · {e.city}
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-normal">{e.category}</Badge>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Consent, respect, and inclusion are expected at all times.
        </p>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-5xl px-5 py-8 lg:py-12">{children}</main>
      <Footer />
    </div>
  );
}

function StatusTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "live" | "accent" | "muted";
}) {
  const toneClass =
    tone === "live"
      ? "border-green-500/40 bg-green-500/5"
      : tone === "accent"
      ? "border-gold/40 bg-gold/5"
      : "border-border/60 bg-card";
  return (
    <div className={`rounded-xl border p-3 ${toneClass}`}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-base font-medium mt-1">{value}</p>
    </div>
  );
}

function FeatureCard({
  to,
  icon,
  title,
  body,
  cta,
}: {
  to: "/community-map" | "/profile-setup" | "/events";
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <Card className="hover:border-gold/40 transition-colors">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground min-h-[3rem]">{body}</p>
        <Button asChild variant="outlineGold" size="sm" className="w-full">
          <Link to={to}>
            {cta} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function StatusPill({ status }: { status: "pending" | "accepted" | "declined" }) {
  const styles =
    status === "pending"
      ? "bg-gold/10 text-gold border-gold/30"
      : status === "accepted"
      ? "bg-green-500/10 text-green-600 border-green-500/30"
      : "bg-muted text-muted-foreground border-border";
  return (
    <span className={`text-[10px] uppercase tracking-wide rounded-full border px-2 py-0.5 ${styles}`}>
      {status}
    </span>
  );
}

import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Search, Shield, Calendar, Sparkles, Star, MapPin, Users, Clock, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { isProfileComplete, useCurrentUser } from "@/lib/session-mock";
import { DiscoverMap, type MapMarker } from "@/components/discover/map-mock";
import { listSafeSpaces, useSafeSpacesStore } from "@/lib/safe-spaces-mock";
import { DISCOVER_EVENTS, DISCOVER_PEOPLE, spacesById } from "@/lib/discover-mock";

export const Route = createFileRoute("/discover/")({
  head: () => ({
    meta: [
      { title: "Discover — Pagu" },
      { name: "description", content: "Trusted spaces, events and community members near you." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DiscoverPage,
});

type FilterKey = "events" | "spaces" | "people";

function DiscoverPage() {
  useSafeSpacesStore();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<FilterKey, boolean>>({
    events: true,
    spaces: true,
    people: true,
  });
  const [selected, setSelected] = useState<MapMarker | null>(null);

  useEffect(() => {
    if (user && !isProfileComplete(user)) {
      navigate({ to: "/profile" });
    }
  }, [navigate, user]);

  const spaces = listSafeSpaces();
  const matchesQ = (s: string) => !q.trim() || s.toLowerCase().includes(q.trim().toLowerCase());
  const shownSpaces = filters.spaces ? spaces.filter((s) => matchesQ(s.name) || matchesQ(s.category)) : [];
  const shownEvents = filters.events ? DISCOVER_EVENTS.filter((e) => matchesQ(e.title) || matchesQ(e.location)) : [];
  const shownPeople = filters.people ? DISCOVER_PEOPLE.filter((p) => matchesQ(p.name) || matchesQ(p.bio)) : [];

  const markers: MapMarker[] = useMemo(() => {
    return [
      ...shownSpaces.map<MapMarker>((s) => ({ id: `space:${s.id}`, kind: "space", label: s.name, x: s.mapX, y: s.mapY })),
      ...shownEvents.map<MapMarker>((e) => ({ id: `event:${e.id}`, kind: "event", label: e.title, x: e.mapX, y: e.mapY })),
      ...shownPeople.map<MapMarker>((p) => ({ id: `person:${p.userId}`, kind: "person", label: p.name, x: p.mapX, y: p.mapY })),
    ];
  }, [shownSpaces, shownEvents, shownPeople]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-5 py-24 text-center">
          <h1 className="font-display text-3xl text-foreground">Discover is for members</h1>
          <p className="mt-3 text-muted-foreground">Log in to see trusted spaces, events and people near you.</p>
          <Button asChild variant="hero" size="lg" className="mt-6">
            <Link to="/login">Log in</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isProfileComplete(user)) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-5 py-24 text-center">
          <h1 className="font-display text-3xl text-foreground">Complete your profile first</h1>
          <p className="mt-3 text-muted-foreground">
            This is the next step before you enter Discover and the rest of the member experience.
          </p>
          <Button asChild variant="hero" size="lg" className="mt-6">
            <Link to="/profile">Continue to profile</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  function toggleFilter(k: FilterKey) {
    setFilters((f) => ({ ...f, [k]: !f[k] }));
  }
  function setAll() {
    setFilters({ events: true, spaces: true, people: true });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground">Discover</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Trusted spaces, events and community near you.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search places, events, or community..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 h-11 rounded-full bg-card"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <Chip active={filters.events && filters.spaces && filters.people} onClick={setAll} label="All" />
          <Chip active={filters.events} onClick={() => toggleFilter("events")} icon={<Calendar className="h-3.5 w-3.5" />} label="Events" />
          <Chip active={filters.spaces} onClick={() => toggleFilter("spaces")} icon={<Shield className="h-3.5 w-3.5" />} label="Safe Spaces" />
          <Chip active={filters.people} onClick={() => toggleFilter("people")} icon={<Sparkles className="h-3.5 w-3.5" />} label="Available Now" />
        </div>

        {/* Map */}
        <DiscoverMap markers={markers} onSelect={setSelected} selectedId={selected?.id} />

        {/* Available Now status banner */}
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-foreground">Available Now</p>
                <p className="text-xs text-muted-foreground">28 min left · 1km radius · ☕ 🌈</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate({ to: "/rhrn" })}>
              <EyeOff className="h-3.5 w-3.5" /> Go invisible
            </Button>
          </CardContent>
        </Card>

        {/* Lists */}
        <Section title="Nearby Events" empty="No events nearby yet — be the first to start one." show={filters.events}>
          {shownEvents.map((e) => {
            const venue = e.safeSpaceId ? spacesById(e.safeSpaceId) : undefined;
            return (
              <Card key={e.id} className="hover:shadow-soft transition-shadow">
                <CardContent className="p-4 flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-foreground truncate">{e.title}</h3>
                      {e.official ? (
                        <Badge className="bg-gold text-gold-foreground hover:bg-gold">✨ Official Pagu Event</Badge>
                      ) : (
                        <Badge variant="secondary">👥 Community Event</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(e.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {e.time} · {e.attendees} going
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {venue ? (
                        <>
                          <Link to="/discover/safe-space/$id" params={{ id: venue.id }} className="underline-offset-2 hover:underline">
                            {venue.name}
                          </Link>
                          <span className="ml-1 text-gold">🛡️ Hosted at a Pagu Safe Space</span>
                        </>
                      ) : (
                        e.location
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </Section>

        <Section title="Nearby Safe Spaces" empty="No Safe Spaces found." show={filters.spaces}>
          {shownSpaces.map((s) => (
            <Link key={s.id} to="/discover/safe-space/$id" params={{ id: s.id }}>
              <Card className="hover:shadow-soft transition-shadow">
                <CardContent className="p-4 flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-foreground truncate">{s.name}</h3>
                      <Badge variant="outline" className="border-gold/40 text-gold">🛡️ Pagu Safe Space</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{s.category} · ⭐ {s.rating} ({s.reviewsCount})</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> {s.hours}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Section>

        <Section title="Available Now" empty="Nobody is available right now — check back soon." show={filters.people}>
          {shownPeople.map((p) => (
            <Card key={p.userId}>
              <CardContent className="p-4 flex gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 font-medium">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-foreground truncate">{p.name}</h3>
                    {p.organizer && <Badge variant="outline" className="border-gold/40 text-gold">Organizer</Badge>}
                    <span className="text-xs text-muted-foreground">· {formatDistance(p.distanceMeters)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{p.bio}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.intentions.map((i) => (
                      <span key={i.label} className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                        {i.emoji} {i.label}
                      </span>
                    ))}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="self-center" onClick={() => navigate({ to: "/rhrn" })}>
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </Section>
      </main>

      {/* Bottom sheet for marker details */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          {selected && <MarkerDetails marker={selected} onClose={() => setSelected(null)} />}
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
}

function Chip({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm border transition-colors",
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-card text-muted-foreground border-border hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Section({ title, children, empty, show }: { title: string; children: React.ReactNode; empty: string; show: boolean }) {
  if (!show) return null;
  const hasContent = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl text-foreground">{title}</h2>
      {hasContent ? (
        <div className="grid gap-3">{children}</div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">{empty}</CardContent>
        </Card>
      )}
    </section>
  );
}

function MarkerDetails({ marker, onClose }: { marker: MapMarker; onClose: () => void }) {
  const [, kind, id] = marker.id.match(/^(space|event|person):(.+)$/) ?? [];
  if (kind === "space") {
    const s = listSafeSpaces().find((x) => x.id === id);
    if (!s) return null;
    return (
      <>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gold" /> {s.name}
          </SheetTitle>
          <SheetDescription>{s.category} · ⭐ {s.rating} ({s.reviewsCount} reviews)</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-2 text-sm">
          <p className="text-muted-foreground">{s.description}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {s.hours}</p>
          <Badge variant="outline" className="border-gold/40 text-gold">🛡️ Certified since {s.certifiedSince}</Badge>
        </div>
        <Button asChild className="mt-5 w-full" variant="hero">
          <Link to="/discover/safe-space/$id" params={{ id: s.id }} onClick={onClose}>Open profile</Link>
        </Button>
      </>
    );
  }
  if (kind === "event") {
    const e = DISCOVER_EVENTS.find((x) => x.id === id);
    if (!e) return null;
    const v = e.safeSpaceId ? spacesById(e.safeSpaceId) : undefined;
    return (
      <>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" /> {e.title}
          </SheetTitle>
          <SheetDescription>
            {new Date(e.date).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} · {e.time}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex flex-wrap gap-2">
            {e.official ? (
              <Badge className="bg-gold text-gold-foreground hover:bg-gold">✨ Official Pagu Event</Badge>
            ) : (
              <Badge variant="secondary">👥 Community Event</Badge>
            )}
            <Badge variant="outline">{e.category}</Badge>
            <Badge variant="outline"><Users className="h-3 w-3 mr-1" /> {e.attendees}</Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {v ? `${v.name} · 🛡️ Pagu Safe Space` : e.location}
          </p>
        </div>
        {v && (
          <Button asChild variant="outline" className="mt-5 w-full">
            <Link to="/discover/safe-space/$id" params={{ id: v.id }} onClick={onClose}>View venue</Link>
          </Button>
        )}
      </>
    );
  }
  if (kind === "person") {
    const p = DISCOVER_PEOPLE.find((x) => x.userId === id);
    if (!p) return null;
    return (
      <>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {p.name}
          </SheetTitle>
          <SheetDescription>
            {formatDistance(p.distanceMeters)} · Community member since {new Date(p.memberSince).getFullYear()}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-muted-foreground">{p.bio}</p>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Interests</p>
            <div className="flex flex-wrap gap-1">{p.interests.map((i) => <Badge key={i} variant="outline">{i}</Badge>)}</div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Languages</p>
            <div className="flex flex-wrap gap-1">{p.languages.map((l) => <Badge key={l} variant="secondary">{l}</Badge>)}</div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Looking for</p>
            <div className="flex flex-wrap gap-1">
              {p.intentions.map((i) => <Badge key={i.label} variant="outline">{i.emoji} {i.label}</Badge>)}
            </div>
          </div>
          {p.organizer && <Badge variant="outline" className="border-gold/40 text-gold">Organizer</Badge>}
        </div>
        <Button asChild className="mt-5 w-full" variant="hero">
          <Link to="/rhrn" onClick={onClose}>Send icebreaker</Link>
        </Button>
      </>
    );
  }
  return null;
}

function formatDistance(m: number) {
  return m < 1000 ? `${m}m` : `${(m / 1000).toFixed(1)}km`;
}

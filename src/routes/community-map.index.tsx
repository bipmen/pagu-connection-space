import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Search, Shield, Calendar, Sparkles, MapPin, Clock, Users, ChevronDown, ArrowRight } from "lucide-react";
import { useCurrentUser } from "@/lib/session-mock";
import { useMySession } from "@/lib/rhrn-mock";
import { useSafeSpacesStore, listSafeSpaces } from "@/lib/safe-spaces-mock";
import { DISCOVER_EVENTS, DISCOVER_PEOPLE, spacesById } from "@/lib/discover-mock";
import {
  CITIES,
  DEFAULT_CITY,
  buildMarkers,
  summarizeCity,
  formatDistance,
  type CommunityFilter,
  type CommunityMarker,
} from "@/lib/community-map-mock";
import { CitySummaryCard } from "@/components/community-map/CitySummaryCard";
import { CategoryFilters } from "@/components/community-map/CategoryFilters";
import { EmptyCityState } from "@/components/community-map/EmptyCityState";
import { CommunityMap } from "@/components/community-map/CommunityMap";
import { MarkerBottomSheet } from "@/components/community-map/MarkerBottomSheet";
import { MyAvailabilityPanel } from "@/components/community-map/MyAvailabilityPanel";
import { GoInvisibleFab } from "@/components/rhrn/invisible-button";

export const Route = createFileRoute("/community-map/")({
  head: () => ({
    meta: [
      { title: "Community Map — Pagu" },
      { name: "description", content: "Discover events, Safe Spaces and FLINTA community members near you." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CommunityMapPage,
});

function CommunityMapPage() {
  useSafeSpacesStore();
  const user = useCurrentUser();
  const mySession = useMySession(user?.id);
  const isAvailable = !!mySession && mySession.expiresAt > Date.now();

  const [city, setCity] = useState(DEFAULT_CITY.name);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CommunityFilter>("community");
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<CommunityMarker | null>(null);

  // If user goes invisible while viewing People, snap back to Community
  useEffect(() => {
    if (!isAvailable && filter === "people") setFilter("community");
  }, [isAvailable, filter]);

  const summary = summarizeCity(city);
  const markers = useMemo(
    () => buildMarkers({ filter, availableNowOnly: false, city, query, zoom, hidePeople: !isAvailable }),
    [filter, city, query, zoom, isAvailable],
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-md mx-auto px-5 py-24 text-center">
          <h1 className="font-display text-3xl text-foreground">The Community Map is for members</h1>
          <p className="mt-3 text-muted-foreground">Log in to discover events, Safe Spaces and people open to connect.</p>
          <Button asChild variant="hero" size="lg" className="mt-6">
            <Link to="/login">Log in</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground">Community Map</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Where the community gathers — activities, places and people, all in one map.
          </p>
        </div>

        {/* City search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities, places or people..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-11 rounded-full bg-card"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 rounded-full gap-1">
                <MapPin className="h-4 w-4 text-gold" /> {city} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {CITIES.map((c) => (
                <DropdownMenuItem key={c.id} onClick={() => setCity(c.name)}>
                  {c.name} <span className="ml-2 text-xs text-muted-foreground">{c.country}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CitySummaryCard city={city} summary={summary} />

        <MyAvailabilityPanel />

        <CategoryFilters value={filter} onChange={setFilter} />

        {summary.total === 0 ? (
          <EmptyCityState city={city} />
        ) : (
          <>
            <CommunityMap
              markers={markers}
              selectedId={selected?.id}
              onSelect={setSelected}
              zoom={zoom}
              onZoomChange={setZoom}
              cityLabel={city}
            />

            <ResultsList filter={filter} query={query} />
          </>
        )}
      </main>

      <MarkerBottomSheet marker={selected} onClose={() => setSelected(null)} />

      <GoInvisibleFab />

      <Footer />
    </div>
  );
}

function ResultsList({
  filter,
  query,
}: {
  filter: CommunityFilter;
  query: string;
}) {
  const navigate = useNavigate();
  const matches = (s: string) => !query.trim() || s.toLowerCase().includes(query.trim().toLowerCase());

  const showPlaces = filter === "community" || filter === "places";
  const showActivities = filter === "community" || filter === "activities";
  const showPeople = filter === "community" || filter === "people";

  const spaces = listSafeSpaces().filter((s) => matches(s.name) || matches(s.category));
  const events = DISCOVER_EVENTS.filter((e) => matches(e.title) || matches(e.location));
  const people = DISCOVER_PEOPLE.filter((p) => matches(p.name) || matches(p.bio));

  return (
    <div className="space-y-6">
      {showActivities && (
        <Section title="Activities" empty="No events match your search.">
          {events.map((e) => {
            const venue = e.safeSpaceId ? spacesById(e.safeSpaceId) : undefined;
            return (
              <Card key={e.id} className="hover:shadow-soft transition-shadow cursor-pointer" onClick={() => navigate({ to: "/community-events/$id", params: { id: e.id } })}>
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
                          <span>{venue.name}</span>
                          <span className="ml-1 text-gold">🛡️ Hosted at a Pagu Safe Space</span>
                        </>
                      ) : (
                        e.location
                      )}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground self-center" />
                </CardContent>
              </Card>
            );
          })}
        </Section>
      )}

      {showPlaces && (
        <Section title="Places" empty="No Safe Spaces found.">
          {spaces.map((s) => (
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
                    <p className="text-xs text-muted-foreground mt-1">{s.category} · ⭐ {s.rating} · {formatDistance(Math.round((Math.abs(s.mapX - 50) + Math.abs(s.mapY - 50)) * 40))} away</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> {s.hours}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground self-center" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </Section>
      )}

      {showPeople && (
        <Section title="People" empty="Nobody is available right now — check back soon.">
          {people.map((p) => (
            <Link key={p.userId} to="/rhrn/$id" params={{ id: p.userId }}>
              <Card className="hover:shadow-soft transition-shadow">
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
                  <ArrowRight className="h-4 w-4 text-muted-foreground self-center" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children, empty }: { title: string; children: React.ReactNode; empty: string }) {
  const hasContent = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-xl text-foreground">{title}</h2>
        {title === "People" && <Sparkles className="h-4 w-4 text-emerald-500" />}
        {title === "Activities" && <Users className="h-4 w-4 text-primary" />}
      </div>
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

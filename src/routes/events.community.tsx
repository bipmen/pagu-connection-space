import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Users,
  Plus,
  Search,
  Compass,
  Lock,
} from "lucide-react";
import { useCurrentUser } from "@/lib/session-mock";
import {
  EVENT_CATEGORIES,
  EVENT_TYPE_LABEL,
  countApprovedAttendees,
  listCities,
  listEvents,
  useEventsStore,
  type EventCategory,
} from "@/lib/events-mock";

export const Route = createFileRoute("/events/community")({
  head: () => ({
    meta: [
      { title: "Community Events — Pagu" },
      {
        name: "description",
        content: "Discover and join FLINTA* community events.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CommunityEventsPage,
});

function CommunityEventsPage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  useEventsStore();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [city, setCity] = useState<string>("all");
  const [date, setDate] = useState<string>("");
  const [aroundMe, setAroundMe] = useState(false);

  const cities = useMemo(() => listCities(), []);
  const events = useMemo(
    () =>
      listEvents({
        q: q || undefined,
        category,
        city,
        date: date || undefined,
        aroundMe: aroundMe && user ? { city: user.city } : null,
      }),
    [q, category, city, date, aroundMe, user],
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md text-center bg-card border border-border/60 rounded-2xl p-8 shadow-soft">
          <Lock className="h-6 w-6 text-gold mx-auto mb-4" />
          <h2 className="font-display text-2xl mb-2">Members only</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Community events are visible to approved Pagu members. Please sign
            in to continue.
          </p>
          <Button asChild variant="hero" size="lg" className="w-full">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold mb-1">
            Member-led
          </p>
          <p className="text-sm text-muted-foreground max-w-xl">
            Brunches, walks, workshops and more — created by Pagu members for
            the community. Join via RSVP, request, or invite.
          </p>
        </div>
        <Button
          variant="hero"
          size="lg"
          className="rounded-full"
          onClick={() => navigate({ to: "/community-events/new" })}
        >
          <Plus className="h-4 w-4 mr-2" /> Create event
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-soft mb-6 space-y-3">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by event title"
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as EventCategory | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {EVENT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={() => setAroundMe((v) => !v)}
          className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-colors ${
            aroundMe
              ? "bg-primary/15 border-primary/40 text-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          Around me ({user.city})
        </button>
      </div>

      {/* List */}
      {events.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No events match these filters yet.
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((e) => {
            const attending = countApprovedAttendees(e.id);
            const remaining = Math.max(0, e.maxAttendees - attending);
            return (
              <li key={e.id}>
                <Link
                  to="/community-events/$id"
                  params={{ id: e.id }}
                  className="block bg-card border border-border/60 rounded-2xl p-5 shadow-soft hover:border-gold/40 transition-colors h-full"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="rounded-full">
                      {e.category}
                    </Badge>
                    <Badge variant="outline" className="rounded-full text-xs">
                      {EVENT_TYPE_LABEL[e.type]}
                    </Badge>
                  </div>
                  <h2 className="font-display text-xl leading-snug mb-2">
                    {e.title}
                  </h2>
                  <div className="text-xs text-muted-foreground space-y-1.5">
                    <p className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(e.date)} · {e.time}
                    </p>
                    <p className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {e.city}
                    </p>
                    <p className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {attending}/{e.maxAttendees} attending · {remaining} spots
                      left
                    </p>
                    <p className="text-muted-foreground/80">
                      Hosted by {e.organizerName}
                    </p>
                  </div>
                  <div className="mt-4 text-sm text-gold font-medium">
                    View event →
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

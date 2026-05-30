import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  MapPin,
  Sparkles,
  Handshake,
  Star,
  ArrowRight,
} from "lucide-react";
import {
  LOCAL_EVENT_BADGE_LABEL,
  LOCAL_EVENT_CTA_LABEL,
  getFeaturedLocalEvents,
  getMoreLocalEvents,
  getPartnerLocalEvents,
  getRecentlyPostedLocalEvents,
  listLocalCities,
  type LocalEvent,
  type LocalEventBadge,
} from "@/lib/local-events-mock";

export const Route = createFileRoute("/events/local")({
  head: () => ({
    meta: [
      { title: "Local Events — Pagu" },
      {
        name: "description",
        content:
          "A curated selection of FLINTA*-friendly events in your city, picked by Pagu and our local partners.",
      },
    ],
  }),
  component: LocalEventsPage,
});

function LocalEventsPage() {
  const [city, setCity] = useState<string>("all");
  const cities = useMemo(() => listLocalCities(), []);

  const featured = useMemo(
    () => filterCity(getFeaturedLocalEvents(), city),
    [city],
  );
  const partners = useMemo(
    () => filterCity(getPartnerLocalEvents(), city),
    [city],
  );
  const more = useMemo(() => filterCity(getMoreLocalEvents(), city), [city]);
  const recent = useMemo(
    () => filterCity(getRecentlyPostedLocalEvents(6), city),
    [city],
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold mb-1">
            Curated by Pagu
          </p>
          <p className="text-sm text-foreground/80 max-w-2xl">
            Hand-picked things to do — Pagu Picks, partner events, and local
            highlights we love.
          </p>
        </div>
        <div className="sm:ml-auto flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            City
          </span>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue />
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
        </div>
      </div>

      <Section
        eyebrow="Featured by Pagu"
        icon={<Sparkles className="h-4 w-4" />}
        title="Pagu Picks this week"
        subtitle="Events we're hosting or personally vouching for."
      >
        {featured.length === 0 ? (
          <EmptyRow label="No Pagu Picks in this city right now." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((e) => (
              <FeaturedCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </Section>

      <Section
        eyebrow="Partner events"
        icon={<Handshake className="h-4 w-4" />}
        title="From the people we work with"
        subtitle="Studios, venues, and collectives Pagu trusts."
      >
        {partners.length === 0 ? (
          <EmptyRow label="No partner events in this city right now." />
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((e) => (
              <li key={e.id}>
                <LocalEventCard event={e} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        eyebrow="Just added"
        icon={<Star className="h-4 w-4" />}
        title="Recently posted"
        subtitle="Fresh additions from across the city."
      >
        {recent.length === 0 ? (
          <EmptyRow label="Nothing new in this city — check back soon." />
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((e) => (
              <li key={e.id}>
                <LocalEventCard event={e} compact />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        eyebrow="More to explore"
        icon={<MapPin className="h-4 w-4" />}
        title="Other local events"
        subtitle="Independent picks worth your evening."
      >
        {more.length === 0 ? (
          <EmptyRow label="Nothing else in this city for now." />
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {more.map((e) => (
              <li key={e.id}>
                <LocalEventCard event={e} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}

function filterCity(list: LocalEvent[], city: string) {
  if (city === "all") return list;
  return list.filter((e) => e.city === city);
}

function Section({
  eyebrow,
  icon,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-5">
        <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-gold mb-2">
          {icon}
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl md:text-3xl leading-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground text-center">
      {label}
    </div>
  );
}

function BadgePill({ kind }: { kind: LocalEventBadge }) {
  const styles: Record<LocalEventBadge, string> = {
    "pagu-pick": "bg-gold/15 text-gold border-gold/30",
    partner: "bg-primary/15 text-foreground border-primary/30",
    "local-highlight": "bg-accent/30 text-foreground border-border/60",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded-full border ${styles[kind]}`}
    >
      {kind === "pagu-pick" ? <Sparkles className="h-3 w-3" /> : null}
      {LOCAL_EVENT_BADGE_LABEL[kind]}
    </span>
  );
}

function CtaButton({ event }: { event: LocalEvent }) {
  return (
    <span
      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-gold text-gold-foreground text-sm font-semibold px-5 py-2.5 shadow-soft group-hover:brightness-110 group-active:scale-[0.98] transition"
      aria-hidden="true"
    >
      {LOCAL_EVENT_CTA_LABEL[event.ctaType]}
      <ArrowRight className="h-4 w-4" />
    </span>
  );
}

function FeaturedCard({ event }: { event: LocalEvent }) {
  return (
    <Link
      to="/event/$slug"
      params={{ slug: event.slug }}
      aria-label={`${event.title} — ${LOCAL_EVENT_CTA_LABEL[event.ctaType]}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-2xl"
    >
      <article className="relative overflow-hidden rounded-2xl border border-gold/30 bg-card shadow-soft p-6 flex flex-col justify-between min-h-[260px] hover:border-gold transition-colors">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-gold" />
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BadgePill kind={event.badge} />
            <Badge variant="secondary" className="rounded-full text-[10px]">
              {event.category}
            </Badge>
          </div>
          <h3 className="font-display text-2xl leading-snug mb-2">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {event.description}
          </p>
          <div className="text-xs text-muted-foreground space-y-1.5">
            <p className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(event.date)} · {event.time}
            </p>
            <p className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {event.venue} · {event.city}
            </p>
            <p className="text-muted-foreground/80">By {event.organizer}</p>
          </div>
        </div>
        <div className="mt-5">
          <CtaButton event={event} />
        </div>
      </article>
    </Link>
  );
}

function LocalEventCard({
  event,
  compact = false,
}: {
  event: LocalEvent;
  compact?: boolean;
}) {
  return (
    <Link
      to="/event/$slug"
      params={{ slug: event.slug }}
      aria-label={`${event.title} — ${LOCAL_EVENT_CTA_LABEL[event.ctaType]}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-2xl"
    >
      <article className="bg-card border border-border/60 rounded-2xl p-5 shadow-soft group-hover:border-gold/60 group-hover:shadow-lg transition h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <BadgePill kind={event.badge} />
          <Badge variant="outline" className="rounded-full text-[10px]">
            {event.category}
          </Badge>
        </div>
        <h3 className="font-display text-lg leading-snug mb-1.5">
          {event.title}
        </h3>
        {!compact ? (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {event.description}
          </p>
        ) : null}
        <div className="text-xs text-muted-foreground space-y-1 mb-4">
          <p className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(event.date)} · {event.time}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {event.venue} · {event.city}
          </p>
          <p className="text-muted-foreground/80">By {event.organizer}</p>
        </div>
        <div className="mt-auto">
          <CtaButton event={event} />
        </div>
      </article>
    </Link>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

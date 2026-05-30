import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import {
  LOCAL_EVENT_BADGE_LABEL,
  LOCAL_EVENT_CTA_LABEL,
  getLocalEventBySlug,
  type LocalEvent,
} from "@/lib/local-events-mock";

export const Route = createFileRoute("/event/$slug")({
  loader: ({ params }) => {
    const event = getLocalEventBySlug(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.event.title} — Pagu` },
          { name: "description", content: loaderData.event.description },
          {
            property: "og:title",
            content: `${loaderData.event.title} — Pagu`,
          },
          { property: "og:description", content: loaderData.event.description },
        ]
      : [{ title: "Event — Pagu" }],
  }),
  notFoundComponent: NotFound,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 py-16 text-center">
        <h1 className="font-display text-3xl mb-3">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">{String(error)}</p>
      </main>
      <Footer />
    </div>
  ),
  component: EventDetailPage,
});

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gold mb-2">
          Event not found
        </p>
        <h1 className="font-display text-3xl mb-3">
          We couldn't find this event
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          It may have ended or the link may be wrong.
        </p>
        <Link
          to="/events/local"
          className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to local events
        </Link>
      </main>
      <Footer />
    </div>
  );
}

function EventDetailPage() {
  const { event } = Route.useLoaderData() as { event: LocalEvent };
  const ctaLabel = LOCAL_EVENT_CTA_LABEL[event.ctaType];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30 mix-blend-screen"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--gold) 40%, transparent), transparent 55%), radial-gradient(circle at 80% 30%, color-mix(in oklab, var(--primary) 50%, transparent), transparent 60%)",
            }}
          />
          <div className="relative max-w-4xl mx-auto px-5 lg:px-8 pt-8 pb-12 md:pt-12 md:pb-16">
            <Link
              to="/events/local"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Local events
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                variant="secondary"
                className="rounded-full bg-gold/15 text-gold border border-gold/30"
              >
                {LOCAL_EVENT_BADGE_LABEL[event.badge]}
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {event.category}
              </Badge>
            </div>

            <h1 className="font-display text-3xl md:text-5xl leading-tight max-w-3xl">
              {event.title}
            </h1>

            {/* Event image placeholder */}
            <div className="mt-8 aspect-[16/9] w-full rounded-3xl border border-border/60 bg-card/60 shadow-soft flex items-center justify-center relative overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, color-mix(in oklab, var(--primary) 25%, transparent), color-mix(in oklab, var(--gold) 25%, transparent))",
                }}
              />
              <span className="relative text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Event image
              </span>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10 md:py-14 grid gap-8 md:grid-cols-3">
          {/* Event Information */}
          <aside className="md:col-span-1 space-y-6">
            <Block title="Event information">
              <Detail
                icon={<CalendarDays className="h-4 w-4" />}
                label="Date"
                value={formatDate(event.date)}
              />
              <Detail
                icon={<Clock className="h-4 w-4" />}
                label="Time"
                value={event.time}
              />
              <Detail
                icon={<MapPin className="h-4 w-4" />}
                label="City"
                value={event.city}
              />
              <Detail
                icon={<MapPin className="h-4 w-4" />}
                label="Venue"
                value={event.venue}
              />
              <Detail
                icon={<Users className="h-4 w-4" />}
                label="Organizer"
                value={event.organizer}
              />
            </Block>

            <Block title="Community">
              <Detail
                icon={<Users className="h-4 w-4" />}
                label="Attendees"
                value={`${event.attendees} attending`}
              />
              <Detail
                icon={<Sparkle />}
                label="Event type"
                value={event.eventType}
              />
            </Block>

            {event.hostedAtSafeSpace ? (
              <div className="rounded-2xl border border-gold/40 bg-gold/5 p-5">
                <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold font-semibold mb-2">
                  <Shield className="h-3.5 w-3.5" /> Pagu Safe Space
                </p>
                <p className="font-display text-lg leading-snug">
                  🛡️ Hosted at a Pagu Safe Space
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.venue}
                </p>
                <Badge className="mt-3 rounded-full bg-gold text-gold-foreground hover:bg-gold">
                  Safe Space certified
                </Badge>
              </div>
            ) : null}
          </aside>

          {/* Description */}
          <article className="md:col-span-2">
            <h2 className="font-display text-2xl md:text-3xl mb-4">
              About this event
            </h2>
            <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
            <p className="text-base text-foreground/80 leading-relaxed mt-4">
              Expect a welcoming, intentional crowd. Pagu events are built
              around respect, consent, and showing up as you are. Doors open a
              few minutes before the start time — arrive when you can, leave
              when you need to.
            </p>

            {/* CTA */}
            <div className="mt-10 rounded-3xl border border-gold/30 bg-card p-6 md:p-8 shadow-soft flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gold mb-1">
                  Ready to join?
                </p>
                <p className="font-display text-xl leading-snug">
                  {ctaLabel} for {event.title}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Booking opens soon — this is a preview.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-gold text-gold-foreground text-sm font-semibold px-6 py-3 shadow-soft hover:brightness-110 active:scale-[0.98] transition"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gold">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-sm text-foreground/90 break-words">{value}</p>
      </div>
    </div>
  );
}

function Sparkle() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6" strokeLinecap="round" />
    </svg>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

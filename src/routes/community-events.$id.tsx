import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Users,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/lib/session-mock";
import {
  EVENT_TYPE_LABEL,
  applyToEvent,
  countApprovedAttendees,
  getEvent,
  getUserApplication,
  useEventsStore,
} from "@/lib/events-mock";

export const Route = createFileRoute("/community-events/$id")({
  head: () => ({
    meta: [
      { title: "Event — Pagu" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EventDetail,
});

function EventDetail() {
  const { id } = Route.useParams();
  const user = useCurrentUser();
  const navigate = useNavigate();
  useEventsStore();

  const event = getEvent(id);

  if (!user) {
    return (
      <Shell>
        <div className="max-w-md mx-auto text-center bg-card border border-border/60 rounded-2xl p-8 shadow-soft">
          <Lock className="h-6 w-6 text-gold mx-auto mb-4" />
          <h1 className="font-display text-2xl mb-2">Members only</h1>
          <p className="text-sm text-muted-foreground mb-6">Please sign in to view this event.</p>
          <Button asChild variant="hero" size="lg" className="w-full">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </Shell>
    );
  }

  if (!event) {
    return (
      <Shell>
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-display text-2xl mb-2">Event not found</h1>
          <Button asChild variant="hero">
            <Link to="/community-events">Back to events</Link>
          </Button>
        </div>
      </Shell>
    );
  }

  const attending = countApprovedAttendees(event.id);
  const remaining = Math.max(0, event.maxAttendees - attending);
  const existing = getUserApplication(event.id, user.id);
  const isOrganizer = event.organizerId === user.id;

  return (
    <Shell>
      <button
        onClick={() => navigate({ to: "/community-events" })}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All events
      </button>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header card */}
        <section className="bg-card border border-border/60 rounded-2xl p-6 shadow-soft">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="rounded-full">{event.category}</Badge>
            <Badge variant="outline" className="rounded-full text-xs">{EVENT_TYPE_LABEL[event.type]}</Badge>
          </div>
          <h1 className="font-display text-3xl md:text-4xl mb-4">{event.title}</h1>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <p className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gold" />
              {formatDate(event.date)} · {event.time}
            </p>
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" /> {event.city} — {event.location}
            </p>
            <p className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" />
              {attending} attending · {remaining} spots left
            </p>
          </div>
        </section>

        {/* Description */}
        <section className="bg-card border border-border/60 rounded-2xl p-6 shadow-soft">
          <h2 className="font-display text-lg mb-3">About</h2>
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </section>

        {/* Organizer */}
        <section className="bg-card border border-border/60 rounded-2xl p-6 shadow-soft">
          <h2 className="font-display text-lg mb-3">Organizer</h2>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-purple flex items-center justify-center text-white font-display text-lg">
              {event.organizerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{event.organizerName}</p>
              <p className="text-xs text-muted-foreground">{event.city}</p>
            </div>
          </div>
        </section>

        {/* Community guidelines */}
        <div className="flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4">
          <ShieldCheck className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            This is a community-centered FLINTA* event.{" "}
            <strong className="text-foreground">Respect, consent, and inclusion are expected.</strong>
          </p>
        </div>

        {/* Apply / status */}
        <section className="bg-card border border-border/60 rounded-2xl p-6 shadow-soft">
          {isOrganizer ? (
            <p className="text-sm text-muted-foreground">You're hosting this event.</p>
          ) : existing ? (
            <ApplicationStatusCard status={existing.status} />
          ) : event.type === "invite" ? (
            <p className="text-sm text-muted-foreground">
              This event is invite-only. The organizer will reach out if a spot opens.
            </p>
          ) : (
            <ApplyForm event={event} user={user} />
          )}
        </section>
      </div>
    </Shell>
  );
}

function ApplyForm({
  event,
  user,
}: {
  event: ReturnType<typeof getEvent> & object;
  user: { id: string; name: string };
}) {
  const [answers, setAnswers] = useState<string[]>(
    event.questions.map(() => ""),
  );
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (answers.some((a) => a.trim().length === 0)) {
      toast.error("Please answer every question.");
      return;
    }
    setSubmitting(true);
    const app = applyToEvent({
      eventId: event.id,
      userId: user.id,
      userName: user.name,
      answers: event.questions.map((q, i) => ({ question: q, answer: answers[i].trim() })),
    });
    setSubmitting(false);
    if (app.status === "approved") {
      toast.success("You're in! See you at the event.");
    } else if (app.status === "waitlist") {
      toast.message("Event is full — you've been added to the waitlist.");
    } else {
      toast.success("Application sent. The organizer will review it shortly.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="font-display text-lg mb-1">Apply to join</h2>
        <p className="text-xs text-muted-foreground">
          A few questions from the organizer to keep this space intentional.
        </p>
      </div>
      {event.questions.map((q, i) => (
        <div key={i}>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">
            {q}
          </label>
          <Textarea
            value={answers[i]}
            onChange={(e) => {
              const next = [...answers];
              next[i] = e.target.value;
              setAnswers(next);
            }}
            rows={3}
            className="mt-2"
            placeholder="Your answer"
            maxLength={500}
            required
          />
        </div>
      ))}
      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
        Submit application
      </Button>
    </form>
  );
}

function ApplicationStatusCard({ status }: { status: string }) {
  const map: Record<string, { icon: React.ReactNode; title: string; body: string }> = {
    pending: {
      icon: <Clock className="h-5 w-5 text-gold" />,
      title: "Application pending",
      body: "The organizer will review your answers and get back to you soon.",
    },
    approved: {
      icon: <CheckCircle2 className="h-5 w-5 text-gold" />,
      title: "You're in",
      body: "Your spot is confirmed. See you there.",
    },
    rejected: {
      icon: <ShieldCheck className="h-5 w-5 text-destructive" />,
      title: "Not this time",
      body: "The organizer wasn't able to offer you a spot for this event.",
    },
    waitlist: {
      icon: <Clock className="h-5 w-5 text-gold" />,
      title: "On the waitlist",
      body: "Event is full. If a spot frees up, the organizer can promote you.",
    },
  };
  const s = map[status] ?? map.pending;
  return (
    <div className="flex items-start gap-3">
      {s.icon}
      <div>
        <p className="font-medium">{s.title}</p>
        <p className="text-sm text-muted-foreground mt-1">{s.body}</p>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-5 lg:px-8 py-10 w-full">{children}</main>
      <Footer />
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

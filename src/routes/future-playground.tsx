import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  ChevronDown,
  Compass,
  Heart,
  MapPin,
  Quote,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/future-playground")({
  head: () => ({
    meta: [
      { title: "Future Playground — Pagu Theme Preview" },
      {
        name: "description",
        content:
          "Internal preview of the Future Playground visual direction applied across the Pagu landing experience.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FuturePlaygroundPreview,
});

function FuturePlaygroundPreview() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="theme-future flex-1">
        <PreviewBanner />
        <FPHero />
        <FPMarquee />
        <FPWhyJoin />
        <FPStories />
        <FPCommunityMap />
        <FPEvents />
        <FPSafeSpaces />
        <FPMailing />
      </main>
      <Footer />
    </div>
  );
}

function PreviewBanner() {
  return (
    <div className="border-b border-gold/30 bg-gold/10 text-gold-foreground/90">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-3 flex items-center gap-3 text-xs sm:text-sm">
        <span className="fp-sticker">Theme Preview</span>
        <p className="text-foreground/80">
          Future Playground visual direction · production UI is untouched.
        </p>
        <Link
          to="/"
          className="ml-auto underline underline-offset-4 text-foreground/70 hover:text-foreground"
        >
          Back to current site
        </Link>
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */

const HERO_SLIDES = [
  {
    eyebrow: "A FLINTA*-led collective",
    title: ["Connection", "beyond", "algorithms."],
    body: "Pagu is a living community universe in Cologne — curated gatherings, safe spaces, and people you actually want to meet.",
    cta: "Become part of Pagu",
    chip: "Cologne · est. 2024",
  },
  {
    eyebrow: "Curated, never sorted",
    title: ["Real rooms.", "Real people.", "Real moments."],
    body: "Every event is hand-picked. Every space is community-approved. No infinite scroll. No engagement bait.",
    cta: "See what's happening",
    chip: "Community-curated",
  },
  {
    eyebrow: "Safety as a design choice",
    title: ["Built with care,", "by the people", "who show up."],
    body: "Consent-first guidelines, Pagu Safe Spaces, and a community that takes responsibility for one another.",
    cta: "Read the guidelines",
    chip: "🛡️ Pagu Safe Space",
  },
];

function FPHero() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearTimeout(t);
  }, [slide]);

  const s = HERO_SLIDES[slide];

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="fp-blob fp-blob-purple h-[520px] w-[520px] -top-40 -left-32" />
      <div className="fp-blob fp-blob-gold h-[420px] w-[420px] top-20 -right-24" />
      <div className="fp-blob fp-blob-cyan h-[360px] w-[360px] bottom-0 left-1/3" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-20 pb-28 md:pt-32 md:pb-36">
        <div className="flex items-center gap-3 mb-8 fp-rise">
          <span className="fp-sticker">{s.chip}</span>
          <span className="fp-eyebrow">{s.eyebrow}</span>
        </div>

        <h1 key={slide} className="fp-rise text-balance">
          {s.title.map((line, i) => (
            <span
              key={i}
              className="block"
              style={{
                color: i === 1 ? "var(--color-gold)" : undefined,
                fontStyle: i === 2 ? "italic" : undefined,
                animationDelay: `${i * 80}ms`,
              }}
            >
              {line}
            </span>
          ))}
        </h1>

        <p
          key={`p-${slide}`}
          className="fp-rise mt-8 max-w-xl text-lg md:text-xl text-muted-foreground"
          style={{ animationDelay: "180ms" }}
        >
          {s.body}
        </p>

        <div
          className="fp-rise mt-10 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "260ms" }}
        >
          <button className="fp-cta">
            {s.cta} <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            to="/community-map"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border/60 hover:border-gold/60 hover:text-gold transition"
          >
            Explore the map <Compass className="h-4 w-4" />
          </Link>
        </div>

        {/* Carousel controls */}
        <div className="mt-14 flex items-center gap-4">
          <button
            onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="h-11 w-11 rounded-full border border-border/60 grid place-items-center hover:bg-card"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group h-2 w-10 rounded-full bg-border/60 overflow-hidden"
              >
                <span
                  className="block h-full bg-gold transition-all"
                  style={{ width: i === slide ? "100%" : "0%" }}
                />
              </button>
            ))}
          </div>
          <button
            onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
            className="h-11 w-11 rounded-full border border-border/60 grid place-items-center hover:bg-card"
            aria-label="Next slide"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <ChevronDown className="h-4 w-4 animate-bounce" />
            Scroll the universe
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Marquee strip ---------- */

function FPMarquee() {
  const words = [
    "FLINTA*",
    "Cologne",
    "Curated",
    "Consent-first",
    "Safe Spaces",
    "Community-led",
    "Beyond algorithms",
    "🌈",
    "🛡️",
    "✨",
  ];
  const loop = [...words, ...words];
  return (
    <div className="overflow-hidden border-y border-border/40 bg-card/40 py-5">
      <div className="fp-marquee text-2xl md:text-3xl font-display tracking-tight">
        {loop.map((w, i) => (
          <span key={i} className="flex items-center gap-12">
            <span style={{ color: i % 3 === 0 ? "var(--color-gold)" : undefined }}>{w}</span>
            <span className="text-muted-foreground">✺</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Why join ---------- */

const BENEFITS = [
  {
    icon: Users,
    title: "Find your people",
    desc: "Connect with FLINTA* people looking for intentional community, friendship, and care.",
    tone: "from-primary/30 to-primary/0",
  },
  {
    icon: Calendar,
    title: "Discover what's happening",
    desc: "Community-created events, curated local happenings, and Pagu picks worth your time.",
    tone: "from-gold/30 to-gold/0",
  },
  {
    icon: ShieldCheck,
    title: "Connect with more trust",
    desc: "A space shaped by community guidelines, consent, safety, and mutual care.",
    tone: "from-emerald-400/30 to-emerald-400/0",
  },
  {
    icon: Sparkles,
    title: "Take part, not just scroll",
    desc: "Create events, host gatherings, and become an active part of the movement.",
    tone: "from-fuchsia-400/30 to-fuchsia-400/0",
  },
];

function FPWhyJoin() {
  return (
    <section className="relative max-w-7xl mx-auto px-5 lg:px-8 py-24 md:py-32">
      <div className="max-w-2xl mb-14">
        <p className="fp-eyebrow mb-4">Why join Pagu</p>
        <h2 className="text-balance">
          A community you can <span className="fp-italic text-gold">feel</span>, not just follow.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BENEFITS.map((b, i) => {
          const Icon = b.icon;
          return (
            <article
              key={b.title}
              className="fp-card p-7 flex flex-col gap-5 min-h-[280px]"
              style={{ transform: `rotate(${i % 2 === 0 ? -0.4 : 0.5}deg)` }}
            >
              <div
                className={`h-14 w-14 rounded-2xl grid place-items-center bg-gradient-to-br ${b.tone} border border-border/60`}
              >
                <Icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="font-display text-2xl leading-tight">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
              <span className="mt-auto fp-card-tag">0{i + 1} / 04</span>
            </article>
          );
        })}
      </div>

      <div className="mt-16 fp-card p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6 bg-gradient-purple text-primary-foreground">
        <div>
          <h3 className="font-display text-3xl md:text-4xl mb-2">Start your Pagu profile</h3>
          <p className="text-primary-foreground/80 max-w-md">
            Create your profile and join the community intentionally.
          </p>
        </div>
        <button className="fp-cta md:ml-auto">
          Register <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

/* ---------- Stories ---------- */

const STORIES = [
  {
    name: "Mira",
    role: "Performance artist · Ehrenfeld",
    quote:
      "Pagu was the first room in Cologne where I didn't have to translate myself. I came for one dinner. I stayed for a chosen family.",
    accent: "var(--color-gold)",
  },
  {
    name: "Jules",
    role: "Researcher · Sülz",
    quote:
      "Every event feels intentional. Someone thought about who would be in the room, and why. That care is the whole product.",
    accent: "oklch(0.7 0.18 200)",
  },
  {
    name: "Asha",
    role: "Organizer · Mülheim",
    quote:
      "I hosted my first reading through Pagu. The safe-space framework meant I could focus on the work, not on the door.",
    accent: "oklch(0.75 0.18 25)",
  },
];

function FPStories() {
  const [i, setI] = useState(0);
  const s = STORIES[i];
  return (
    <section className="relative bg-card/40 border-y border-border/40 py-24 md:py-32 overflow-hidden">
      <div className="fp-blob fp-blob-purple h-[400px] w-[400px] -left-32 top-10" />
      <div className="fp-blob fp-blob-gold h-[300px] w-[300px] right-0 bottom-0" />

      <div className="relative max-w-5xl mx-auto px-5 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="fp-eyebrow mb-3">Stories</p>
            <h2>People who make Pagu, Pagu.</h2>
          </div>
          <span className="hidden sm:block text-sm text-muted-foreground tabular-nums">
            0{i + 1} <span className="opacity-50">/ 0{STORIES.length}</span>
          </span>
        </div>

        <article
          key={i}
          className="fp-card fp-rise p-8 md:p-14 grid md:grid-cols-[200px_1fr] gap-8 items-center"
        >
          <div
            className="h-40 w-40 rounded-full mx-auto"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${s.accent}, transparent 70%), var(--color-card)`,
              border: "1px solid var(--color-border)",
              boxShadow: "0 20px 60px -20px rgba(0,0,0,.5)",
            }}
            aria-hidden
          />
          <div>
            <Quote className="h-8 w-8 text-gold mb-4" />
            <blockquote className="font-display text-2xl md:text-3xl leading-snug text-balance">
              "{s.quote}"
            </blockquote>
            <footer className="mt-6 text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{s.name}</span> · {s.role}
            </footer>
          </div>
        </article>

        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => setI((v) => (v - 1 + STORIES.length) % STORIES.length)}
            className="h-11 w-11 rounded-full border border-border/60 grid place-items-center hover:bg-card"
            aria-label="Previous story"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setI((v) => (v + 1) % STORIES.length)}
            className="h-11 w-11 rounded-full border border-border/60 grid place-items-center hover:bg-card"
            aria-label="Next story"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            to="/register"
            className="ml-auto inline-flex items-center gap-2 text-sm text-gold hover:underline"
          >
            Become part of our story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Community Map teaser ---------- */

function FPCommunityMap() {
  return (
    <section className="relative max-w-7xl mx-auto px-5 lg:px-8 py-24 md:py-32">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="fp-eyebrow mb-4">Community Map</p>
          <h2 className="mb-6">A living map of <span className="fp-italic text-gold">where we are</span>.</h2>
          <p className="text-muted-foreground text-lg max-w-md mb-8">
            Events, Safe Spaces, and people you can meet right now — clustered as an ecosystem, not a list.
          </p>
          <Link
            to="/community-map"
            className="fp-cta"
          >
            Open the map <Compass className="h-4 w-4" />
          </Link>
        </div>

        <div className="fp-card relative aspect-square overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 25% 30%, oklch(0.36 0.21 295 / 0.35), transparent 60%)," +
                "radial-gradient(ellipse at 75% 75%, oklch(0.88 0.11 90 / 0.25), transparent 60%)," +
                "linear-gradient(180deg, oklch(0.22 0.02 270), oklch(0.16 0.015 270))",
            }}
          />
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, oklch(0.6 0.02 270 / 0.4) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.6 0.02 270 / 0.4) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {[
            { x: 22, y: 32, label: "🛡️ Safe Space", tone: "bg-gold text-gold-foreground" },
            { x: 58, y: 22, label: "📅 5 events", tone: "bg-primary text-primary-foreground" },
            { x: 70, y: 60, label: "🌈 12 nearby", tone: "bg-emerald-500 text-white" },
            { x: 35, y: 70, label: "🛡️ Safe Space", tone: "bg-gold text-gold-foreground" },
            { x: 82, y: 40, label: "📅 Tonight", tone: "bg-primary text-primary-foreground" },
          ].map((m, i) => (
            <div
              key={i}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${m.tone}`}
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
                animation: `fp-float ${10 + i * 2}s ease-in-out infinite`,
              }}
            >
              {m.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Events ---------- */

const EVENTS = [
  {
    date: "Fri 12 Jun",
    title: "Soft Power: a FLINTA* reading night",
    where: "Ehrenfeld · Café Mira",
    tag: "Pagu Pick",
    accent: "var(--color-gold)",
  },
  {
    date: "Sat 20 Jun",
    title: "Slow Sundays — brunch & community check-in",
    where: "Belgisches Viertel · The Living Room",
    tag: "Community",
    accent: "oklch(0.7 0.18 200)",
  },
  {
    date: "Thu 27 Jun",
    title: "Queer print club — zines & risograph",
    where: "Mülheim · Studio 14",
    tag: "Workshop",
    accent: "oklch(0.75 0.18 25)",
  },
];

function FPEvents() {
  return (
    <section className="relative bg-card/40 border-y border-border/40 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="fp-eyebrow mb-3">Events</p>
            <h2>Cultural invitations, not listings.</h2>
          </div>
          <Link
            to="/community-events"
            className="text-sm text-gold hover:underline inline-flex items-center gap-2"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {EVENTS.map((e, i) => (
            <article key={e.title} className="fp-card overflow-hidden flex flex-col">
              <div
                className="h-44 relative"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${e.accent}, transparent 70%), linear-gradient(135deg, oklch(0.22 0.02 270), oklch(0.16 0.015 270))`,
                }}
              >
                <span className="absolute top-4 left-4 fp-sticker">{e.tag}</span>
                <span className="absolute bottom-4 left-4 text-xs uppercase tracking-widest text-foreground/80 bg-background/60 backdrop-blur px-2 py-1 rounded-full">
                  {e.date}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-2xl leading-snug mb-3">{e.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {e.where}
                </p>
                <button className="mt-6 inline-flex items-center gap-2 text-gold font-medium text-sm self-start">
                  RSVP <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Safe Spaces strip ---------- */

function FPSafeSpaces() {
  return (
    <section className="relative max-w-7xl mx-auto px-5 lg:px-8 py-24 md:py-32">
      <div className="fp-card p-8 md:p-14 grid md:grid-cols-[1fr_auto] items-center gap-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <span className="fp-sticker mb-5">🛡️ Pagu Safe Space</span>
          <h2 className="mb-4">Spaces that earned the badge.</h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Cafés, studios and venues vetted by the community and committed to consent, accessibility and care.
          </p>
        </div>
        <div className="flex -space-x-4 relative">
          {["🌿", "🛋️", "🎨", "📚", "🍵"].map((emoji, i) => (
            <div
              key={i}
              className="h-20 w-20 rounded-full border-2 border-background grid place-items-center text-3xl bg-card shadow-lg"
              style={{ transform: `rotate(${(i - 2) * 6}deg)` }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Mailing ---------- */

function FPMailing() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="fp-blob fp-blob-purple h-[440px] w-[440px] -left-20 top-10" />
      <div className="fp-blob fp-blob-gold h-[380px] w-[380px] right-0 bottom-0" />

      <div className="relative max-w-3xl mx-auto px-5 lg:px-8 text-center">
        <Heart className="mx-auto h-10 w-10 text-gold mb-6" />
        <h2 className="mb-5 text-balance">
          Letters from the <span className="fp-italic text-gold">collective</span>.
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
          A monthly note: what we're building, who we're meeting, what's worth showing up for.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="fp-card flex flex-col sm:flex-row items-stretch gap-3 p-3 max-w-xl mx-auto"
        >
          <input
            type="email"
            required
            placeholder="you@somewhere.coffee"
            className="flex-1 bg-transparent px-4 py-3 outline-none text-base placeholder:text-muted-foreground"
          />
          <button className="fp-cta justify-center">
            Subscribe <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Zap className="h-3.5 w-3.5" /> One letter a month. Unsubscribe any time.
        </p>
      </div>
    </section>
  );
}

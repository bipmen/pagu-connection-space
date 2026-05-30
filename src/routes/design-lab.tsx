import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Users,
  Heart,
  Shield,
  Compass,
  ArrowRight,
  Quote,
  Star,
  Zap,
  Camera,
} from "lucide-react";

export const Route = createFileRoute("/design-lab")({
  head: () => ({
    meta: [
      { title: "Design Lab — Pagu Visual Exploration" },
      {
        name: "description",
        content:
          "Internal visual exploration lab comparing three alternative design directions for Pagu.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DesignLabPage,
});

type DirectionId = "neo" | "editorial" | "playground";

const directions: Array<{
  id: DirectionId;
  name: string;
  tagline: string;
  description: string;
  mood: string[];
  principles: string[];
  advantages: string[];
  risks: string[];
}> = [
  {
    id: "neo",
    name: "Neo Community",
    tagline: "Intentional · Confident · Belonging",
    description:
      "A contemporary community-first identity inspired by Are.na, Cosmos, and Notion editorial campaigns. Cultural rather than corporate.",
    mood: ["Intentional", "Creative", "Confident", "Belonging"],
    principles: [
      "Large display typography with generous whitespace",
      "Soft gradients over flat cards",
      "Minimal iconography, no startup tropes",
      "Editorial rhythm, cultural tone of voice",
    ],
    advantages: [
      "Reads as mature without feeling corporate",
      "Scales cleanly across product surfaces",
      "Easy to evolve from current system",
    ],
    risks: [
      "May feel too restrained for a FLINTA* youth audience",
      "Whitespace-heavy layouts cost density",
    ],
  },
  {
    id: "editorial",
    name: "Queer Editorial",
    tagline: "Human · Expressive · Artistic",
    description:
      "Independent magazine energy. Photography-driven, layered, asymmetric. Community stories become the hero — events feel like cultural moments.",
    mood: ["Human", "Expressive", "Emotional", "Artistic"],
    principles: [
      "Oversized serif display, tight tracking",
      "Asymmetric grids, layered imagery, captions as design",
      "Grain, paper, film textures",
      "Stories and Safe Spaces lead the hierarchy",
    ],
    advantages: [
      "Strong emotional pull, instantly distinctive",
      "Centers community voices visually",
      "Photography becomes the brand",
    ],
    risks: [
      "Heavy art direction dependency",
      "Harder to maintain consistency at scale",
    ],
  },
  {
    id: "playground",
    name: "Future Playground",
    tagline: "Curious · Alive · Optimistic",
    description:
      "The boldest direction. Floating elements, organic shapes, motion-rich interactions. Gen Z products meet creative installations.",
    mood: ["Curious", "Adventurous", "Alive", "Optimistic"],
    principles: [
      "Blobby organic shapes, sticker-like UI",
      "Dynamic, slightly unpredictable layouts",
      "Motion as a primary design material",
      "Playful textures: gradients, noise, glow",
    ],
    advantages: [
      "Memorable, shareable, generation-defining",
      "Differentiates strongly from dating apps & SaaS",
      "Invites play and experimentation",
    ],
    risks: [
      "Hardest to keep accessible and calm",
      "Motion can fatigue on repeat use",
    ],
  },
];

function DesignLabPage() {
  const [active, setActive] = useState<DirectionId | "all">("all");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LabHeader active={active} setActive={setActive} />

      <main className="mx-auto max-w-7xl px-6 pb-32 pt-10">
        <Intro />

        <div className="mt-16 space-y-32">
          {directions
            .filter((d) => active === "all" || d.id === active)
            .map((d) => (
              <DirectionSection key={d.id} direction={d} />
            ))}
        </div>

        <ComparisonMatrix />
      </main>
    </div>
  );
}

function LabHeader({
  active,
  setActive,
}: {
  active: DirectionId | "all";
  setActive: (v: DirectionId | "all") => void;
}) {
  const tabs: Array<{ id: DirectionId | "all"; label: string }> = [
    { id: "all", label: "All directions" },
    { id: "neo", label: "Neo Community" },
    { id: "editorial", label: "Queer Editorial" },
    { id: "playground", label: "Future Playground" },
  ];
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="font-display text-lg leading-none">Pagu Design Lab</p>
            <p className="text-xs text-muted-foreground">
              Internal visual exploration · not production
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-1 rounded-full border border-border/60 bg-card/60 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                active === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Intro() {
  return (
    <section className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
      <div>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Visual
          exploration · v0.1
        </p>
        <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
          Three futures <br />
          for <span className="italic text-primary">Pagu</span>.
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground md:text-lg">
          A workshop, not a redesign. Same palette, same product — three
          alternative visual identities to help us decide whether Pagu reads
          stronger as a community platform, a cultural movement, or a new
          generation social product.
        </p>
      </div>
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Locked
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full bg-primary" /> Primary Purple
          </li>
          <li className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full bg-gold" /> Primary Gold
          </li>
          <li className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full border border-border bg-background" />{" "}
            Dark + Light surfaces
          </li>
          <li className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full border border-border" /> All
            functionality untouched
          </li>
        </ul>
      </div>
    </section>
  );
}

function DirectionSection({
  direction,
}: {
  direction: (typeof directions)[number];
}) {
  return (
    <section id={direction.id} className="scroll-mt-24">
      <DirectionHeader d={direction} />
      <div className="mt-10">
        {direction.id === "neo" && <NeoCommunityShowcase />}
        {direction.id === "editorial" && <QueerEditorialShowcase />}
        {direction.id === "playground" && <FuturePlaygroundShowcase />}
      </div>
      <DirectionMeta d={direction} />
    </section>
  );
}

function DirectionHeader({ d }: { d: (typeof directions)[number] }) {
  return (
    <div className="grid gap-6 border-t border-border/60 pt-10 md:grid-cols-[1fr_2fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Direction · {d.id === "neo" ? "01" : d.id === "editorial" ? "02" : "03"}
        </p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl">{d.name}</h2>
        <p className="mt-2 text-sm text-primary">{d.tagline}</p>
      </div>
      <p className="text-lg text-muted-foreground md:text-xl">{d.description}</p>
    </div>
  );
}

function DirectionMeta({ d }: { d: (typeof directions)[number] }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-4">
      <MetaCard title="Mood" items={d.mood} />
      <MetaCard title="Principles" items={d.principles} />
      <MetaCard title="Advantages" items={d.advantages} />
      <MetaCard title="Risks" items={d.risks} tone="warn" />
    </div>
  );
}

function MetaCard({
  title,
  items,
  tone = "default",
}: {
  title: string;
  items: string[];
  tone?: "default" | "warn";
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        tone === "warn"
          ? "border-destructive/30 bg-destructive/5"
          : "border-border/60 bg-card/50"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────── DIRECTION 1 — NEO COMMUNITY ───────────────── */

function NeoCommunityShowcase() {
  return (
    <div className="space-y-6">
      {/* Landing */}
      <ShowcaseFrame label="Landing">
        <div className="grid gap-8 bg-background p-10 md:grid-cols-[1.3fr_1fr] md:p-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              A FLINTA* community
            </p>
            <h3 className="mt-4 font-display text-5xl leading-[1.05] md:text-6xl">
              Belonging,<br />
              <span className="italic text-primary">designed slowly.</span>
            </h3>
            <p className="mt-5 max-w-md text-muted-foreground">
              Pagu is a quiet place to find your people, your events, and the
              spaces that already love you back.
            </p>
            <div className="mt-7 flex gap-3">
              <button className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">
                Join Pagu
              </button>
              <button className="rounded-full border border-border px-5 py-2.5 text-sm">
                Read the manifesto
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Community", "Events", "Safe Spaces", "Stories"].map((t, i) => (
              <div
                key={t}
                className="aspect-square rounded-2xl border border-border/60 bg-gradient-to-br from-card to-background p-4"
                style={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(135deg, oklch(0.36 0.21 295 / 0.12), transparent)"
                      : "linear-gradient(135deg, oklch(0.88 0.11 90 / 0.18), transparent)",
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  0{i + 1}
                </p>
                <p className="mt-auto font-display text-2xl">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </ShowcaseFrame>

      <div className="grid gap-6 md:grid-cols-2">
        <ShowcaseFrame label="Community Map">
          <div className="bg-card p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Berlin · 142 members
            </p>
            <h4 className="mt-2 font-display text-3xl">Near you</h4>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-gradient-to-br from-primary/15 to-gold/20"
                />
              ))}
            </div>
          </div>
        </ShowcaseFrame>
        <ShowcaseFrame label="Event Card">
          <div className="bg-card p-8">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/30 to-gold/30" />
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Fri · 22:00 · Neukölln
            </p>
            <h4 className="mt-1 font-display text-2xl">
              Soft Power — a listening night
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Curated by Pagu × Coletivo. Limited to 60 guests.
            </p>
          </div>
        </ShowcaseFrame>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SmallSpec label="Buttons">
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground">
              Primary
            </button>
            <button className="rounded-full border border-border px-4 py-2 text-xs">
              Ghost
            </button>
            <button className="rounded-full bg-gold px-4 py-2 text-xs text-gold-foreground">
              Gold
            </button>
          </div>
        </SmallSpec>
        <SmallSpec label="Empty state">
          <div className="text-center">
            <Users className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-2 font-display text-lg">No events yet</p>
            <p className="text-xs text-muted-foreground">
              Be the first to host this week.
            </p>
          </div>
        </SmallSpec>
        <SmallSpec label="Navigation">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-foreground">Home</span>
            <span>Map</span>
            <span>Events</span>
            <span>Stories</span>
            <span>You</span>
          </div>
        </SmallSpec>
      </div>
    </div>
  );
}

/* ───────────────── DIRECTION 2 — QUEER EDITORIAL ───────────────── */

function QueerEditorialShowcase() {
  return (
    <div className="space-y-6">
      <ShowcaseFrame label="Landing — magazine cover">
        <div
          className="relative overflow-hidden bg-foreground p-10 text-background md:p-16"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, oklch(0.36 0.21 295 / 0.5), transparent 50%), radial-gradient(circle at 80% 80%, oklch(0.88 0.11 90 / 0.4), transparent 55%)",
          }}
        >
          <div className="flex items-baseline justify-between text-xs uppercase tracking-[0.3em] opacity-70">
            <span>Issue 07</span>
            <span>Summer · Berlin</span>
          </div>
          <h3 className="mt-8 font-display text-6xl leading-[0.95] md:text-8xl">
            we are <br />
            <span className="italic">each other's</span> <br />
            algorithm.
          </h3>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <p className="text-sm opacity-80">
              A FLINTA* community paper, printed on the internet.
            </p>
            <div className="md:col-span-2">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-sm bg-background/10 ring-1 ring-background/20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.06) 6px 7px)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")" }} />
        </div>
      </ShowcaseFrame>

      <div className="grid gap-6 md:grid-cols-5">
        <ShowcaseFrame label="Story" className="md:col-span-3">
          <div className="bg-background p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Story · No. 12
            </p>
            <h4 className="mt-3 font-display text-4xl italic leading-tight">
              "I found my chosen family at a Tuesday queer cinema."
            </h4>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="col-span-2 aspect-[4/3] bg-gradient-to-br from-primary/40 to-gold/30" />
              <div className="aspect-[3/4] bg-gradient-to-br from-gold/40 to-primary/20" />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              — Lia, 27, Berlin
            </p>
          </div>
        </ShowcaseFrame>
        <ShowcaseFrame label="Safe Space" className="md:col-span-2">
          <div className="bg-card p-8">
            <Shield className="h-5 w-5 text-gold" />
            <h4 className="mt-3 font-display text-2xl italic">
              SilverFuture, Neukölln
            </h4>
            <Quote className="mt-4 h-4 w-4 text-muted-foreground" />
            <p className="mt-2 text-sm">
              "They know our names. They know our drinks. They know when to
              turn the music down."
            </p>
            <div className="mt-5 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </div>
          </div>
        </ShowcaseFrame>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SmallSpec label="Typography">
          <p className="font-display text-3xl italic leading-tight">
            Aa — Fraunces
          </p>
          <p className="text-xs text-muted-foreground">
            Editorial serif · oversized · italic accents
          </p>
        </SmallSpec>
        <SmallSpec label="Buttons">
          <div className="flex flex-wrap gap-2">
            <button className="border border-foreground px-4 py-2 text-xs uppercase tracking-[0.2em]">
              Read →
            </button>
            <button className="bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background">
              Subscribe
            </button>
          </div>
        </SmallSpec>
        <SmallSpec label="Navigation">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Stories · Events · Spaces · Map · You
          </p>
        </SmallSpec>
      </div>
    </div>
  );
}

/* ───────────────── DIRECTION 3 — FUTURE PLAYGROUND ───────────────── */

function FuturePlaygroundShowcase() {
  return (
    <div className="space-y-6">
      <ShowcaseFrame label="Landing — sticker world">
        <div className="relative overflow-hidden bg-background p-10 md:p-16">
          {/* floating blobs */}
          <div className="pointer-events-none absolute -left-10 top-10 h-48 w-48 rounded-full bg-primary/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-gold/40 blur-3xl" />
          <div className="pointer-events-none absolute right-1/3 top-1/3 h-24 w-24 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-primary/30" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-background">
              <Zap className="h-3 w-3" /> live · 312 hanging out
            </span>
            <h3 className="mt-6 font-display text-6xl leading-[1] md:text-8xl">
              hi
              <span className="inline-block -rotate-6 rounded-3xl bg-gold px-4 py-1 text-gold-foreground">
                bestie
              </span>
              ✿
            </h3>
            <p className="mt-6 max-w-md text-lg">
              Pagu is a tiny internet city for FLINTA* folks. Wander in.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-primary px-6 py-3 text-sm text-primary-foreground shadow-[6px_6px_0_0_oklch(0.88_0.11_90)]">
                Make a profile
              </button>
              <button className="rounded-2xl border-2 border-foreground bg-background px-6 py-3 text-sm">
                Peek inside →
              </button>
            </div>
          </div>

          {/* sticker cards */}
          <div className="relative mt-10 flex flex-wrap gap-4">
            {[
              { t: "Picnic ☀️", c: "bg-gold/80 text-gold-foreground rotate-2" },
              {
                t: "Karaoke 🎤",
                c: "bg-primary/90 text-primary-foreground -rotate-3",
              },
              { t: "Reading club 📚", c: "bg-foreground text-background rotate-1" },
              { t: "Skate ⛸", c: "bg-background border-2 border-foreground -rotate-2" },
            ].map((s) => (
              <div
                key={s.t}
                className={`rounded-2xl px-5 py-3 font-display text-xl shadow-md ${s.c}`}
              >
                {s.t}
              </div>
            ))}
          </div>
        </div>
      </ShowcaseFrame>

      <div className="grid gap-6 md:grid-cols-3">
        <ShowcaseFrame label="Community Map">
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 via-background to-gold/20">
            {[
              { x: "20%", y: "30%" },
              { x: "55%", y: "20%" },
              { x: "70%", y: "60%" },
              { x: "35%", y: "70%" },
              { x: "82%", y: "35%" },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border-2 border-background bg-primary"
                style={{ left: p.x, top: p.y }}
              />
            ))}
            <div className="absolute bottom-3 left-3 rounded-full bg-foreground px-3 py-1 text-[10px] uppercase tracking-widest text-background">
              5 friends nearby
            </div>
          </div>
        </ShowcaseFrame>
        <ShowcaseFrame label="Profile">
          <div className="bg-card p-6 text-center">
            <div className="mx-auto h-20 w-20 rounded-[40%_60%_60%_40%] bg-gradient-to-br from-primary to-gold" />
            <p className="mt-3 font-display text-2xl">@kai ✿</p>
            <p className="text-xs text-muted-foreground">she/they · Berlin</p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {["dyke nights", "zines", "skate", "synths"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-foreground/20 bg-background px-3 py-1 text-[11px]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </ShowcaseFrame>
        <ShowcaseFrame label="Onboarding">
          <div className="bg-gradient-to-br from-gold/30 to-primary/30 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/70">
              step 2 / 4
            </p>
            <h4 className="mt-2 font-display text-3xl">
              pick your <em className="not-italic underline decoration-gold decoration-4">vibes</em>
            </h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {["loud", "soft", "outside", "late night", "sober", "messy"].map(
                (t, i) => (
                  <button
                    key={t}
                    className={`rounded-full px-3 py-1.5 text-xs ${
                      i % 2 === 0
                        ? "bg-foreground text-background"
                        : "border border-foreground/30"
                    }`}
                  >
                    {t}
                  </button>
                ),
              )}
            </div>
          </div>
        </ShowcaseFrame>
      </div>
    </div>
  );
}

/* ───────────────── shared bits ───────────────── */

function ShowcaseFrame({
  children,
  label,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-border/60 bg-background shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-card/40 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <span>{label}</span>
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SmallSpec({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
      <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function ComparisonMatrix() {
  const rows: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    values: Record<DirectionId, string>;
  }> = [
    {
      label: "Tone",
      icon: Heart,
      values: {
        neo: "Mature, calm",
        editorial: "Emotional, human",
        playground: "Playful, loud",
      },
    },
    {
      label: "Typography",
      icon: Sparkles,
      values: {
        neo: "Display + airy sans",
        editorial: "Oversized italic serif",
        playground: "Chunky display + stickers",
      },
    },
    {
      label: "Imagery",
      icon: Camera,
      values: {
        neo: "Soft gradients",
        editorial: "Documentary photography",
        playground: "Collage, blobs, motion",
      },
    },
    {
      label: "Best for",
      icon: Compass,
      values: {
        neo: "Community platform",
        editorial: "Cultural movement",
        playground: "Gen-Z social product",
      },
    },
    {
      label: "Risk",
      icon: Shield,
      values: {
        neo: "Too quiet",
        editorial: "Hard to maintain",
        playground: "Fatigue / a11y",
      },
    },
  ];
  return (
    <section className="mt-32 border-t border-border/60 pt-16">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Comparison
      </p>
      <h2 className="mt-2 font-display text-4xl md:text-5xl">
        Which Pagu are we building?
      </h2>
      <div className="mt-10 overflow-hidden rounded-3xl border border-border/60">
        <div className="grid grid-cols-4 bg-card/60 px-6 py-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span />
          <span>Neo Community</span>
          <span>Queer Editorial</span>
          <span>Future Playground</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`grid grid-cols-4 items-center gap-4 px-6 py-5 text-sm ${
              i % 2 === 0 ? "bg-background" : "bg-card/30"
            }`}
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <r.icon className="h-4 w-4" /> {r.label}
            </span>
            <span>{r.values.neo}</span>
            <span>{r.values.editorial}</span>
            <span>{r.values.playground}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {directions.map((d) => (
          <a
            key={d.id}
            href={`#${d.id}`}
            className="group rounded-2xl border border-border/60 bg-card/40 p-6 transition hover:border-primary/60"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Jump to
            </p>
            <p className="mt-2 font-display text-2xl">{d.name}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-primary">
              Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </p>
          </a>
        ))}
      </div>

      <p className="mt-16 max-w-2xl text-sm text-muted-foreground">
        This lab is internal. None of these directions are live in the product —
        production navigation, auth, events, discover, profile and onboarding
        are untouched. Visit{" "}
        <code className="rounded bg-card px-1.5 py-0.5 text-xs">/design-lab</code>{" "}
        to revisit.
      </p>
    </section>
  );
}

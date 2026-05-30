import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, Quote, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type Story = {
  text: string;
  by: string;
};

const stories: Story[] = [
  {
    text: `I came to Pagu looking for my new queer BFF and instead, on the first round of talks, this ginger cutie with big blue eyes sat in front of me. Determined to stay cool, I made small talk until she picked up a card with the question "what is the biggest lesson you learned from your last relationship?" — a very casual topic when you're seating with a stranger on a 5 minutes ticking clock. We burst out laughing. The next day we matched and she offered to reply during a picnic date. It led to a 7 month romance full of fun memories.`,
    by: "On finding a romance at Sync Up!",
  },
  {
    text: `We clocked each other on the train before we even made it to Sync Up — queer radar, but make it non-binary. The conversation started with mutual appreciation for long, gorgeous Amazon press-on nails (and an iconic fur jacket). I said I wanted to learn to sew, they offered tailoring services, and our first "sewing date" turned into a 6-hour kiki full of gossip, snacks, and tea. Since then, we've made a beautiful pillow, started kinky overalls, and become fast friends.`,
    by: "On finding a creative best friend",
  },
  {
    text: `The way we met was a bit chaotic: we didn't have a speed date during the event but we met and talked towards the end, felt a strong spark of connection and exchanged contacts. Since then we got in a relationship and are spending wonderful time together — and we're inviting our friends to go together to the next speed dating event!`,
    by: "On finding love after the rounds",
  },
];

const TOTAL_SLIDES = stories.length + 1; // stories + CTA

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (next: number) => {
    const normalized = (next + TOTAL_SLIDES) % TOTAL_SLIDES;
    setIndex(normalized);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>, next: number) => {
    e.preventDefault();
    goTo(next);
  };

  // Keyboard navigation on the region
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
      }
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    const region = document.getElementById("community-stories");
    region?.addEventListener("keydown", onKey as EventListener);
    return () => region?.removeEventListener("keydown", onKey as EventListener);
  }, [index]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <section
      id="community-stories"
      tabIndex={-1}
      aria-roledescription="carousel"
      aria-label="Community stories"
      className="px-5 lg:px-8 max-w-5xl mx-auto py-20 md:py-28 outline-none"
    >
      <div className="max-w-2xl mb-10 md:mb-14">
        <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Community stories</p>
        <h2 className="font-display text-4xl md:text-5xl text-balance leading-tight">
          Real encounters from <em className="text-gold not-italic">our community.</em>
        </h2>
      </div>

      <div
        className="relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Stable-height stage */}
        <div className="relative min-h-[460px] md:min-h-[420px]">
          {stories.map((s, i) => (
            <StorySlide key={i} story={s} index={i} total={stories.length} active={index === i} />
          ))}
          <CtaSlide active={index === stories.length} />
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={(e) => handleClick(e, index - 1)}
            aria-label="Previous story"
            className="h-12 w-12 shrink-0 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center justify-center hover:bg-gold/10 hover:border-gold/40 transition motion-reduce:transition-none"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <div
              className="flex gap-2"
              role="tablist"
              aria-label={`Story ${index + 1} of ${TOTAL_SLIDES}`}
            >
              {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={index === i}
                  aria-label={
                    i === stories.length
                      ? "Go to join the community"
                      : `Go to story ${i + 1}`
                  }
                  onClick={(e) => handleClick(e, i)}
                  className={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${
                    index === i ? "w-8 bg-gold" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground tabular-nums hidden sm:inline">
              {index + 1} / {TOTAL_SLIDES}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => handleClick(e, index + 1)}
            aria-label="Next story"
            className="h-12 w-12 shrink-0 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center justify-center hover:bg-gold/10 hover:border-gold/40 transition motion-reduce:transition-none"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function StorySlide({
  story,
  index,
  total,
  active,
}: {
  story: Story;
  index: number;
  total: number;
  active: boolean;
}) {
  return (
    <article
      aria-hidden={!active}
      aria-roledescription="slide"
      aria-label={`Story ${index + 1} of ${total}`}
      className={`transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        active ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
      }`}
    >
      <div className="relative mx-auto max-w-3xl rounded-3xl bg-card border border-border/60 p-7 md:p-12 shadow-soft">
        <div className="absolute -top-3 -left-3 h-12 w-12 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-soft">
          <Quote className="h-5 w-5 text-background" />
        </div>
        <p className="text-base md:text-xl text-foreground/90 leading-relaxed font-display italic text-balance">
          “{story.text}”
        </p>
        <div className="mt-8 flex items-center gap-3">
          <span className="h-px w-10 bg-gold/60" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{story.by}</p>
        </div>
      </div>
    </article>
  );
}

function CtaSlide({ active }: { active: boolean }) {
  return (
    <article
      aria-hidden={!active}
      aria-roledescription="slide"
      aria-label="Become part of our story"
      className={`transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        active ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
      }`}
    >
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-gold/40 bg-gradient-hero p-8 md:p-14 shadow-glow text-center">
        <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-gold/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />

        <div className="relative">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/30 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Join Pagu
          </div>
          <h3 className="font-display text-3xl md:text-5xl text-balance leading-tight mb-4">
            Become part of <em className="text-gold not-italic">our story.</em>
          </h3>
          <p className="text-base md:text-lg text-foreground/85 max-w-xl mx-auto leading-relaxed mb-8">
            Join a community built for intentional connection.
          </p>
          <Button asChild variant="gold" size="lg">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

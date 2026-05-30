import { useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import portrait from "@/assets/pagu-portrait.jpg";

const SLIDES = [SlideOne, SlideTwo] as const;

export function HeroCarousel() {
  const [slide, setSlide] = useState(0);

  const go = (e: MouseEvent<HTMLButtonElement>, next: number) => {
    e.preventDefault();
    if (next < 0 || next >= SLIDES.length) return;
    setSlide(next);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* floating orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/30 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-gold/20 blur-3xl animate-float-slow" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8 pt-10 pb-10 md:pt-14 md:pb-14">
        {/* Stable-height slide stage. Slides are absolutely stacked and crossfade. */}
        <div className="relative min-h-[360px] md:min-h-[420px]">
          {SLIDES.map((Slide, i) => (
            <div
              key={i}
              aria-hidden={slide !== i}
              className={`transition-opacity duration-500 ease-out ${
                slide === i
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-0 opacity-0"
              }`}
            >
              <Slide />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => go(e, slide - 1)}
            disabled={slide === 0}
            aria-label="Previous slide"
            className="h-12 w-12 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center justify-center disabled:opacity-30 hover:bg-gold/10 hover:border-gold/40 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => go(e, i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${slide === i ? "w-8 bg-gold" : "w-2 bg-muted-foreground/30"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={(e) => go(e, slide + 1)}
            disabled={slide === SLIDES.length - 1}
            aria-label="Next slide"
            className="h-12 w-12 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center justify-center disabled:opacity-30 hover:bg-gold/10 hover:border-gold/40 transition"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function SlideOne() {
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">About Pagu</p>
      <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-balance mb-5">
        FLINTA* community <em className="text-gold not-italic">beyond algorithms.</em>
      </h1>
      <p className="text-base md:text-lg text-foreground/85 leading-relaxed max-w-xl">
        A Cologne-based collective creating intentional spaces for real connection — curated events, honest conversations, lasting community.
      </p>
    </div>
  );
}

function SlideTwo() {
  return (
    <div className="grid md:grid-cols-[1fr_220px] gap-8 items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">The name</p>
        <h1 className="font-display text-4xl md:text-5xl leading-[1.05] text-balance mb-5">
          Why <em className="text-gold not-italic">Pagu?</em>
        </h1>
        <p className="text-base md:text-lg text-foreground/85 leading-relaxed max-w-xl">
          Named after Patrícia Galvão — Brazilian writer, activist, rebel. A spirit of curiosity and quiet defiance lives at the heart of this collective.
        </p>
      </div>
      <div className="relative mx-auto md:mx-0">
        <div className="absolute -inset-3 bg-gradient-gold rounded-2xl blur-2xl opacity-30" />
        <img src={portrait} alt="Patrícia Galvão (Pagu)" className="relative rounded-2xl w-[200px] h-auto shadow-soft" loading="lazy" width={520} height={693} />
      </div>
    </div>
  );
}

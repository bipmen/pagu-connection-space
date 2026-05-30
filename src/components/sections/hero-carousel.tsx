import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import portrait from "@/assets/pagu-portrait.jpg";

const SLIDES = [SlideOne, SlideTwo, SlideThree] as const;
const AUTOPLAY_MS = 5000;

export function HeroCarousel() {
  const [slide, setSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return clearTimer;
  }, [slide]);

  const goTo = (next: number) => {
    const normalized = (next + SLIDES.length) % SLIDES.length;
    setSlide(normalized);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>, next: number) => {
    e.preventDefault();
    goTo(next);
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
            onClick={(e) => handleClick(e, slide - 1)}
            aria-label="Previous slide"
            className="h-12 w-12 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center justify-center hover:bg-gold/10 hover:border-gold/40 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div
            className="flex gap-2"
            role="tablist"
            aria-label={`Slide ${slide + 1} of ${SLIDES.length}`}
          >
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={slide === i}
                onClick={(e) => handleClick(e, i)}
                aria-label={`Go to slide ${i + 1} of ${SLIDES.length}`}
                className={`h-1.5 rounded-full transition-all ${slide === i ? "w-8 bg-gold" : "w-2 bg-muted-foreground/30"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={(e) => handleClick(e, slide + 1)}
            aria-label="Next slide"
            className="h-12 w-12 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center justify-center hover:bg-gold/10 hover:border-gold/40 transition"
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
      <p className="text-xs uppercase tracking-[0.25em] text-gold mb-5">About Pagu</p>
      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-balance mb-6">
        Building FLINTA* community <em className="text-gold not-italic">beyond algorithms.</em>
      </h1>
      <p className="text-base md:text-lg text-foreground/85 text-balance leading-relaxed mb-5 max-w-2xl">
        Pagu is a FLINTA*-led collective in Cologne creating intentional spaces for connection
        through curated events, meaningful conversations, and community experiences.
      </p>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
        In a world dominated by swipes and algorithms, meeting people can feel transactional and exhausting.
        Pagu exists to bring connection back into the real world — whether for friendship, creative collaboration,
        queer community, or romance.
      </p>
    </div>
  );
}

function SlideTwo() {
  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-8 md:gap-10 items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gold mb-5">The story behind the brand</p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-balance mb-6">
          Why the name <em className="text-gold not-italic">Pagu?</em>
        </h1>
        <p className="text-base md:text-lg text-foreground/85 leading-relaxed mb-4 text-balance max-w-2xl">
          A rebellious, cultural and political movement. The first woman to be arrested for political reasons in Brazil.
        </p>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
          The name is inspired by Patrícia Galvão (nicknamed Pagu), a Brazilian modernist writer and activist who challenged
          social norms and championed cultural freedom. Her spirit of curiosity and rebellion reflects the values behind this
          collective: spaces where people can meet openly, question expectations, and imagine new forms of connection.
        </p>
      </div>
      <div className="relative mx-auto md:mx-0">
        <div className="absolute -inset-3 bg-gradient-gold rounded-2xl blur-2xl opacity-30" />
        <img src={portrait} alt="Patrícia Galvão (Pagu)" className="relative rounded-2xl w-[200px] md:w-[220px] h-auto shadow-soft" loading="lazy" width={520} height={693} />
      </div>
    </div>
  );
}

function SlideThree() {
  return (
    <div className="max-w-3xl">
      <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold mb-5">
        <ShieldCheck className="h-3.5 w-3.5" /> Safety & community care
      </p>
      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-balance mb-6">
        Safer connection starts with <em className="text-gold not-italic">shared care.</em>
      </h1>
      <p className="text-base md:text-lg text-foreground/85 leading-relaxed mb-5 text-balance max-w-2xl">
        Pagu is built around consent, respect, and clear community guidelines — so FLINTA* people can show up,
        be themselves, and connect with more trust.
      </p>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
        From how we host events to how members treat each other, every part of Pagu is designed around safety,
        accountability, and mutual care. Because real community only grows where people feel genuinely safe.
      </p>
    </div>
  );
}

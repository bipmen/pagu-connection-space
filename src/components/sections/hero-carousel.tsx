"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import portrait from "@/assets/pagu-portrait.jpg";
import { getAssetSrc } from "@/lib/asset-src";

export function HeroCarousel() {
  const [slide, setSlide] = useState(0);
  const next = () => setSlide(1);
  const prev = () => setSlide(0);

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/30 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-gold/20 blur-3xl animate-float-slow" />

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 lg:px-8 md:pb-28 md:pt-20">
        {slide === 0 ? <SlideOne /> : <SlideTwo />}

        <div className="mt-12 flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={slide === 0}
            aria-label="Previous slide"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-background/40 backdrop-blur transition hover:border-gold/40 hover:bg-gold/10 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {[0, 1].map((index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  slide === index ? "w-8 bg-gold" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            disabled={slide === 1}
            aria-label="Next slide"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-background/40 backdrop-blur transition hover:border-gold/40 hover:bg-gold/10 disabled:opacity-30"
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
      <p className="mb-5 text-xs uppercase tracking-[0.25em] text-gold">About Pagu</p>
      <h1 className="mb-6 text-balance font-display text-5xl leading-[1.05] md:text-7xl">
        Building FLINTA* community <em className="text-gold not-italic">beyond algorithms.</em>
      </h1>
      <p className="mb-6 max-w-2xl text-balance text-lg leading-relaxed text-foreground/85 md:text-xl">
        Pagu is a FLINTA*-led collective in Cologne creating intentional spaces for connection
        through curated events, meaningful conversations, and community experiences.
      </p>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
        In a world dominated by swipes and algorithms, meeting people can feel transactional and
        exhausting. Pagu exists to bring connection back into the real world. Through events like
        Sync Up!, we create spaces where FLINTA* people can meet intentionally, whether for
        friendship, creative collaboration, queer community, or romance. Because meaningful
        encounters deserve the right conditions.
      </p>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {["FLINTA* community", "Cologne based", "Multilingual"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border/60 bg-background/30 px-3 py-1.5 backdrop-blur"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function SlideTwo() {
  const portraitSrc = getAssetSrc(portrait);

  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_280px]">
      <div>
        <p className="mb-5 text-xs uppercase tracking-[0.25em] text-gold">The story behind the brand</p>
        <h1 className="mb-6 text-balance font-display text-5xl leading-[1.05] md:text-6xl">
          Why the name <em className="text-gold not-italic">Pagu?</em>
        </h1>
        <p className="mb-5 max-w-2xl text-balance text-lg leading-relaxed text-foreground/85">
          A rebellious, cultural and political movement. The first woman to be arrested for
          political reasons in Brazil.
        </p>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          The name is inspired by Patricia Galvao, nicknamed Pagu, a Brazilian modernist writer
          and activist who challenged social norms and championed cultural freedom. Her spirit of
          curiosity and rebellion reflects the values behind this collective: creating spaces where
          people can meet openly, question expectations, and imagine new forms of connection.
          Years later, Rita Lee wrote a song about the revolutionary spirit of Pagu.
        </p>
      </div>
      <div className="relative mx-auto md:mx-0">
        <div className="absolute -inset-3 rounded-2xl bg-gradient-gold opacity-30 blur-2xl" />
        <img
          src={portraitSrc}
          alt="Patricia Galvao (Pagu)"
          className="relative h-auto w-[260px] rounded-2xl shadow-soft"
          loading="lazy"
          width={520}
          height={693}
        />
      </div>
    </div>
  );
}

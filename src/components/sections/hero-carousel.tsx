import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import portrait from "@/assets/pagu-portrait.jpg";

export function HeroCarousel() {
  const [slide, setSlide] = useState(0);
  const next = () => setSlide(1);
  const prev = () => setSlide(0);

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* floating orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/30 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-gold/20 blur-3xl animate-float-slow" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28">
        {slide === 0 ? <SlideOne /> : <SlideTwo />}

        {/* Slide indicators + arrows */}
        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={slide === 0}
            aria-label="Previous slide"
            className="h-12 w-12 rounded-full border border-border/60 bg-background/40 backdrop-blur flex items-center justify-center disabled:opacity-30 hover:bg-gold/10 hover:border-gold/40 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {[0, 1].map((i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${slide === i ? "w-8 bg-gold" : "w-2 bg-muted-foreground/30"}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={slide === 1}
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
      <p className="text-xs uppercase tracking-[0.25em] text-gold mb-5">About Pagu</p>
      <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-balance mb-6">
        Building FLINTA* community <em className="text-gold not-italic">beyond algorithms.</em>
      </h1>
      <p className="text-lg md:text-xl text-foreground/85 text-balance leading-relaxed mb-6 max-w-2xl">
        Pagu is a FLINTA*-led collective in Cologne creating intentional spaces for connection
        through curated events, meaningful conversations, and community experiences.
      </p>
      <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-8">
        In a world dominated by swipes and algorithms, meeting people can feel transactional and exhausting.
        Pagu exists to bring connection back into the real world. Through events like Sync Up!, we create spaces
        where FLINTA* people can meet intentionally — whether for friendship, creative collaboration, queer community,
        or romance. Because meaningful encounters deserve the right conditions.
      </p>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {["FLINTA* community", "Cologne based", "Multilingual"].map((t) => (
          <span key={t} className="px-3 py-1.5 rounded-full border border-border/60 bg-background/30 backdrop-blur">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function SlideTwo() {
  return (
    <div className="grid md:grid-cols-[1fr_280px] gap-10 items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gold mb-5">The story behind the brand</p>
        <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-balance mb-6">
          Why the name <em className="text-gold not-italic">Pagu?</em>
        </h1>
        <p className="text-lg text-foreground/85 leading-relaxed mb-5 text-balance max-w-2xl">
          A rebellious, cultural and political movement. The first woman to be arrested for political reasons in Brazil.
        </p>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
          The name is inspired by Patrícia Galvão (nicknamed Pagu), a Brazilian modernist writer and activist who challenged
          social norms and championed cultural freedom. Her spirit of curiosity and rebellion reflects the values behind this
          collective: creating spaces where people can meet openly, question expectations, and imagine new forms of connection.
          Years later, Rita Lee wrote a song about the revolutionary spirit of Pagu.
        </p>
      </div>
      <div className="relative mx-auto md:mx-0">
        <div className="absolute -inset-3 bg-gradient-gold rounded-2xl blur-2xl opacity-30" />
        <img src={portrait} alt="Patrícia Galvão (Pagu)" className="relative rounded-2xl w-[260px] h-auto shadow-soft" loading="lazy" width={520} height={693} />
      </div>
    </div>
  );
}

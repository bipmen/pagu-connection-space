"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Globe, Heart, Music } from "lucide-react";

const features = [
  { icon: MessageCircle, title: "Short 1:1 conversations", desc: "Meet several people through quick, guided rounds." },
  { icon: Globe, title: "Multilingual community", desc: "Connect across languages and cultures." },
  { icon: Heart, title: "FLINTA-centered space", desc: "A welcoming environment for women, lesbians, intersex, non-binary, trans and agender people." },
  { icon: Music, title: "Lounge time after rounds", desc: "Stay, relax, and continue conversations naturally." },
];

const stats = [
  { value: 3, suffix: "", label: "Editions" },
  { value: 99, suffix: "+", label: "Participants" },
  { value: 20, suffix: "+", label: "Rounds" },
  { value: 150, suffix: "+", label: "Matches" },
];

export function EventsSection() {
  return (
    <section id="events" className="relative px-5 lg:px-8 max-w-7xl mx-auto py-20 md:py-28">
      <div className="max-w-3xl mb-14">
        <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Our event</p>
        <h2 className="font-display text-5xl md:text-6xl text-balance leading-[1.05] mb-6">
          Sync <em className="text-gold not-italic">Up!</em>
        </h2>
        <p className="text-lg text-foreground/85 leading-relaxed text-balance mb-4">
          A welcoming space for FLINTA people to meet, talk, and connect.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Sync Up! is Pagu's signature gathering format — inspired by speed dating, but designed for meaningful
          conversations, not performance. You'll rotate through short 1:1 conversations, meeting different people
          in a relaxed, supportive environment. No pressure. No scripts.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl bg-card border border-border/60 p-6 hover:border-gold/40 transition-colors">
            <f.icon className="h-6 w-6 text-gold mb-4" />
            <h3 className="font-display text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-gradient-purple p-8 md:p-12 shadow-soft">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/90 mb-2">By the numbers</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-6">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const dur = 1400;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(value * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <div className="font-display text-5xl md:text-6xl text-gold leading-none mb-2">
        {n}<span>{suffix}</span>
      </div>
      <div className="text-xs uppercase tracking-widest text-primary-foreground/80">{label}</div>
    </div>
  );
}

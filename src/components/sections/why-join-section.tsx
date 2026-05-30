import { Users, CalendarDays, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const benefits = [
  {
    icon: Users,
    title: "Find your people",
    desc: "Connect with FLINTA* people looking for intentional community, friendship, support, and shared experiences.",
  },
  {
    icon: CalendarDays,
    title: "Discover what’s happening",
    desc: "Explore community-created events, curated local happenings, and Pagu-selected experiences.",
  },
  {
    icon: ShieldCheck,
    title: "Connect with more trust",
    desc: "Join a space shaped by community guidelines, consent, safety, and mutual care.",
  },
  {
    icon: Sparkles,
    title: "Take part, not just scroll",
    desc: "Create events, join gatherings, and become an active part of the community.",
  },
];

export function WhyJoinSection() {
  return (
    <section id="why-join" className="px-5 lg:px-8 max-w-7xl mx-auto py-20 md:py-28">
      <div className="max-w-3xl mb-14">
        <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Community</p>
        <h2 className="font-display text-5xl md:text-6xl text-balance leading-[1.05] mb-6">
          Why join <em className="text-gold not-italic">Pagu?</em>
        </h2>
        <p className="text-lg text-foreground/85 leading-relaxed text-balance">
          A space for FLINTA* people to meet, create, and belong — intentionally.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="rounded-2xl bg-card border border-border/60 p-6 hover:border-gold/40 transition-colors"
          >
            <b.icon className="h-6 w-6 text-gold mb-4" />
            <h3 className="font-display text-lg mb-2">{b.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-gradient-purple p-8 md:p-12 shadow-soft text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-gold/90 mb-3">Ready to join?</p>
        <h3 className="font-display text-3xl md:text-4xl text-balance leading-tight mb-4">
          Become part of our community
        </h3>
        <p className="text-primary-foreground/80 leading-relaxed max-w-xl mx-auto mb-8">
          Start by creating your profile and joining the community intentionally.
        </p>
        <Link to="/register">
          <Button variant="gold" size="lg">
            Register
          </Button>
        </Link>
      </div>
    </section>
  );
}

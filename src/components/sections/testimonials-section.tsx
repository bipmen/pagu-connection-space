import { Quote } from "lucide-react";

const stories = [
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

export function TestimonialsSection() {
  return (
    <section className="px-5 lg:px-8 max-w-7xl mx-auto py-20 md:py-28">
      <div className="max-w-2xl mb-12">
        <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Stories</p>
        <h2 className="font-display text-4xl md:text-5xl text-balance leading-tight">
          Real encounters from <em className="text-gold not-italic">our community.</em>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {stories.map((s, i) => (
          <article
            key={i}
            className="relative rounded-2xl bg-card border border-border/60 p-6 md:p-7 shadow-soft hover:border-gold/40 transition-colors"
          >
            <Quote className="h-7 w-7 text-gold/70 mb-4" />
            <p className="text-sm md:text-[15px] text-foreground/90 leading-relaxed mb-6">{s.text}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.by}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

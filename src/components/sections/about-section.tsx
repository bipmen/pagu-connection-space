import portrait from "@/assets/pagu-portrait.jpg";

export function AboutSection() {
  return (
    <section id="about" className="px-5 lg:px-8 max-w-4xl mx-auto pt-16 pb-24">
      <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">About</p>
      <h1 className="font-display text-5xl md:text-6xl text-balance mb-6">
        Building FLINTA* community beyond algorithms.
      </h1>
      <p className="text-lg text-muted-foreground text-balance leading-relaxed mb-8">
        Pagu is a FLINTA*-led collective in Cologne creating intentional spaces for connection
        through curated events, meaningful conversations, and community experiences.
      </p>
      <p className="text-base text-muted-foreground leading-relaxed mb-12 max-w-2xl">
        In a world dominated by swipes and algorithms, meeting people can feel transactional and exhausting.
        Pagu exists to bring connection back into the real world. Through events like Sync Up!, we create spaces
        where FLINTA* people can meet intentionally — whether for friendship, creative collaboration, queer community, or romance.
        Because meaningful encounters deserve the right conditions.
      </p>

      <div className="grid md:grid-cols-2 gap-10 items-center bg-card/50 border border-border/60 rounded-3xl p-6 md:p-10">
        <img src={portrait} alt="Patrícia Galvão (Pagu)" className="rounded-2xl w-full h-auto" loading="lazy" width={768} height={1024} />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Why the name</p>
          <h2 className="font-display text-3xl mb-4">Pagu</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Inspired by Patrícia Galvão (nicknamed Pagu), a Brazilian modernist writer and activist who challenged
            social norms and championed cultural freedom. The first woman to be arrested for political reasons in Brazil.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Her spirit of curiosity and rebellion reflects the values behind this collective: creating spaces where people
            can meet openly, question expectations, and imagine new forms of connection.
          </p>
        </div>
      </div>
    </section>
  );
}

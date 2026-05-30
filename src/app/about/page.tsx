import type { Metadata } from "next";
import portrait from "@/assets/pagu-portrait.jpg";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About - Pagu",
  description:
    "Pagu is a FLINTA*-led collective in Cologne creating intentional spaces for connection.",
  openGraph: {
    title: "About Pagu",
    description: "Building FLINTA* community beyond algorithms.",
  },
};

export default function AboutPage() {
  const portraitSrc = typeof portrait === "string" ? portrait : portrait.src;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-5 pb-24 pt-16 lg:px-8">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">About</p>
          <h1 className="mb-6 text-balance font-display text-5xl md:text-6xl">
            Building FLINTA* community beyond algorithms.
          </h1>
          <p className="mb-8 text-balance text-lg leading-relaxed text-muted-foreground">
            Pagu is a FLINTA*-led collective in Cologne creating intentional spaces for connection
            through curated events, meaningful conversations, and community experiences.
          </p>
          <p className="mb-12 max-w-2xl text-base leading-relaxed text-muted-foreground">
            In a world dominated by swipes and algorithms, meeting people can feel transactional and
            exhausting. Pagu exists to bring connection back into the real world. Through events like
            Sync Up!, we create spaces where FLINTA* people can meet intentionally, whether for
            friendship, creative collaboration, queer community, or romance. Because meaningful
            encounters deserve the right conditions.
          </p>

          <div className="grid items-center gap-10 rounded-3xl border border-border/60 bg-card/50 p-6 md:grid-cols-2 md:p-10">
            <img
              src={portraitSrc}
              alt="Patricia Galvao (Pagu)"
              className="h-auto w-full rounded-2xl"
              loading="lazy"
              width={768}
              height={1024}
            />
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gold">Why the name</p>
              <h2 className="mb-4 font-display text-3xl">Pagu</h2>
              <p className="mb-4 leading-relaxed text-muted-foreground">
                Inspired by Patricia Galvao, nicknamed Pagu, a Brazilian modernist writer and
                activist who challenged social norms and championed cultural freedom. The first
                woman to be arrested for political reasons in Brazil.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Her spirit of curiosity and rebellion reflects the values behind this collective:
                creating spaces where people can meet openly, question expectations, and imagine
                new forms of connection.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

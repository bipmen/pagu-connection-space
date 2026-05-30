import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Heart, Sparkles, Users, Lock, ArrowUp } from "lucide-react";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Legal & Trust Center — Pagu" },
      {
        name: "description",
        content:
          "Pagu's commitment to safety, privacy, inclusion, and community care. Read our privacy policy, community guidelines, and trust standards.",
      },
      { property: "og:title", content: "Legal & Trust Center — Pagu" },
      {
        property: "og:description",
        content:
          "Our community promise: safety, consent, belonging, and transparency for the FLINTA* community.",
      },
    ],
  }),
  component: LegalPage,
});

type Section = { id: string; title: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    id: "about",
    title: "About Pagu",
    body: (
      <>
        <p>
          Pagu is a community platform designed to help FLINTA* people (women, lesbians,
          intersex, non-binary, trans, and agender people) build meaningful local connections
          through events, trusted spaces, and community participation.
        </p>
        <p>By using Pagu, you agree to the policies below.</p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    body: (
      <>
        <p>We collect only the information necessary to provide and improve Pagu.</p>
        <p className="font-medium text-foreground">Information we may collect includes:</p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Profile information</li>
          <li>City and location preferences</li>
          <li>Event participation</li>
          <li>Messages and interactions within the platform</li>
          <li>Technical and usage data</li>
        </ul>
        <p className="font-medium text-foreground">We use this information to:</p>
        <ul>
          <li>Create and manage your account</li>
          <li>Facilitate community connections</li>
          <li>Improve safety and moderation</li>
          <li>Provide platform functionality</li>
          <li>Communicate important updates</li>
        </ul>
        <p>We do not sell personal data.</p>
        <p>
          We may share information with service providers necessary to operate the platform,
          comply with legal obligations, or investigate safety concerns.
        </p>
        <p>
          Users may request access, correction, or deletion of their personal information by
          contacting Pagu.
        </p>
      </>
    ),
  },
  {
    id: "safety-hub",
    title: "Privacy & Safety Hub",
    body: (
      <>
        <p>Pagu is built around safety, consent, and community care.</p>
        <p className="font-medium text-foreground">To support a safer experience, we provide:</p>
        <ul>
          <li>Profile review and approval processes</li>
          <li>Community reporting tools</li>
          <li>User blocking functionality</li>
          <li>Event moderation tools</li>
          <li>Safe Space verification programs</li>
          <li>Community guidelines enforcement</li>
        </ul>
        <p>
          Users are encouraged to report behavior that makes them feel unsafe or violates our
          guidelines.
        </p>
      </>
    ),
  },
  {
    id: "terms",
    title: "Terms of Service",
    body: (
      <>
        <p className="font-medium text-foreground">By using Pagu, you agree to:</p>
        <ul>
          <li>Provide accurate account information</li>
          <li>Respect community guidelines</li>
          <li>Use the platform lawfully</li>
          <li>Respect the privacy and consent of others</li>
        </ul>
        <p className="font-medium text-foreground">You may not:</p>
        <ul>
          <li>Harass, threaten, or discriminate against others</li>
          <li>Create fake accounts</li>
          <li>Share harmful, illegal, or abusive content</li>
          <li>Misuse community features</li>
          <li>Attempt to bypass moderation or safety systems</li>
        </ul>
        <p>
          Pagu reserves the right to suspend or remove accounts, events, content, or access to
          the platform when these terms or community guidelines are violated.
        </p>
        <p>
          Pagu is not responsible for the conduct of individual users during online or offline
          interactions.
        </p>
      </>
    ),
  },
  {
    id: "guidelines",
    title: "Community Guidelines",
    body: (
      <>
        <p>Pagu exists to foster meaningful and respectful community connections.</p>
        <p className="font-medium text-foreground">We expect all members to:</p>
        <ul>
          <li>Treat others with respect</li>
          <li>Practice consent in all interactions</li>
          <li>Support an inclusive environment</li>
          <li>Respect boundaries</li>
          <li>Communicate honestly and respectfully</li>
        </ul>
        <p className="font-medium text-foreground">The following behavior is not allowed:</p>
        <ul>
          <li>Harassment</li>
          <li>Hate speech</li>
          <li>Discrimination</li>
          <li>Bullying</li>
          <li>Stalking</li>
          <li>Non-consensual contact</li>
          <li>Threats or intimidation</li>
          <li>Sharing private information without permission</li>
          <li>Sexual misconduct</li>
        </ul>
        <p>Repeated or severe violations may result in permanent removal from the platform.</p>
      </>
    ),
  },
  {
    id: "child-safety",
    title: "Child Safety & CSAM Policy",
    body: (
      <>
        <p>Pagu is intended only for individuals who are at least 18 years old.</p>
        <p className="font-medium text-foreground">We do not permit:</p>
        <ul>
          <li>Child sexual abuse material (CSAM)</li>
          <li>Sexual exploitation of minors</li>
          <li>Grooming behavior</li>
          <li>Any content involving minors in sexual contexts</li>
        </ul>
        <p>
          Any such content or behavior will be removed immediately and may be reported to
          relevant authorities.
        </p>
        <p>Accounts involved in these activities will be permanently banned.</p>
      </>
    ),
  },
  {
    id: "privacy-choices",
    title: "Your Privacy Choices",
    body: (
      <>
        <p className="font-medium text-foreground">You may:</p>
        <ul>
          <li>Update your profile information</li>
          <li>Modify visibility settings</li>
          <li>Become visible or invisible in community discovery features</li>
          <li>Request account deletion</li>
          <li>Request access to your personal data</li>
        </ul>
        <p>
          To exercise privacy rights, contact Pagu through the contact information provided on
          the platform.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    body: (
      <>
        <p className="font-medium text-foreground">Pagu uses cookies and similar technologies to:</p>
        <ul>
          <li>Keep users logged in</li>
          <li>Remember preferences</li>
          <li>Improve performance</li>
          <li>Understand platform usage</li>
          <li>Enhance security</li>
        </ul>
        <p>Users may control cookies through their browser settings.</p>
        <p>Some platform functionality may not work correctly if cookies are disabled.</p>
      </>
    ),
  },
  {
    id: "reporting",
    title: "Reporting Concerns",
    body: (
      <>
        <p>
          If you experience or witness behavior that violates our policies, please use the
          reporting tools available on the platform or contact the Pagu team.
        </p>
        <p>
          We review reports carefully and take appropriate action to protect the community.
        </p>
      </>
    ),
  },
  {
    id: "safe-space",
    title: "Safe Space Program",
    body: (
      <>
        <p>
          Businesses and venues displaying the Pagu Safe Space badge have completed Pagu's Safe
          Space training process.
        </p>
        <p className="font-medium text-foreground">Certification indicates that the venue has committed to:</p>
        <ul>
          <li>Inclusion</li>
          <li>Respect</li>
          <li>Community safety</li>
          <li>Anti-discrimination practices</li>
        </ul>
        <p>
          Certification may be renewed, suspended, or revoked based on community feedback,
          policy compliance, and participation in the program.
        </p>
      </>
    ),
  },
  {
    id: "commitment",
    title: "Our Commitment",
    body: (
      <>
        <p>
          Pagu's mission is to strengthen local community, belonging, and connection for FLINTA*
          people.
        </p>
        <p>
          We believe that trusted spaces, meaningful experiences, and respectful relationships
          create stronger communities for everyone.
        </p>
      </>
    ),
  },
];

function LegalPage() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(100, (scrolled / max) * 100) : 0);
      setShowTop(scrolled > 600);

      // Active section detection
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) current = s.id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Reading progress */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent pointer-events-none"
        aria-hidden
      >
        <div
          className="h-full bg-gradient-to-r from-primary to-gold transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-gold/10 pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-5 lg:px-8 py-16 lg:py-24 text-center space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs text-gold">
              <ShieldCheck className="h-3.5 w-3.5" /> A community promise
            </div>
            <h1 className="font-display text-4xl md:text-6xl tracking-tight">
              Legal & Trust Center
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our commitment to safety, privacy, inclusion, and community care.
            </p>
            <p className="text-sm text-muted-foreground/90 max-w-2xl mx-auto">
              Pagu is built around trust, belonging, and meaningful local connections. This page
              explains how we protect our community and what we expect from members and
              partners.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-3">
              {[
                { icon: ShieldCheck, label: "Safety" },
                { icon: Lock, label: "Consent" },
                { icon: Heart, label: "Belonging" },
                { icon: Users, label: "Community" },
                { icon: Sparkles, label: "Transparency" },
              ].map((p) => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs text-muted-foreground"
                >
                  <p.icon className="h-3.5 w-3.5 text-gold" /> {p.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 lg:px-8 py-10 lg:py-14 grid lg:grid-cols-[240px_1fr] gap-10">
          {/* Sticky TOC (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                On this page
              </h2>
              <nav className="flex flex-col gap-1 text-sm">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`text-left rounded-md px-3 py-1.5 transition-colors border-l-2 ${
                      activeId === s.id
                        ? "border-gold text-foreground bg-gold/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0">
            {/* Mobile: accordion */}
            <div className="lg:hidden">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                On this page
              </h2>
              <Accordion type="multiple" className="space-y-2">
                {SECTIONS.map((s) => (
                  <AccordionItem
                    key={s.id}
                    value={s.id}
                    id={s.id}
                    className="border border-border/60 rounded-xl px-4 bg-card scroll-mt-24"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium">{s.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose-pagu text-sm text-muted-foreground space-y-3">
                        {s.body}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Desktop: stacked sections */}
            <div className="hidden lg:block space-y-14">
              {SECTIONS.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-24 border-b border-border/40 pb-10 last:border-0"
                >
                  <h2 className="font-display text-2xl md:text-3xl mb-4">{s.title}</h2>
                  <div className="prose-pagu text-[15px] leading-relaxed text-muted-foreground space-y-4">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 to-primary/5 p-6 text-center space-y-2">
              <ShieldCheck className="h-6 w-6 text-gold mx-auto" />
              <p className="font-medium">A community built on trust.</p>
              <p className="text-sm text-muted-foreground">
                Consent, respect, and inclusion are expected at all times.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Back to top */}
      {showTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          variant="outlineGold"
          size="icon"
          aria-label="Back to top"
          className="fixed bottom-24 md:bottom-8 right-5 z-40 rounded-full shadow-glow"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      <Footer />

      <style>{`
        .prose-pagu ul { list-style: disc; padding-left: 1.25rem; }
        .prose-pagu ul li { margin: 0.25rem 0; }
        .prose-pagu p + p { margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}

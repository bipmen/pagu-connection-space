import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Pagu" },
      {
        name: "description",
        content:
          "Pagu Events — curated Local Events and member-led Community Events for FLINTA* people.",
      },
      { property: "og:title", content: "Events — Pagu" },
      {
        property: "og:description",
        content: "Curated Local Events and member-led Community Events.",
      },
    ],
  }),
  component: EventsLayout,
});

const tabs = [
  { to: "/events/local", label: "Local Events", hint: "Curated by Pagu" },
  {
    to: "/events/community",
    label: "Community Events",
    hint: "Member-led",
  },
] as const;

function EventsLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Parent header + sub-tabs */}
        <div className="border-b border-border/60 bg-card/30">
          <div className="max-w-6xl mx-auto w-full px-5 lg:px-8 pt-10 pb-0">
            <p className="text-xs uppercase tracking-[0.25em] text-gold mb-2">
              Sync Up!
            </p>
            <h1 className="font-display text-3xl md:text-4xl leading-tight">
              What's happening
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Two ways to find your people: curated picks from Pagu and our
              partners, or events created by members of the community.
            </p>

            <nav
              role="tablist"
              aria-label="Events sections"
              className="mt-6 -mb-px flex gap-1 overflow-x-auto"
            >
              {tabs.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  role="tab"
                  className="group relative px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                  activeProps={{
                    className:
                      "text-foreground after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-gold",
                  }}
                >
                  <span className="block leading-tight">{t.label}</span>
                  <span className="block text-[10px] uppercase tracking-widest text-muted-foreground/70 group-hover:text-muted-foreground">
                    {t.hint}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full px-5 lg:px-8 py-8 md:py-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

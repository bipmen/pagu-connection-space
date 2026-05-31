import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-display text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-medium text-gold-foreground hover:brightness-105 transition"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pagu — FLINTA* community in Cologne" },
      { name: "description", content: "A FLINTA*-led collective creating intentional spaces for connection through curated events." },
      { name: "author", content: "Pagu Collective" },
      { property: "og:title", content: "Pagu — FLINTA* community in Cologne" },
      { property: "og:description", content: "A FLINTA*-led collective creating intentional spaces for connection through curated events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Pagu — FLINTA* community in Cologne" },
      { name: "twitter:description", content: "A FLINTA*-led collective creating intentional spaces for connection through curated events." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c0a25b3b-f0c2-4231-bb0c-6025059cc265/id-preview-64db3434--a657d23b-e477-40d1-a38b-e0fa53b23d87.lovable.app-1780086019521.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c0a25b3b-f0c2-4231-bb0c-6025059cc265/id-preview-64db3434--a657d23b-e477-40d1-a38b-e0fa53b23d87.lovable.app-1780086019521.png" },
    ],
    links: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}

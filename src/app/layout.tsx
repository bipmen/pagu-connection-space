import type { Metadata } from "next";
import "@/styles.css";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "Pagu - FLINTA* community in Cologne",
  description:
    "A FLINTA*-led collective creating intentional spaces for connection through curated events.",
  authors: [{ name: "Pagu Collective" }],
  openGraph: {
    title: "Pagu - Connection beyond algorithms",
    description: "FLINTA* community in Cologne.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

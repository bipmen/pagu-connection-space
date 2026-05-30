import type { ReactNode } from "react";
import { Instagram } from "lucide-react";
import logo from "@/assets/pagu-logo.webp";
import { footerLinks } from "@/components/shell/navigation";
import { getAssetSrc } from "@/lib/asset-src";

type ShellLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export function FooterShell({
  LinkComponent,
}: {
  LinkComponent: (props: ShellLinkProps) => ReactNode;
}) {
  const logoSrc = getAssetSrc(logo);

  return (
    <footer className="mt-24 border-t border-border/60 pb-32 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <LinkComponent to="/" ariaLabel="Pagu - home" className="inline-flex items-center">
            <img src={logoSrc} alt="Pagu" className="h-14 w-auto rounded" width={56} height={67} />
          </LinkComponent>
          <p className="max-w-xs text-sm text-muted-foreground">
            A FLINTA*-led collective in Cologne creating intentional spaces for connection.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Explore</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <LinkComponent to={link.to} className="transition-colors hover:text-gold">
                  {link.label}
                </LinkComponent>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Follow</h4>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-gold"
          >
            <Instagram className="h-4 w-4" /> @pagu.cologne
          </a>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row lg:px-8">
          <span>&copy; {new Date().getFullYear()} Pagu Collective - Cologne</span>
          <span>Made with care for FLINTA* community</span>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import logo from "@/assets/pagu-logo.webp";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-24 pb-32 md:pb-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-12 grid gap-10 md:grid-cols-3">
        <div className="space-y-3">
          <Link to="/" aria-label="Pagu — home" className="inline-flex items-center">
            <img src={logo} alt="Pagu" className="h-14 w-auto rounded" width={56} height={67} />
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            A FLINTA*-led collective in Cologne creating intentional spaces for connection.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-gold transition-colors">About</Link></li>
            <li><Link to="/events" className="hover:text-gold transition-colors">Events</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            <li><Link to="/register" className="hover:text-gold transition-colors">Register</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Follow</h4>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground hover:text-gold transition-colors"
          >
            <Instagram className="h-4 w-4" /> @pagu.cologne
          </a>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Pagu Collective · Cologne</span>
          <span>Made with care for FLINTA* community</span>
        </div>
      </div>
    </footer>
  );
}

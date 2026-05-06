import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import logo from "@/assets/pagu-logo.webp";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <Link to="/" aria-label="Pagu — home" className="flex items-center">
            <img
              src={logo}
              alt="Pagu"
              className="h-11 lg:h-14 w-auto rounded"
              width={56}
              height={56}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/login" className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground px-3 py-2">
              Login
            </Link>
            <Button asChild variant="hero" size="default" className="hidden sm:inline-flex rounded-full">
              <Link to="/register">Register</Link>
            </Button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden h-10 w-10 rounded-full flex items-center justify-center hover:bg-accent text-foreground"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <nav className="px-5 py-4 flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-lg text-foreground hover:bg-accent text-base"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-lg text-foreground hover:bg-accent text-base sm:hidden"
              >
                Login
              </Link>
              <Button asChild variant="hero" size="lg" className="mt-2 sm:hidden">
                <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Mobile sticky bottom CTA */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <Button asChild variant="hero" size="lg" className="w-full shadow-glow">
          <Link to="/register">Join the community</Link>
        </Button>
      </div>
    </>
  );
}

import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Moon, Sun, LogOut, User } from "lucide-react";
import logo from "@/assets/pagu-logo.webp";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useCurrentUser, signOut } from "@/lib/session-mock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavLink = { to: string; label: string; hash?: string };

const publicLinks: NavLink[] = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/", hash: "events", label: "Sync Up!" },
];

const memberLinks: NavLink[] = [
  { to: "/profile", label: "Profile" },
  { to: "/community-map", label: "Community Map" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
];



export function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const user = useCurrentUser();
  const navigate = useNavigate();
  const links = user ? memberLinks : publicLinks;

  function handleLogout() {
    signOut();
    setOpen(false);
    navigate({ to: "/" });
  }

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
            {links.map((l) =>
              l.hash ? (
                <a
                  key={`${l.to}#${l.hash}`}
                  href={`${l.to}#${l.hash}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.to}
                  to={l.to as never}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  activeProps={{ className: "text-foreground" }}
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                    aria-label="Account"
                  >
                    <User className="h-4 w-4 text-gold" />
                    <span className="max-w-[7rem] truncate">{user.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/community-map">Community Map</Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>

              </DropdownMenu>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground px-3 py-2">
                  Login
                </Link>
                <Button asChild variant="hero" size="default" className="hidden sm:inline-flex rounded-full">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
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
              {links.map((l) =>
                l.hash ? (
                  <a
                    key={`${l.to}#${l.hash}`}
                    href={`${l.to}#${l.hash}`}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 rounded-lg text-foreground hover:bg-accent text-base"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={l.to}
                    to={l.to as never}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 rounded-lg text-foreground hover:bg-accent text-base"
                  >
                    {l.label}
                  </Link>
                ),
              )}
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-3 rounded-lg text-foreground hover:bg-accent text-base text-left inline-flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile sticky bottom CTA — hide once logged in */}
      {!user && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
          <Button asChild variant="hero" size="lg" className="w-full shadow-glow">
            <Link to="/register">Join the community</Link>
          </Button>
        </div>
      )}
    </>
  );
}

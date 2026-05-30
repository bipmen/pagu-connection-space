"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import logo from "@/assets/pagu-logo.webp";
import { navLinks } from "@/components/shell/navigation";
import { useTheme } from "@/components/theme-provider";
import { buttonVariants } from "@/components/ui/button";
import { getAssetSrc } from "@/lib/asset-src";
import { cn } from "@/lib/utils";

export type ShellLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export type HeaderShellProps = {
  LinkComponent: (props: ShellLinkProps) => ReactNode;
  pathname?: string;
};

export function HeaderShell({ LinkComponent, pathname }: HeaderShellProps) {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const logoSrc = getAssetSrc(logo);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-20 lg:px-8">
          <LinkComponent to="/" ariaLabel="Pagu - home" className="flex items-center">
            <img
              src={logoSrc}
              alt="Pagu"
              className="h-11 w-auto rounded lg:h-14"
              width={56}
              height={56}
            />
          </LinkComponent>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <LinkComponent
                key={link.to}
                to={link.to}
                className={cn(
                  "text-sm transition-colors",
                  pathname === link.to
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </LinkComponent>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <LinkComponent
              to="/login"
              className="hidden px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline-flex"
            >
              Login
            </LinkComponent>
            <LinkComponent
              to="/register"
              className={cn(
                buttonVariants({ variant: "hero", size: "default" }),
                "hidden rounded-full sm:inline-flex",
              )}
            >
              Register
            </LinkComponent>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent md:hidden"
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => (
                <LinkComponent
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base text-foreground hover:bg-accent"
                >
                  {link.label}
                </LinkComponent>
              ))}
              <LinkComponent
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-foreground hover:bg-accent sm:hidden"
              >
                Login
              </LinkComponent>
              <LinkComponent
                to="/register"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "hero", size: "lg" }), "mt-2 sm:hidden")}
              >
                Register
              </LinkComponent>
            </nav>
          </div>
        )}
      </header>

      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
        <LinkComponent
          to="/register"
          className={cn(buttonVariants({ variant: "hero", size: "lg" }), "w-full shadow-glow")}
        >
          Join the community
        </LinkComponent>
      </div>
    </>
  );
}

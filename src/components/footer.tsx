import { Link } from "@tanstack/react-router";
import { FooterShell } from "@/components/shell/footer-shell";
import type { ShellLinkProps } from "@/components/shell/header-shell";

export function Footer() {
  return <FooterShell LinkComponent={TanStackShellLink} />;
}

function TanStackShellLink({ to, children, className, onClick, ariaLabel }: ShellLinkProps) {
  return (
    <Link to={to} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

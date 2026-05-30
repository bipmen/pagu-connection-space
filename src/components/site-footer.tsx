import Link from "next/link";
import { FooterShell } from "@/components/shell/footer-shell";
import type { ShellLinkProps } from "@/components/shell/header-shell";

export function SiteFooter() {
  return <FooterShell LinkComponent={NextShellLink} />;
}

function NextShellLink({ to, children, className, onClick, ariaLabel }: ShellLinkProps) {
  return (
    <Link href={to} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

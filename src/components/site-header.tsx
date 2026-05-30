"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderShell, type ShellLinkProps } from "@/components/shell/header-shell";

export function SiteHeader() {
  const pathname = usePathname();

  return <HeaderShell LinkComponent={NextShellLink} pathname={pathname} />;
}

function NextShellLink({ to, children, className, onClick, ariaLabel }: ShellLinkProps) {
  return (
    <Link href={to} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

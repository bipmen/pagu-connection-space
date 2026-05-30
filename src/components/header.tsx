import { Link, useRouterState } from "@tanstack/react-router";
import { HeaderShell, type ShellLinkProps } from "@/components/shell/header-shell";

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return <HeaderShell LinkComponent={TanStackShellLink} pathname={pathname} />;
}

function TanStackShellLink({ to, children, className, onClick, ariaLabel }: ShellLinkProps) {
  return (
    <Link to={to} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

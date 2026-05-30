import { Link } from "@tanstack/react-router";
import { VerifyStepShell, type VerifyStepShellProps } from "@/components/auth/verify-step-shell";

export function VerifyStep(props: Omit<VerifyStepShellProps, "SupportLinkComponent">) {
  return <VerifyStepShell {...props} SupportLinkComponent={TanStackSupportLink} />;
}

function TanStackSupportLink({ to, className, children }: SupportLinkProps) {
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

type SupportLinkProps = {
  to: string;
  className?: string;
  children: React.ReactNode;
};

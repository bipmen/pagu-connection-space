import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock3, HelpCircle, Mail } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type ApprovalStatus = "pending" | "approved" | "rejected" | "expired" | "needs_more_info";

const statusContent: Record<
  ApprovalStatus,
  {
    eyebrow: string;
    title: string;
    description: string;
    detail: string;
    icon: typeof Clock3;
    primaryHref: string;
    primaryLabel: string;
  }
> = {
  pending: {
    eyebrow: "Approval pending",
    title: "Your registration is waiting for approval",
    description:
      "We have your request. The member you listed as your referral needs to approve it before access can continue.",
    detail:
      "We will contact you by email once your referral responds. This approval link is intended to stay open for a limited time only.",
    icon: Clock3,
    primaryHref: "/",
    primaryLabel: "Back to homepage",
  },
  approved: {
    eyebrow: "Approved",
    title: "Your registration was approved",
    description:
      "Your referral approved the request. You can now continue into the member experience.",
    detail:
      "This placeholder route will later be wired to real auth and membership state. For now it simply confirms the route exists.",
    icon: CheckCircle2,
    primaryHref: "/profile",
    primaryLabel: "Go to profile",
  },
  rejected: {
    eyebrow: "Not approved",
    title: "This registration was not approved",
    description:
      "The referral connected to this request did not approve the registration, so access cannot continue from this request.",
    detail:
      "If you think this was a mistake, contact support or submit a new registration with a different approved referral.",
    icon: AlertCircle,
    primaryHref: "/support-login",
    primaryLabel: "Contact support",
  },
  expired: {
    eyebrow: "Request expired",
    title: "This approval request has expired",
    description:
      "The referral approval window closed before a response was recorded, so this request is no longer active.",
    detail:
      "You can start over with a new referral request or contact support if you need help understanding what happened.",
    icon: Mail,
    primaryHref: "/register",
    primaryLabel: "Register again",
  },
  needs_more_info: {
    eyebrow: "More information needed",
    title: "We need more information before approval",
    description:
      "Your request cannot move forward until a follow-up detail is clarified with the team.",
    detail:
      "This placeholder state gives the backend and frontend a stable route target for the later membership workflow.",
    icon: HelpCircle,
    primaryHref: "/support-login",
    primaryLabel: "Send a message",
  },
};

function getStatus(value: string | null): ApprovalStatus {
  if (value === "approved") return "approved";
  if (value === "rejected") return "rejected";
  if (value === "expired") return "expired";
  if (value === "needs_more_info") return "needs_more_info";
  return "pending";
}

export function PendingPage({
  status,
}: {
  status?: string | string[];
}) {
  const normalizedStatus = Array.isArray(status) ? status[0] : status ?? null;
  const statusValue = getStatus(normalizedStatus);
  const content = statusContent[statusValue];
  const Icon = content.icon;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-20">
        <div className="w-full max-w-2xl">
          <div className="rounded-[2rem] border border-border/60 bg-card p-8 shadow-soft md:p-10">
            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Icon className="h-6 w-6" />
            </div>

            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold">{content.eyebrow}</p>
            <h1 className="mb-4 font-display text-4xl leading-tight md:text-5xl">
              {content.title}
            </h1>
            <p className="mb-4 max-w-xl text-base leading-relaxed text-foreground/90">
              {content.description}
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {content.detail}
            </p>

            <div className="mt-8 rounded-2xl border border-gold/20 bg-primary/10 p-4 text-sm leading-relaxed text-muted-foreground">
              Phase 1 status handling expected by the spec: <span className="text-foreground">pending</span>,{" "}
              <span className="text-foreground">approved</span>,{" "}
              <span className="text-foreground">rejected</span>,{" "}
              <span className="text-foreground">expired</span>, and{" "}
              <span className="text-foreground">needs_more_info</span>.
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link href={content.primaryHref}>{content.primaryLabel}</Link>
              </Button>
              <Button asChild variant="outlineGold" size="lg">
                <Link href="/support-login">Contact support</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

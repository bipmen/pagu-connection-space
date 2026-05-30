import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy route — Community Events now live under /events/community
export const Route = createFileRoute("/community-events/")({
  beforeLoad: () => {
    throw redirect({ to: "/events/community" });
  },
});

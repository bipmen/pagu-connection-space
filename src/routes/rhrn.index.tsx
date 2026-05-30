import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/rhrn/")({
  beforeLoad: () => {
    throw redirect({ to: "/community-map" });
  },
});

import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/discover/")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: () => <Navigate to="/community-map" replace />,
});

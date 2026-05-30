import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/community-map/apply")({
  component: () => <Navigate to="/discover/apply" replace />,
});

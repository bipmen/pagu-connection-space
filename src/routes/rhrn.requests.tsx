import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCurrentUser } from "@/lib/session-mock";
import { respondToRequest, useIncomingRequests } from "@/lib/rhrn-mock";
import { GoInvisibleFab } from "@/components/rhrn/invisible-button";

export const Route = createFileRoute("/rhrn/requests")({
  head: () => ({ meta: [{ title: "Connection Requests — Pagu" }, { name: "robots", content: "noindex" }] }),
  component: RequestsPage,
});

function RequestsPage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const requests = useIncomingRequests(user?.id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-2xl px-5 py-8 space-y-4">
        <Link to="/rhrn" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-2xl font-semibold">Connection requests</h1>

        {!user ? (
          <p className="text-muted-foreground">Sign in to see requests.</p>
        ) : requests.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">No requests yet.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.fromName}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm rounded-lg bg-secondary/60 px-3 py-2">"{r.icebreaker}"</p>
                  {r.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => {
                          respondToRequest(r.id, "accepted");
                          navigate({ to: "/rhrn/chat/$id", params: { id: [r.fromUserId, r.toUserId].sort().join(":") } });
                        }}
                      >
                        Accept
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => respondToRequest(r.id, "declined")}>Decline</Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground capitalize">{r.status}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <GoInvisibleFab />
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Inbox } from "lucide-react";
import { useCurrentUser } from "@/lib/session-mock";
import { respondToRequest, useChats, useIncomingRequests } from "@/lib/rhrn-mock";

export const Route = createFileRoute("/rhrn/chats")({
  head: () => ({ meta: [{ title: "Conversations — Pagu" }, { name: "robots", content: "noindex" }] }),
  component: ChatsList,
});

function ChatsList() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const chats = useChats(user?.id);
  const requests = useIncomingRequests(user?.id);
  const pending = requests.filter((r) => r.status === "pending");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-2xl px-5 py-8 space-y-6">
        <Link to="/rhrn" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-2xl font-semibold">Conversations</h1>

        {!user ? (
          <p className="text-muted-foreground">Sign in to see your conversations.</p>
        ) : (
          <>
            {pending.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Inbox className="h-4 w-4 text-gold" /> Requests ({pending.length})
                </h2>
                <div className="space-y-3">
                  {pending.map((r) => (
                    <Card key={r.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{r.fromName}</span>
                          <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm rounded-lg bg-secondary/60 px-3 py-2">"{r.icebreaker}"</p>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-3">
              {pending.length > 0 && (
                <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-gold" /> Chats
                </h2>
              )}
              {chats.length === 0 ? (
                <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">No conversations yet. Accepted requests appear here.</CardContent></Card>
              ) : (
                <div className="space-y-2">
                  {chats.map((c) => {
                    const otherId = c.participantIds.find((x) => x !== user.id)!;
                    const otherName = c.participantNames[otherId] || "Member";
                    return (
                      <Link
                        key={c.id}
                        to="/rhrn/chat/$id"
                        params={{ id: c.id }}
                        className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 hover:bg-accent transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 text-gold" />
                        <span className="font-medium">{otherName}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

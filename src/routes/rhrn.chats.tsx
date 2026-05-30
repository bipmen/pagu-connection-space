import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useCurrentUser } from "@/lib/session-mock";
import { useChats } from "@/lib/rhrn-mock";

export const Route = createFileRoute("/rhrn/chats")({
  head: () => ({ meta: [{ title: "Chats — Pagu" }, { name: "robots", content: "noindex" }] }),
  component: ChatsList,
});

function ChatsList() {
  const user = useCurrentUser();
  const chats = useChats(user?.id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-2xl px-5 py-8 space-y-4">
        <Link to="/rhrn" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-2xl font-semibold">Chats</h1>
        {!user ? (
          <p className="text-muted-foreground">Sign in to see chats.</p>
        ) : chats.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">No chats yet. Accepted requests appear here.</CardContent></Card>
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
      </main>
      <Footer />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { useCurrentUser } from "@/lib/session-mock";
import { getChat, sendMessage, useChatMessages } from "@/lib/rhrn-mock";

export const Route = createFileRoute("/rhrn/chat/$id")({
  head: () => ({ meta: [{ title: "Chat — Pagu" }, { name: "robots", content: "noindex" }] }),
  component: ChatRoom,
});

function ChatRoom() {
  const { id } = Route.useParams();
  const user = useCurrentUser();
  const chat = getChat(id);
  const messages = useChatMessages(id);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  if (!user) return <div className="p-8 text-center text-muted-foreground">Sign in.</div>;
  if (!chat) return <div className="p-8 text-center text-muted-foreground">Chat not found.</div>;

  const otherId = chat.participantIds.find((x) => x !== user.id)!;
  const otherName = chat.participantNames[otherId] || "Member";

  function send() {
    const v = text.trim();
    if (!v) return;
    sendMessage(id, user.id, v);
    setText("");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="border-b border-border/50 px-5 py-3 flex items-center gap-3">
        <Link to="/rhrn/chats" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></Link>
        <span className="font-medium">{otherName}</span>
      </div>
      <main ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {messages.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-8">Say hi.</p>
        )}
        {messages.map((m) => {
          const mine = m.fromUserId === user.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-gold text-gold-foreground" : "bg-secondary"}`}>
                {m.text}
                <div className={`text-[10px] mt-0.5 opacity-70 ${mine ? "text-right" : ""}`}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {mine && " · Sent"}
                </div>
              </div>
            </div>
          );
        })}
      </main>
      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="border-t border-border/50 px-5 py-3 flex gap-2 bg-background"
      >
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" maxLength={1000} />
        <Button type="submit" variant="hero" size="icon" disabled={!text.trim()}><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
}

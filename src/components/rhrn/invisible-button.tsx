import { EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { goInvisible, useMySession } from "@/lib/rhrn-mock";
import { useCurrentUser } from "@/lib/session-mock";

/**
 * Floating "Go Invisible" emergency hide. Renders only while the current user
 * has an active availability session.
 */
export function GoInvisibleFab() {
  const user = useCurrentUser();
  const mine = useMySession(user?.id);
  if (!user || !mine) return null;
  return (
    <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40">
      <Button
        variant="destructive"
        size="lg"
        className="rounded-full shadow-glow"
        onClick={() => goInvisible(user.id)}
        aria-label="Go invisible"
      >
        <EyeOff className="h-4 w-4" /> Go Invisible
      </Button>
    </div>
  );
}

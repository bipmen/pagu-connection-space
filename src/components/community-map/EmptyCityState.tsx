import { Calendar, Shield, MailPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export function EmptyCityState({ city }: { city: string }) {
  return (
    <Card className="border-dashed border-gold/40 bg-gold/5">
      <CardContent className="p-6 sm:p-8 text-center space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-gold/20 text-gold flex items-center justify-center">
          🌱
        </div>
        <div>
          <h3 className="font-display text-2xl">Bring Pagu to {city}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            No events, Safe Spaces or available members yet. You can be the first to plant a seed for the community here.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Button asChild variant="hero" size="sm" className="rounded-full">
            <Link to="/community-events/new"><Calendar className="h-4 w-4" /> Create Event</Link>
          </Button>
          <Button asChild variant="outlineGold" size="sm" className="rounded-full">
            <Link to="/community-map/apply"><Shield className="h-4 w-4" /> Suggest Safe Space</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => toast.success(`You're on the ${city} waitlist. We'll be in touch.`)}
          >
            <MailPlus className="h-4 w-4" /> Join Waitlist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

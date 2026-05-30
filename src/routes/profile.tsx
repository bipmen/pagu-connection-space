import { useState, useCallback } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCurrentUser, updateCurrentUser } from "@/lib/session-mock";
import { getEligibility, isEligible } from "@/lib/rhrn-mock";
import { Sparkles, CheckCircle2, ArrowRight, User, MapPin, PenLine, Heart } from "lucide-react";

const INTEREST_OPTIONS = [
  "Coffee",
  "Art & Culture",
  "Music",
  "Nature & Walks",
  "Food & Cooking",
  "Books",
  "Yoga & Wellness",
  "Dancing",
  "Languages",
  "Travel",
  "Crafts",
  "Gaming",
  "Volunteering",
  "Film",
] as const;

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Complete Your Profile — Pagu" },
      { name: "description", content: "Set up your Pagu profile to unlock community features." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [interests, setInterests] = useState<Set<string>>(new Set(user?.interests ?? []));

  const toggleInterest = useCallback((interest: string) => {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) next.delete(interest);
      else next.add(interest);
      return next;
    });
  }, []);

  const profileComplete = !!(bio.trim().length > 0 && city.trim().length > 0);

  function handleSave() {
    if (!user) return;
    updateCurrentUser({
      name: name.trim() || user.name,
      city: city.trim(),
      bio: bio.trim(),
      interests: Array.from(interests),
    });
    setSaved(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-5 py-20">
          <Card className="max-w-md w-full text-center">
            <CardContent className="p-8 space-y-4">
              <h1 className="text-2xl font-semibold">Sign in first</h1>
              <p className="text-muted-foreground">You need to be logged in to complete your profile.</p>
              <Button asChild variant="hero">
                <Link to="/login">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (saved && profileComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-5 py-20">
          <Card className="max-w-md w-full text-center">
            <CardContent className="p-8 space-y-6">
              <div className="mx-auto w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-gold" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-display font-medium">Profile complete</h1>
                <p className="text-muted-foreground">You are all set to connect with the Pagu community.</p>
              </div>
              <div className="space-y-3">
                <Button asChild variant="hero" className="w-full">
                  <Link to="/rhrn">
                    Go to Right Here Right Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outlineGold" className="w-full">
                  <Link to="/community-events">Browse community events</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const eligibility = getEligibility(user);
  const rhrnUnlocked = isEligible(eligibility);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-2xl px-5 py-8 lg:py-12">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto h-px w-16 bg-gold/60 mb-6" />
            <h1 className="font-display text-3xl md:text-4xl">Complete your profile</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              A few details help the community know who you are and what you are into.
            </p>
          </div>

          {/* Progress / Status */}
          <Card className={profileComplete ? "border-gold/40" : ""}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {profileComplete ? (
                    <span className="flex items-center gap-2 text-gold">
                      <CheckCircle2 className="h-4 w-4" /> Profile ready for RHRN
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-gold" /> Finish to unlock Right Here Right Now
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {profileComplete ? "2/2" : `${bio.trim() ? 1 : 0 + city.trim() ? 1 : 0}/2`} required
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-500"
                  style={{ width: profileComplete ? "100%" : city.trim() && bio.trim() ? "100%" : city.trim() || bio.trim() ? "50%" : "0%" }}
                />
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className={`flex items-center gap-1 ${city.trim() ? "text-gold" : ""}`}>
                  <CheckCircle2 className="h-3 w-3" /> City
                </span>
                <span className={`flex items-center gap-1 ${bio.trim() ? "text-gold" : ""}`}>
                  <CheckCircle2 className="h-3 w-3" /> Bio
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-gold" /> About you
              </CardTitle>
              <CardDescription>This is what other members will see.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How should we call you?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> City <span className="text-gold">*</span>
                </Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Cologne, Berlin, Amsterdam"
                />
                <p className="text-xs text-muted-foreground">Required for Right Here Right Now.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-1">
                  <PenLine className="h-3.5 w-3.5" /> Bio <span className="text-gold">*</span>
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short sentence about you — hobbies, vibe, what brings you to Pagu..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {bio.trim().length > 0 ? `${bio.trim().length} characters` : "Required for Right Here Right Now."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Heart className="h-5 w-5 text-gold" /> Interests
              </CardTitle>
              <CardDescription>Pick what you are into. This helps others find common ground.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const active = interests.has(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? "border-gold bg-gold/10 text-foreground"
                          : "border-border/60 text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {active && <span className="mr-1">✓</span>}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="hero"
              size="lg"
              className="flex-1"
              disabled={!profileComplete}
              onClick={handleSave}
            >
              Save profile
            </Button>
            {rhrnUnlocked && (
              <Button asChild variant="outlineGold" size="lg" className="flex-1">
                <Link to="/rhrn">Back to RHRN</Link>
              </Button>
            )}
          </div>

          {saved && !profileComplete && (
            <p className="text-sm text-center text-muted-foreground">
              Saved. Add your city and bio to unlock Right Here Right Now.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

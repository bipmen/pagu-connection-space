import { useState, useCallback, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser, updateCurrentUser } from "@/lib/session-mock";
import { getEligibility, isEligible } from "@/lib/rhrn-mock";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  User,
  MapPin,
  PenLine,
  Heart,
  Cake,
  Users,
  Compass,
} from "lucide-react";

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

const GENDER_OPTIONS = [
  "Woman",
  "Non-binary",
  "Trans woman",
  "Trans man",
  "Agender",
  "Genderqueer",
  "Prefer to self-describe",
  "Prefer not to say",
] as const;

const ORIENTATION_OPTIONS = [
  "Lesbian",
  "Bisexual",
  "Pansexual",
  "Queer",
  "Asexual",
  "Questioning",
  "Prefer to self-describe",
  "Prefer not to say",
] as const;

const LOOKING_FOR_OPTIONS = [
  "Open to everyone in the community",
  "Women",
  "Non-binary people",
  "Trans people",
  "Queer people",
  "People with shared interests",
  "Prefer to decide later",
  "Prefer not to answer",
] as const;

const EXPERIENCE_OPTIONS = [
  "Romantic dates",
  "Friendships",
  "Networking",
  "Community events",
  "Creative collaborations",
  "Open to everything",
  "Still figuring it out",
  "Prefer not to answer",
] as const;

const INTERESTS_OPT_OUT = "Prefer not to choose interests right now";

export const Route = createFileRoute("/profile-setup")({
  head: () => ({
    meta: [
      { title: "Complete Your Profile — Pagu" },
      {
        name: "description",
        content: "Set up your Pagu profile to unlock community features.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<string>("");
  const [orientation, setOrientation] = useState<string>("");
  const [lookingFor, setLookingFor] = useState<Set<string>>(new Set());
  const [experience, setExperience] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from session once the user loads (useCurrentUser starts null on SSR).
  useEffect(() => {
    if (!user || hydrated) return;
    setName(user.name ?? "");
    setCity(user.city ?? "");
    setBio(user.bio ?? "");
    setInterests(new Set(user.interests ?? []));
    setBirthday(user.birthday ?? "");
    setGender(user.gender ?? "");
    setOrientation(user.orientation ?? "");
    setLookingFor(new Set(user.lookingFor ?? []));
    setExperience(new Set(user.experience ?? []));
    setHydrated(true);
  }, [user, hydrated]);

  const toggle = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const toggleInterest = useCallback(
    (v: string) => toggle(interests, v, setInterests),
    [interests],
  );

  const fieldChecks = [
    { key: "Name", done: name.trim().length > 0 },
    { key: "City", done: city.trim().length > 0 },
    { key: "Bio", done: bio.trim().length > 0 },
    { key: "Birthday", done: birthday.trim().length > 0 },
    { key: "Gender", done: gender.trim().length > 0 },
    { key: "Sexual orientation", done: orientation.trim().length > 0 },
    { key: "Who to meet", done: lookingFor.size > 0 },
    { key: "Hoping to find", done: experience.size > 0 },
    { key: "Interests", done: interests.size > 0 },
  ];
  const completedCount = fieldChecks.filter((f) => f.done).length;
  const totalFields = fieldChecks.length;
  const profileComplete = completedCount === totalFields;
  const progressPct = Math.round((completedCount / totalFields) * 100);

  function handleSave() {
    if (!user) return;
    updateCurrentUser({
      name: name.trim() || user.name,
      city: city.trim(),
      bio: bio.trim(),
      interests: Array.from(interests),
      birthday: birthday || undefined,
      gender: gender || undefined,
      orientation: orientation || undefined,
      lookingFor: Array.from(lookingFor),
      experience: Array.from(experience),
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
              <p className="text-muted-foreground">
                You need to be logged in to complete your profile.
              </p>
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
                <p className="text-muted-foreground">
                  You are all set to connect with the Pagu community.
                </p>
              </div>
              <Button asChild variant="hero" className="w-full">
                <Link to="/choose-plan">
                  Choose your plan <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
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

          {/* Progress */}
          <Card className={profileComplete ? "border-gold/40" : ""}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {profileComplete ? (
                    <span className="flex items-center gap-2 text-gold">
                      <CheckCircle2 className="h-4 w-4" /> Profile ready
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-gold" /> Finish to enter the community
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {completedCount} of {totalFields} complete
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {fieldChecks.map((f) => (
                  <span
                    key={f.key}
                    className={`flex items-center gap-1 ${f.done ? "text-gold" : ""}`}
                  >
                    <CheckCircle2 className="h-3 w-3" /> {f.key}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* About you */}
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
                  <MapPin className="h-3.5 w-3.5" /> City{" "}
                  <span className="text-gold">*</span>
                </Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Cologne, Berlin, Amsterdam"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-1">
                  <PenLine className="h-3.5 w-3.5" /> Bio{" "}
                  <span className="text-gold">*</span>
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short sentence about you — hobbies, vibe, what brings you to Pagu..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {bio.trim().length > 0
                    ? `${bio.trim().length} characters`
                    : "Required to complete your profile."}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday" className="flex items-center gap-1">
                  <Cake className="h-3.5 w-3.5" /> Birthday
                </Label>
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                />
                <p className="text-xs text-muted-foreground">
                  Only used to celebrate you — never shown publicly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Identity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" /> Identity
              </CardTitle>
              <CardDescription>
                Share what feels right. Each field has a "Prefer not to say"
                option if you would rather keep it private.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose what fits" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sexual orientation</Label>
                <Select value={orientation} onValueChange={setOrientation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose what fits" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORIENTATION_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Connections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-gold" /> Who would you like to meet?
              </CardTitle>
              <CardDescription>
                You can keep this open or tell us what kinds of connections feel
                most relevant right now.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChipGroup
                options={LOOKING_FOR_OPTIONS}
                selected={lookingFor}
                onToggle={(v) => toggle(lookingFor, v, setLookingFor)}
              />
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Compass className="h-5 w-5 text-gold" /> What are you hoping to find here?
              </CardTitle>
              <CardDescription>Pick anything that resonates.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChipGroup
                options={EXPERIENCE_OPTIONS}
                selected={experience}
                onToggle={(v) => toggle(experience, v, setExperience)}
              />
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Heart className="h-5 w-5 text-gold" /> Interests
              </CardTitle>
              <CardDescription>
                Pick what you are into, or choose "Prefer not to choose interests
                right now" to keep this private.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[...INTEREST_OPTIONS, INTERESTS_OPT_OUT].map((interest) => {
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
              Saved. {totalFields - completedCount} field
              {totalFields - completedCount === 1 ? "" : "s"} still to go to
              complete your profile.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ChipGroup({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: Set<string>;
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.has(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              active
                ? "border-gold bg-gold/10 text-foreground"
                : "border-border/60 text-muted-foreground hover:bg-accent"
            }`}
          >
            {active && <span className="mr-1">✓</span>}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

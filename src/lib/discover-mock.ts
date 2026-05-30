// Aggregates mock pins for the Discover map: safe spaces, events,
// available-now community members. All client-side mock data.

import { SAFE_SPACES, type SafeSpace } from "@/lib/safe-spaces-mock";
import type { AvailabilitySession } from "@/lib/rhrn-mock";

export type DiscoverEvent = {
  id: string;
  title: string;
  date: string; // ISO
  time: string;
  category: string;
  attendees: number;
  official: boolean; // true = Official Pagu Event, must be at Safe Space
  safeSpaceId?: string; // venue ref (required if official)
  location: string; // fallback / display
  mapX: number;
  mapY: number;
};

export type DiscoverPerson = {
  userId: string;
  name: string;
  bio: string;
  distanceMeters: number;
  intentions: { emoji: string; label: string }[];
  interests: string[];
  languages: string[];
  memberSince: number;
  organizer: boolean;
  mapX: number;
  mapY: number;
};

function isoInDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const DISCOVER_EVENTS: DiscoverEvent[] = [
  {
    id: "de_book",
    title: "Queer Book Club",
    date: isoInDays(3),
    time: "19:00",
    category: "Culture",
    attendees: 8,
    official: true,
    safeSpaceId: "ss_oya",
    location: "Oya Köln",
    mapX: 46,
    mapY: 28,
  },
  {
    id: "de_museum",
    title: "Museum Meetup",
    date: isoInDays(5),
    time: "14:00",
    category: "Culture",
    attendees: 6,
    official: true,
    safeSpaceId: "ss_bunker101",
    location: "Bunker101",
    mapX: 22,
    mapY: 45,
  },
  {
    id: "de_brunch",
    title: "Community Brunch",
    date: isoInDays(2),
    time: "11:30",
    category: "Social",
    attendees: 12,
    official: true,
    safeSpaceId: "ss_buze",
    location: "BüZe",
    mapX: 52,
    mapY: 72,
  },
  {
    id: "de_music",
    title: "Live Music Night",
    date: isoInDays(6),
    time: "21:00",
    category: "Nightlife",
    attendees: 40,
    official: true,
    safeSpaceId: "ss_nachtigall",
    location: "Nachtigall",
    mapX: 30,
    mapY: 64,
  },
  {
    id: "de_picnic",
    title: "Picnic in the Park",
    date: isoInDays(7),
    time: "13:00",
    category: "Outdoors",
    attendees: 15,
    official: false,
    location: "Volksgarten, Köln",
    mapX: 80,
    mapY: 50,
  },
  {
    id: "de_networking",
    title: "Networking Evening",
    date: isoInDays(9),
    time: "19:30",
    category: "Professional",
    attendees: 22,
    official: true,
    safeSpaceId: "ss_kulturraum",
    location: "Kultur Raum",
    mapX: 64,
    mapY: 36,
  },
];

export const DISCOVER_PEOPLE: DiscoverPerson[] = [
  { userId: "p1", name: "Alex",   bio: "Likes long walks and oat lattes.",     distanceMeters: 120, intentions: [{emoji:"☕",label:"Coffee"},{emoji:"🚶",label:"Walk"}], interests:["coffee","art"], languages:["EN","DE"], memberSince:Date.now()-1000*60*60*24*180, organizer:false, mapX:42, mapY:40 },
  { userId: "p2", name: "Yuki",   bio: "Museum nerd, visiting town.",          distanceMeters: 320, intentions: [{emoji:"🎨",label:"Culture"}],                          interests:["museums","design"], languages:["EN","JP"], memberSince:Date.now()-1000*60*60*24*220, organizer:true,  mapX:25, mapY:50 },
  { userId: "p3", name: "Sam",    bio: "Concert buddy needed tonight.",        distanceMeters: 1200,intentions: [{emoji:"🎵",label:"Concert Buddy"},{emoji:"🌈",label:"New Friends"}], interests:["indie","techno"], languages:["EN"], memberSince:Date.now()-1000*60*60*24*60, organizer:false, mapX:33, mapY:60 },
  { userId: "p4", name: "Noa",    bio: "Looking for slow conversation.",       distanceMeters: 480, intentions: [{emoji:"💬",label:"Conversation"}],                     interests:["poetry","tea"], languages:["EN","HE"], memberSince:Date.now()-1000*60*60*24*420, organizer:true, mapX:60, mapY:30 },
  { userId: "p5", name: "Kai",    bio: "Co-working from a café today.",        distanceMeters: 210, intentions: [{emoji:"☕",label:"Coffee"}],                            interests:["startups","film"], languages:["EN","KO"], memberSince:Date.now()-1000*60*60*24*90, organizer:false, mapX:50, mapY:38 },
  { userId: "p6", name: "Esra",   bio: "Up for a forest walk.",                distanceMeters: 1500,intentions: [{emoji:"🚶",label:"Walk"},{emoji:"🌈",label:"New Friends"}], interests:["hiking","yoga"], languages:["EN","DE","TR"], memberSince:Date.now()-1000*60*60*24*330, organizer:false, mapX:78, mapY:24 },
  { userId: "p7", name: "Maya",   bio: "New in Cologne, open to friends.",     distanceMeters: 640, intentions: [{emoji:"🌈",label:"New Friends"}],                       interests:["music","food"], languages:["EN","ES"], memberSince:Date.now()-1000*60*60*24*30, organizer:false, mapX:38, mapY:70 },
  { userId: "p8", name: "Riko",   bio: "Sketching at cafés all day.",          distanceMeters: 290, intentions: [{emoji:"🎨",label:"Culture"},{emoji:"☕",label:"Coffee"}], interests:["illustration","film"], languages:["EN","JP"], memberSince:Date.now()-1000*60*60*24*150, organizer:true, mapX:48, mapY:55 },
  { userId: "p9", name: "Lena",   bio: "Free after work for a quick drink.",   distanceMeters: 880, intentions: [{emoji:"💬",label:"Conversation"}],                      interests:["wine","books"], languages:["EN","DE"], memberSince:Date.now()-1000*60*60*24*200, organizer:false, mapX:66, mapY:48 },
  { userId: "p10",name: "Tomi",   bio: "Concert tonight – spare ticket.",      distanceMeters: 1700,intentions: [{emoji:"🎵",label:"Concert Buddy"}],                     interests:["jazz","running"], languages:["EN","DE"], memberSince:Date.now()-1000*60*60*24*70, organizer:false, mapX:28, mapY:68 },
  { userId: "p11",name: "Aria",   bio: "Studying together, anyone?",           distanceMeters: 410, intentions: [{emoji:"📚",label:"Study Partner"}],                     interests:["philosophy","tea"], languages:["EN","FA"], memberSince:Date.now()-1000*60*60*24*45, organizer:false, mapX:55, mapY:60 },
  { userId: "p12",name: "Jules",  bio: "Slow Sunday energy.",                  distanceMeters: 730, intentions: [{emoji:"☕",label:"Coffee"},{emoji:"💬",label:"Conversation"}], interests:["plants","baking"], languages:["EN","FR"], memberSince:Date.now()-1000*60*60*24*500, organizer:true, mapX:72, mapY:58 },
];

export function asAvailabilitySession(p: DiscoverPerson): AvailabilitySession {
  return {
    userId: p.userId,
    name: p.name,
    bio: p.bio,
    interests: p.interests,
    languages: p.languages,
    city: "Cologne",
    memberSince: p.memberSince,
    organizer: p.organizer,
    intentions: p.intentions.map((i) => i.label.toLowerCase() as never),
    radiusMeters: 5000,
    distanceFromMe: p.distanceMeters,
    startedAt: Date.now() - 5 * 60_000,
    expiresAt: Date.now() + 25 * 60_000,
  };
}

export function getDiscoverEvent(id: string): DiscoverEvent | null {
  return DISCOVER_EVENTS.find((e) => e.id === id) ?? null;
}
export function getDiscoverPerson(id: string): DiscoverPerson | null {
  return DISCOVER_PEOPLE.find((p) => p.userId === id) ?? null;
}
export function spacesById(id: string): SafeSpace | undefined {
  return SAFE_SPACES.find((s) => s.id === id);
}

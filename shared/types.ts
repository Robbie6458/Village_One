// shared/types.ts

/** Auth user id from Supabase (UUID as string) */
export type UserId = string;

/** profiles table */
export interface Profile {
  id: UserId;                 // PK, auth.users.id
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;         // ISO timestamp
}

/** posts table */
export interface Post {
  id: string;                 // uuid
  author_id: UserId;          // FK -> auth.users.id
  title: string;
  body: string | null;
  created_at: string;         // ISO timestamp
  updatedAt?: string;         // ISO timestamp of last update
}

/** Convenience shapes */
export type NewPost = Pick<Post, "author_id" | "title" | "body">;
export type PostListItem = Pick<Post, "id" | "title" | "author_id" | "created_at">;

/* =========================
   Archetypes (original set)
   ========================= */

export type ArchetypeId =
  | "builder"
  | "horticulturist"
  | "village_engineer"
  | "designer"
  | "funder"
  | "storyteller"
  | "artist"
  | "craftsperson"
  | "permaculture_specialist"
  | "community_facilitator";

export interface ArchetypeOption {
  id: ArchetypeId;
  label: string;
  description: string;
  icon?: string; // optional: if you ever want to map emoji/icons
}

export const ARCHETYPE_OPTIONS: ArchetypeOption[] = [
  {
    id: "builder",
    label: "Builder",
    description:
      "Hands-on creators who bring designs to life through skilled craftsmanship and sustainable construction.",
  },
  {
    id: "horticulturist",
    label: "Horticulturist",
    description:
      "Food system designers who create sustainable growing practices and permaculture solutions.",
  },
  {
    id: "village_engineer",
    label: "Village Engineer",
    description:
      "Systems architects who design infrastructure, power grids, and technological integrations.",
  },
  {
    id: "designer",
    label: "Designer",
    description:
      "Creative visionaries who shape the aesthetic and functional aspects of village spaces.",
  },
  {
    id: "funder",
    label: "Funder",
    description:
      "Financial catalysts who provide capital and strategic investment for village development.",
  },
  {
    id: "storyteller",
    label: "Storyteller",
    description:
      "Community communicators who share our vision and connect people through narrative.",
  },
  {
    id: "artist",
    label: "Artist",
    description:
      "Creative spirits who bring beauty and cultural expression to village life.",
  },
  {
    id: "craftsperson",
    label: "Craftsperson",
    description:
      "Skilled artisans who create functional beauty using traditional and modern techniques.",
  },
  {
    id: "permaculture_specialist",
    label: "Permaculture Specialist",
    description:
      "Regenerative agriculture experts who design self-sustaining ecological systems.",
  },
  {
    id: "community_facilitator",
    label: "Community Facilitator",
    description:
      "Social architects who foster collaboration, resolve conflicts, and build connections.",
  },
];

export interface ForumSection {
  id: string;
  label: string;
  description?: string;
}

export const FORUM_SECTIONS: ForumSection[] = [
  { id: "land", label: "Land", description: "Discussions about land, environment, and territory." },
  { id: "resources", label: "Resources", description: "Resource management, materials, and supplies." },
  { id: "people", label: "People", description: "Community, members, and relationships." },
  { id: "facilities", label: "Facilities", description: "Buildings, infrastructure, and amenities." },
  { id: "operations", label: "Operations", description: "Daily operations, logistics, and processes." },
  { id: "ownership", label: "Ownership", description: "Ownership, governance, and stewardship." },
];

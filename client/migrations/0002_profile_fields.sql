-- Add new fields to profiles table
ALTER TABLE "profiles" 
  ADD COLUMN "archetype" text,
  ADD COLUMN "level" integer DEFAULT 1,
  ADD COLUMN "bio" text DEFAULT '',
  ADD COLUMN "social_links" jsonb DEFAULT '{}'::jsonb;

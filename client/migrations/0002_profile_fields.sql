-- Add new fields to profiles table if they don't exist
DO $$ 
BEGIN 
  -- Add archetype column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'archetype') THEN 
    ALTER TABLE "profiles" ADD COLUMN "archetype" text;
  END IF;

  -- Add level column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'level') THEN 
    ALTER TABLE "profiles" ADD COLUMN "level" integer DEFAULT 1;
  END IF;

  -- Add bio column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN 
    ALTER TABLE "profiles" ADD COLUMN "bio" text DEFAULT '';
  END IF;

  -- Add social_links column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'social_links') THEN 
    ALTER TABLE "profiles" ADD COLUMN "social_links" jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

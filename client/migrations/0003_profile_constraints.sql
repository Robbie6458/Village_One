-- Add check constraint for archetype to match valid options
ALTER TABLE "profiles" ADD CONSTRAINT "valid_archetype" 
  CHECK (
    archetype IS NULL OR 
    archetype IN (
      'builder', 'horticulturist', 'village_engineer', 'designer', 
      'funder', 'storyteller', 'artist', 'craftsperson', 
      'permaculture_specialist', 'community_facilitator'
    )
  );

-- Add check constraint for level to be positive
ALTER TABLE "profiles" ADD CONSTRAINT "valid_level" 
  CHECK (level > 0);

-- Add validation for social_links json structure
ALTER TABLE "profiles" ADD CONSTRAINT "valid_social_links"
  CHECK (
    social_links IS NULL OR 
    jsonb_typeof(social_links) = 'object'
  );

-- Create an index on archetype for faster filtering
CREATE INDEX idx_profiles_archetype ON profiles(archetype);

-- Note: The materialized view and triggers will be created in a separate migration
-- after ensuring all required tables exist

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

-- Create a materialized view for profile stats
CREATE MATERIALIZED VIEW profile_stats AS
SELECT 
  p.id,
  p.archetype,
  p.level,
  COUNT(DISTINCT po.id) as post_count,
  COUNT(DISTINCT c.id) as comment_count
FROM profiles p
LEFT JOIN posts po ON p.id = po.author_id
LEFT JOIN comments c ON p.id = c.author_id
GROUP BY p.id, p.archetype, p.level;

-- Create a refresh function for the materialized view
CREATE OR REPLACE FUNCTION refresh_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY profile_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to refresh the stats view
CREATE TRIGGER refresh_profile_stats_on_post
AFTER INSERT OR DELETE OR UPDATE ON posts
FOR EACH STATEMENT EXECUTE FUNCTION refresh_profile_stats();

CREATE TRIGGER refresh_profile_stats_on_comment
AFTER INSERT OR DELETE OR UPDATE ON comments
FOR EACH STATEMENT EXECUTE FUNCTION refresh_profile_stats();

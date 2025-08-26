-- Create required tables if they don't exist
CREATE TABLE IF NOT EXISTS posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    body text,
    created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    body text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Create the materialized view for profile stats
CREATE MATERIALIZED VIEW IF NOT EXISTS profile_stats AS
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
DROP TRIGGER IF EXISTS refresh_profile_stats_on_post ON posts;
CREATE TRIGGER refresh_profile_stats_on_post
AFTER INSERT OR DELETE OR UPDATE ON posts
FOR EACH STATEMENT EXECUTE FUNCTION refresh_profile_stats();

DROP TRIGGER IF EXISTS refresh_profile_stats_on_comment ON comments;
CREATE TRIGGER refresh_profile_stats_on_comment
AFTER INSERT OR DELETE OR UPDATE ON comments
FOR EACH STATEMENT EXECUTE FUNCTION refresh_profile_stats();

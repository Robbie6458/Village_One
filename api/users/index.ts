import { supabase } from '../lib/supabase';

// GET /api/users - return list of user profiles
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, display_name, archetype, level');

  if (profileError) {
    return res.status(500).json({ error: profileError.message });
  }

  // Map database fields to frontend expected fields
  const mappedProfiles = (profiles || []).map(profile => ({
    id: profile.id,
    username: profile.display_name || '',
    displayName: profile.display_name || '',
    archetype: profile.archetype || null,
    level: profile.level || 1
  }));

  return res.status(200).json(mappedProfiles);
}

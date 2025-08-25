import { supabase } from '../lib/supabase';

// GET /api/users - return list of user profiles
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, archetype, level');

  if (profileError) {
    return res.status(500).json({ error: profileError.message });
  }

  return res.status(200).json(profile || []);
}

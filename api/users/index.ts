import { supabase } from '../lib/supabase';

// GET /api/users - return list of user profiles
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, archetype, level');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data || []);
}

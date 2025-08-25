import { supabase } from '../../lib/supabase';

// GET /api/users/:id/certificates
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { id } = req.query || {};
  const rawId = Array.isArray(id) ? id[0] : id;

  let userId = rawId;
  if (rawId === 'me') {
    const sessionUser = req.session?.user || req.user;
    if (!sessionUser?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    userId = sessionUser.id;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!profile) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data || []);
}

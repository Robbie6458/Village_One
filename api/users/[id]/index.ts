import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Handler for /api/users/:id or /api/users/me
export default async function handler(req: any, res: any) {
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: req.headers.authorization || '' } },
  });

  const token = req.headers.authorization?.split(' ')[1];

  if (req.method === 'GET') {
    const { id } = req.query || {};
    const rawId = Array.isArray(id) ? id[0] : id;

    let userId = rawId;
    if (rawId === 'me') {
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { data: userData, error: authError } = await supabase.auth.getUser(token);
      if (authError || !userData?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      userId = userData.user.id;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'PATCH') {
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query || {};
    const rawId = Array.isArray(id) ? id[0] : id;
    const userId = rawId === 'me' ? userData.user.id : rawId;

    if (userId !== userData.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updates: Record<string, any> = {};
    for (const [key, value] of Object.entries(req.body || {})) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

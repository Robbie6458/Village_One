import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/users/:id/degrees
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: req.headers.authorization || '' } },
  });

  const authHeader = req.headers?.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  const { id } = req.query || {};
  const rawId = Array.isArray(id) ? id[0] : id;

  let userId = rawId;
  if (rawId === 'me') {
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData?.user) {
      return res.status(401).json({ error: authError?.message || 'Unauthorized' });
    }
    userId = userData.user.id;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (profileError) {
    return res.status(500).json({ error: profileError.message });
  }

  if (!profile) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { data, error } = await supabase
    .from('degrees')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data || []);
}

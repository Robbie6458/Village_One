import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Handler for GET /api/users/:id or /api/users/me
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: req.headers.authorization || '' } },
  });

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

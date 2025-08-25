import { createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET /api/users - return list of user profiles
export default async function handler(req: any, res: any) {
  const supabase = createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: { get: () => req.headers.cookie },
  });
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, archetype, level');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data || []);
}

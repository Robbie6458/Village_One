import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: SUPABASE_URL');
}

if (!serviceRoleKey) {
  throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
}

// GET /api/users/me/drafts
export default async function handler(req: any, res: any) {
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: req.headers.authorization || '' } },
  });

  if (req.method === 'GET') {
    const authHeader = req.headers?.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    const { data: userData, error: userError } = await supabase.auth.getUser(
      token
    );

    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = userData.user.id;

    // For now, return empty array since drafts table might not exist yet
    // TODO: Implement proper drafts functionality when the table is created
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('author_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      // If drafts table doesn't exist, return empty array
      console.log('Drafts table not found:', error.message);
      return res.status(200).json([]);
    }

    return res.status(200).json(data || []);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
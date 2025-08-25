import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: SUPABASE_URL');
}

if (!serviceRoleKey) {
  throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
}

// Handler for GET /api/users/:id or /api/users/me
export default async function handler(req: any, res: any) {
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: req.headers.authorization || '' } },
  });

  if (req.method === 'GET') {
    const { id } = req.query || {};
    const rawId = Array.isArray(id) ? id[0] : id;

    let userId = rawId;
    if (rawId === 'me') {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
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
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      firstName,
      lastName,
      bio,
      socialLinks,
      profileImageUrl,
    } = req.body ?? {};

    const updates: any = {};
    if (typeof firstName === 'string') updates.firstName = firstName;
    if (typeof lastName === 'string') updates.lastName = lastName;
    if (typeof bio === 'string') updates.bio = bio;
    if (typeof socialLinks !== 'undefined') updates.socialLinks = socialLinks;
    if (typeof profileImageUrl === 'string')
      updates.profileImageUrl = profileImageUrl;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userData.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(500).json({ error: error?.message || 'Update failed' });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

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
    let authUser = null;
    
    if (rawId === 'me') {
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

      userId = userData.user.id;
      authUser = userData.user;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Map database fields to frontend expected fields
    const mappedProfile = {
      id: profile.id,
      username: profile.display_name || '',
      displayName: profile.display_name || '',
      email: authUser?.email || '', // Get email from auth user for 'me' endpoint
      bio: profile.bio || '',
      archetype: profile.archetype || null,
      level: profile.level || 1,
      avatarUrl: profile.avatar_url || '',
      profileImageUrl: profile.avatar_url || '',
      socialLinks: profile.social_links || {},
      createdAt: profile.created_at,
      contributions: 0 // TODO: calculate from posts/comments
    };

    return res.status(200).json(mappedProfile);
  }

  if (req.method === 'PATCH') {
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

    const {
      displayName,
      bio,
      socialLinks,
      avatarUrl,
    } = req.body ?? {};

    const updates: any = {};
    if (typeof displayName === 'string') updates.display_name = displayName;
    if (typeof bio === 'string') updates.bio = bio;
    if (typeof socialLinks !== 'undefined') updates.social_links = socialLinks;
    if (typeof avatarUrl === 'string') updates.avatar_url = avatarUrl;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userData.user.id)
      .select()
      .single();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    if (!profile) {
      return res.status(500).json({ error: 'Update failed' });
    }

    return res.status(200).json(profile);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

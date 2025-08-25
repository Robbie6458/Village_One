import { supabase } from '../lib/supabase';

// GET /api/posts/user/:id - fetch posts authored by given user
export default async function handler(req: any, res: any) {
  // Support ID via route param or query string
  let userId: string | undefined = req.query?.id || req.query?.userId;
  if (!userId && typeof req.url === 'string') {
    const parts = req.url.split('/').filter(Boolean);
    userId = parts[parts.length - 1];
    if (userId === 'user') userId = undefined;
  }

  if (!userId) {
    return res.status(400).json({ error: 'Missing user id' });
  }

  if (userId === 'me') {
    const sessionUser = req.session?.user || req.user;
    if (!sessionUser?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    userId = sessionUser.id;
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
    .from('posts')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data || []);
}

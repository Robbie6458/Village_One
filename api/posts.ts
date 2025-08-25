import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: req.headers.authorization || '' } },
  });

  if (req.method === 'GET') {
    const forumSection = Array.isArray(req.query.forumSection)
      ? req.query.forumSection[0]
      : req.query.forumSection;

    if (!forumSection || typeof forumSection !== 'string') {
      res.status(400).json({ error: 'forumSection is required' });
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .eq('forumSection', forumSection)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
    return;
  }

  if (req.method === 'POST') {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, content, forumSection } = req.body ?? {};

    if (
      typeof title !== 'string' ||
      typeof content !== 'string' ||
      typeof forumSection !== 'string'
    ) {
      res.status(400).json({ error: 'Invalid payload' });
      return;
    }

    const { error } = await supabase.from('posts').insert({
      title,
      body: content,
      forumSection,
      author_id: userData.user.id,
    });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Post created' });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}

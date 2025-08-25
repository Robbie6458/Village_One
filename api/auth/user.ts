import { createServerClient } from '@supabase/ssr';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
    { cookies: { get: () => req.headers.get('cookie') } }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' }
  });
}

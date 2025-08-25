import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
    { cookies: cookieStore }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response(JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' }
  });
}

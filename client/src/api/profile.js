import { supabase } from '@/lib/supabaseClient';
export async function updateProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
        throw new Error('Not authenticated');
    // Convert frontend camelCase to database snake_case
    const dbUpdates = {
        display_name: updates.displayName,
        avatar_url: updates.avatarUrl,
        bio: updates.bio,
        archetype: updates.archetype,
        level: updates.level,
        social_links: updates.socialLinks,
    };
    const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}

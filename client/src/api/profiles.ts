/**
 * Direct Supabase integration for profile management.
 * This module provides functions for fetching, updating, and managing user profiles
 * directly through the Supabase client, ensuring consistent data access patterns.
 */

import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@shared/types";

/**
 * Fetches all community profiles with their associated stats.
 * Combines profile information with post and comment counts from the materialized view.
 * @returns Promise<Array<Profile & { stats: { post_count: number, comment_count: number } }>>
 */
export async function fetchCommunityProfiles() {
  try {
    // First get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) throw profilesError;

    // Then get all profile stats from the materialized view
    const { data: stats, error: statsError } = await supabase
      .from('profile_stats')
      .select('*');

    if (statsError) throw statsError;

    // Combine profiles with their stats, providing defaults for missing data
    return profiles.map(profile => ({
      ...profile,
      stats: stats?.find(s => s.id === profile.id) || {
        post_count: 0,
        comment_count: 0
      }
    }));
  } catch (error) {
    console.error('Error fetching community profiles:', error);
    throw error;
  }
}

/**
 * Fetches a single user profile by ID.
 * @param userId - The UUID of the user whose profile to fetch
 * @returns Promise<Profile>
 */
export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

/**
 * Updates a user's profile information.
 * Handles the conversion between frontend camelCase and database snake_case fields.
 * @param userId - The UUID of the user whose profile to update
 * @param updates - Object containing the fields to update (using frontend field names)
 * @returns Promise<Profile>
 */
export async function updateProfile(userId: string, updates: Partial<Profile>) {
  try {
    // Map frontend field names to database column names
    const { data, error } = await supabase
      .from('profiles')
      .update({
        display_name: updates.displayName,
        avatar_url: updates.avatarUrl,
        bio: updates.bio,
        level: updates.level,
        archetype: updates.archetype,
        social_links: updates.socialLinks
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

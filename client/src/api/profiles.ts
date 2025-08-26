/**
 * Profile management API
 * Centralized module for all profile-related operations using Supabase.
 * Handles data mapping between frontend and database representations.
 */

import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@shared/types";

// Type for database profile fields (snake_case)
type DbProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  archetype: string | null;
  level: number;
  bio: string;
  social_links: Record<string, string>;
};

/**
 * Maps a database profile to frontend format
 */
function mapDbToProfile(dbProfile: DbProfile): Profile {
  return {
    id: dbProfile.id,
    displayName: dbProfile.display_name,
    avatarUrl: dbProfile.avatar_url,
    createdAt: dbProfile.created_at,
    archetype: dbProfile.archetype,
    level: dbProfile.level,
    bio: dbProfile.bio,
    socialLinks: dbProfile.social_links
  };
}

/**
 * Maps frontend profile updates to database format
 */
function mapProfileToDb(profile: Partial<Profile>): Partial<DbProfile> {
  return {
    display_name: profile.displayName,
    avatar_url: profile.avatarUrl,
    archetype: profile.archetype,
    level: profile.level,
    bio: profile.bio,
    social_links: profile.socialLinks
  };
}

/**
 * Fetches all community profiles with their associated stats.
 * Combines profile information with post and comment counts from the materialized view.
 * @returns Promise<Array<Profile & { stats: { post_count: number, comment_count: number } }>>
 */
/**
 * Fetches all community profiles with their stats
 */
export async function fetchCommunityProfiles() {
  try {
    // Get profiles and stats in parallel
    const [profilesResponse, statsResponse] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('profile_stats').select('*')
    ]);

    if (profilesResponse.error) throw profilesResponse.error;
    if (statsResponse.error) throw statsResponse.error;

    // Combine and map the data
    return profilesResponse.data.map(profile => ({
      ...mapDbToProfile(profile),
      stats: statsResponse.data?.find(s => s.id === profile.id) || {
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
 * Fetches a single user profile by ID
 */
export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Profile not found');

    return mapDbToProfile(data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

/**
 * Updates a user's profile information
 */
export async function updateProfile(userId: string, updates: Partial<Profile>) {
  try {
    const dbUpdates = mapProfileToDb(updates);
    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Profile not found');

    return mapDbToProfile(data);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

/**
 * Checks if a user has a profile
 */
export async function hasProfile(userId: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('id', userId);

    if (error) throw error;
    return count === 1;
  } catch (error) {
    console.error('Error checking profile:', error);
    throw error;
  }
}

/**
 * Search for profiles matching a query string
 */
export async function searchProfiles(query: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`display_name.ilike.%${query}%,bio.ilike.%${query}%`)
      .limit(20);

    if (error) throw error;
    return data.map(mapDbToProfile);
  } catch (error) {
    console.error('Error searching profiles:', error);
    throw error;
  }
}

/**
 * Get profiles by archetype
 */
export async function getProfilesByArchetype(archetype: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('archetype', archetype);

    if (error) throw error;
    return data.map(mapDbToProfile);
  } catch (error) {
    console.error('Error fetching profiles by archetype:', error);
    throw error;
  }
}

/**
 * Get all archetypes with their user counts
 */
export async function getArchetypeCounts() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('archetype')
      .not('archetype', 'is', null);

    if (error) throw error;

    // Count occurrences of each archetype
    const counts = data.reduce((acc, { archetype }) => {
      if (archetype) {
        acc[archetype] = (acc[archetype] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return counts;
  } catch (error) {
    console.error('Error getting archetype counts:', error);
    throw error;
  }
}

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Profile } from "@shared/types";

export function useCommunityProfiles() {
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['community-profiles'],
    queryFn: async () => {
      try {
        // First get profile stats
        const { data: stats, error: statsError } = await supabase
          .from('profile_stats')
          .select('*');

        if (statsError) {
          console.error('Error fetching profile stats:', statsError);
          // Don't throw on stats error, continue with empty stats
        }

        // Then get profiles with their stats
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          // If we can't fetch profiles, return empty array instead of throwing
          return [];
        }

        // Combine profiles with their stats
        return (profiles || []).map(profile => ({
          ...profile,
          displayName: profile.display_name,
          avatarUrl: profile.avatar_url,
          socialLinks: profile.social_links,
          stats: stats?.find(s => s.id === profile.id) || {
            post_count: 0,
            comment_count: 0
          }
        }));
      } catch (error) {
        console.error('Failed to fetch community profiles:', error);
        // Return empty array on any network errors
        return [];
      }
    }
  });

  return {
    profiles: profiles || [],
    isLoading,
    error
  };
}

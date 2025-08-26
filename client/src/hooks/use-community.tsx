import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Profile } from "@shared/types";

export function useCommunityProfiles() {
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['community-profiles'],
    queryFn: async () => {
      // First get profile stats
      const { data: stats, error: statsError } = await supabase
        .from('profile_stats')
        .select('*');

      if (statsError) {
        console.error('Error fetching profile stats:', statsError);
        throw statsError;
      }

      // Then get profiles with their stats
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Combine profiles with their stats
      return profiles.map(profile => ({
        ...profile,
        displayName: profile.display_name,
        avatarUrl: profile.avatar_url,
        socialLinks: profile.social_links,
        stats: stats?.find(s => s.id === profile.id) || {
          post_count: 0,
          comment_count: 0
        }
      }));
    }
  });

  return {
    profiles: profiles || [],
    isLoading,
    error
  };
}

import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ARCHETYPE_OPTIONS } from "../../../shared/types";

export function useArchetype() {
  const archetypeMutation = useMutation({
    mutationFn: (responses: Record<string, string>) => 
      apiRequest('POST', '/api/archetype', { responses }),
  });

  const determineArchetype = (responses: Record<string, string>): string => {
    // Local fallback archetype determination logic
    // This provides a backup in case the API call fails
    
    const scoreMap: Record<string, number> = {};
    
    // Initialize scores
    ARCHETYPE_OPTIONS.forEach(archetype => {
      scoreMap[archetype] = 0;
    });

    // Score based on responses
    Object.entries(responses).forEach(([questionId, answer]) => {
      switch (questionId) {
        case "motivation":
          if (answer === "building") scoreMap["Resident Builder"] += 3;
          if (answer === "growing") scoreMap["Horticulturist"] += 3;
          if (answer === "connecting") scoreMap["Signals Team"] += 3;
          if (answer === "designing") scoreMap["Designer"] += 3;
          if (answer === "engineering") scoreMap["Village Engineer"] += 3;
          if (answer === "funding") scoreMap["Funder"] += 3;
          if (answer === "organizing") scoreMap["Builder"] += 3;
          break;
          
        case "skills":
          if (answer === "craftsmanship") scoreMap["Resident Builder"] += 2;
          if (answer === "agriculture") scoreMap["Horticulturist"] += 2;
          if (answer === "communication") scoreMap["Signals Team"] += 2;
          if (answer === "creativity") scoreMap["Designer"] += 2;
          if (answer === "technology") scoreMap["Village Engineer"] += 2;
          if (answer === "finance") scoreMap["Funder"] += 2;
          if (answer === "logistics") scoreMap["Builder"] += 2;
          break;
          
        case "environment":
          if (answer === "workshop") scoreMap["Resident Builder"] += 2;
          if (answer === "garden") scoreMap["Horticulturist"] += 2;
          if (answer === "social") scoreMap["Signals Team"] += 2;
          if (answer === "studio") scoreMap["Designer"] += 2;
          if (answer === "lab") scoreMap["Village Engineer"] += 2;
          if (answer === "office") scoreMap["Funder"] += 2;
          if (answer === "field") scoreMap["Builder"] += 2;
          break;
          
        case "contribution":
          if (answer === "hands-on") scoreMap["Resident Builder"] += 2;
          if (answer === "cultivation") scoreMap["Horticulturist"] += 2;
          if (answer === "facilitation") scoreMap["Signals Team"] += 2;
          if (answer === "vision") scoreMap["Designer"] += 2;
          if (answer === "infrastructure") scoreMap["Village Engineer"] += 2;
          if (answer === "investment") scoreMap["Funder"] += 2;
          if (answer === "coordination") scoreMap["Builder"] += 2;
          break;
          
        case "problem_solving":
          if (answer === "prototype") scoreMap["Resident Builder"] += 1;
          if (answer === "research") scoreMap["Horticulturist"] += 1;
          if (answer === "collaborate") scoreMap["Signals Team"] += 1;
          if (answer === "visualize") scoreMap["Designer"] += 1;
          if (answer === "analyze") scoreMap["Village Engineer"] += 1;
          if (answer === "strategize") scoreMap["Funder"] += 1;
          if (answer === "plan") scoreMap["Builder"] += 1;
          break;
          
        case "legacy":
          if (answer === "structures") scoreMap["Resident Builder"] += 1;
          if (answer === "abundance") scoreMap["Horticulturist"] += 1;
          if (answer === "connections") scoreMap["Signals Team"] += 1;
          if (answer === "inspiration") scoreMap["Designer"] += 1;
          if (answer === "innovation") scoreMap["Village Engineer"] += 1;
          if (answer === "sustainability") scoreMap["Funder"] += 1;
          if (answer === "efficiency") scoreMap["Builder"] += 1;
          break;
      }
    });

    // Find the archetype with the highest score
    const topArchetype = Object.entries(scoreMap).reduce((a, b) => 
      scoreMap[a[0]] > scoreMap[b[0]] ? a : b
    )[0];

    return topArchetype;
  };

  const getArchetypeDescription = (archetype: string): string => {
    const descriptions = {
      "Builder": "Organizers and coordinators who excel at managing complex projects and bringing together diverse resources and people.",
      "Horticulturist": "Food system designers who create sustainable growing practices and permaculture solutions for the community.",
      "Signals Team": "Communication specialists who facilitate connections, moderate discussions, and maintain community cohesion.",
      "Village Engineer": "Systems architects who design infrastructure, power grids, and technological integrations for sustainable living.",
      "Designer": "Creative visionaries who shape the aesthetic and functional aspects of buildings, spaces, and community layouts.",
      "Funder": "Financial catalysts who provide capital, strategic investment, and economic planning for village development.",
      "Resident Builder": "Hands-on creators who bring designs to life through skilled craftsmanship and sustainable building practices."
    };
    
    return descriptions[archetype as keyof typeof descriptions] || "A valuable contributor to the Village-One community.";
  };

  const getArchetypeColor = (archetype: string): string => {
    const colors = {
      "Builder": "holo-gold",
      "Horticulturist": "earth-green",
      "Signals Team": "neon-cyan",
      "Village Engineer": "electric-green",
      "Designer": "purple-400",
      "Funder": "holo-gold",
      "Resident Builder": "electric-green"
    };
    
    return colors[archetype as keyof typeof colors] || "gray-400";
  };

  return {
    determineArchetype: archetypeMutation.mutateAsync,
    determineArchetypeLocal: determineArchetype,
    getArchetypeDescription,
    getArchetypeColor,
    isLoading: archetypeMutation.isPending,
    error: archetypeMutation.error
  };
}

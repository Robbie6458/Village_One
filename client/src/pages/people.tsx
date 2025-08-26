import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VillageCard from "@/components/ui/village-card";
import { Search, Users, Filter, User, Instagram, Facebook } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { ARCHETYPE_OPTIONS } from "@shared/types";
import { useCommunityProfiles } from "@/hooks/use-community";

export default function People() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("level");

  // Parse URL params to filter by archetype
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1]);
    const archetypeParam = urlParams.get('archetype');
    if (archetypeParam) {
      setSelectedArchetype(archetypeParam);
    }
  }, [location]);

  const { profiles: users, isLoading, error } = useCommunityProfiles();

  // Filter and sort users
  const filteredUsers = users
    .filter((user: any) => {
      // Use displayName since profiles table doesn't have username field
      const displayName = user.displayName || user.display_name || '';
      const archetype = user.archetype || '';
      
      const matchesSearch = displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           archetype.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArchetype = selectedArchetype === "all" || archetype === selectedArchetype;
      return matchesSearch && matchesArchetype;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "level":
          return (b.level || 0) - (a.level || 0);
        case "contributions":
          // Use post_count + comment_count as contributions metric
          const aContributions = (a.stats?.post_count || 0) + (a.stats?.comment_count || 0);
          const bContributions = (b.stats?.post_count || 0) + (b.stats?.comment_count || 0);
          return bContributions - aContributions;
        case "username":
          // Sort by displayName since that's what we have
          const aName = a.displayName || a.display_name || '';
          const bName = b.displayName || b.display_name || '';
          return aName.localeCompare(bName);
        default:
          return 0;
      }
    });

  const archetypeStats = ARCHETYPE_OPTIONS.reduce((acc: any, archetype) => {
    acc[archetype.id] = users.filter((user: any) => user.archetype === archetype.id).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-space to-void texture-organic">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-cyber font-bold text-neon-cyan mb-4" data-testid="text-people-title">
            Village Community
          </h1>
          <p className="text-xl text-gray-400">
            Connect with builders, innovators, and visionaries shaping Village-One
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="card-rare bg-gradient-to-br from-void to-purple-deep border-holo-gold">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-300 flex items-center">
                <Users size={16} className="mr-2" />
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-holo-gold" data-testid="text-total-members">
                {users.length}
              </div>
            </CardContent>
          </Card>

          <Card className="card-epic bg-gradient-to-br from-void to-purple-deep border-electric-green">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-300">Active Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-electric-green" data-testid="text-active-contributors">
                {users.filter((user: any) => {
                  const contributions = (user.stats?.post_count || 0) + (user.stats?.comment_count || 0);
                  return contributions > 0;
                }).length}
              </div>
            </CardContent>
          </Card>

          <Card className="card-legendary bg-gradient-to-br from-void to-purple-deep border-neon-cyan">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-300">Top Archetype</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-neon-cyan" data-testid="text-top-archetype">
                {Object.entries(archetypeStats).reduce((a: any, b: any) => 
                  archetypeStats[a] > archetypeStats[b[0]] ? a : b[0], 
                  ARCHETYPE_OPTIONS[0]
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="card-rare bg-gradient-to-br from-void to-purple-deep border-holo-gold">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-300">Avg Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-holo-gold" data-testid="text-avg-level">
                {users.length > 0 ? Math.round(users.reduce((sum: number, user: any) => sum + (user.level || 1), 0) / users.length) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Archetype Distribution */}
        <Card className="bg-gradient-to-br from-void to-space border-purple-deep mb-8">
          <CardHeader>
            <CardTitle className="text-neon-cyan font-cyber">Archetype Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ARCHETYPE_OPTIONS.map((archetype) => (
                <div key={archetype.id} className="text-center p-4 rounded-lg bg-space/50" data-testid={`archetype-stat-${archetype.id}`}> 
                  <div className="text-sm text-gray-400 mb-1">{archetype.label}</div>
                  <div className="text-lg font-bold text-electric-green">
                    {archetypeStats[archetype.id] || 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    {users.length > 0 ? Math.round((archetypeStats[archetype.id] || 0) / users.length * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-gradient-to-br from-void to-space border-purple-deep mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-space border-purple-deep text-white placeholder-gray-400"
                  data-testid="input-search-members"
                />
              </div>

              <Select value={selectedArchetype} onValueChange={setSelectedArchetype}>
                <SelectTrigger className="bg-space border-purple-deep text-white" data-testid="select-archetype-filter">
                  <SelectValue placeholder="Filter by archetype" />
                </SelectTrigger>
                <SelectContent className="bg-void border-purple-deep">
                  <SelectItem value="all">All Archetypes</SelectItem>
                  {ARCHETYPE_OPTIONS.map((archetype) => (
                    <SelectItem key={archetype.id} value={archetype.id}>
                      {archetype.label} ({archetypeStats[archetype.id] || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-space border-purple-deep text-white" data-testid="select-sort-by">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-void border-purple-deep">
                  <SelectItem value="level">Level (High to Low)</SelectItem>
                  <SelectItem value="contributions">Contributions (High to Low)</SelectItem>
                  <SelectItem value="username">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Members Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-neon-cyan">Loading community members...</div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="bg-gradient-to-br from-void to-space border-purple-deep">
            <CardContent className="text-center py-12">
              <Filter className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No members found</h3>
              <p className="text-gray-400">
                {searchTerm || selectedArchetype !== "all" 
                  ? "Try adjusting your search filters"
                  : "Be the first to join this community!"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user: any) => (
              <VillageCard 
                key={user.id} 
                user={user} 
                onClick={() => window.location.href = `/profile/${user.id}`}
              />
            ))}
          </div>
        )}


      </div>
    </div>
  );
}

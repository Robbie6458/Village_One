import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VillageCard from "@/components/ui/village-card";
import { Search, Users, Filter } from "lucide-react";
import { ARCHETYPE_OPTIONS } from "@shared/types";
import { useCommunityProfiles } from "@/hooks/use-community";
export default function People() {
    const [location] = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedArchetype, setSelectedArchetype] = useState("all");
    const [sortBy, setSortBy] = useState("level");
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
        .filter((user) => {
        // Use displayName since profiles table doesn't have username field
        const displayName = user.displayName || user.display_name || '';
        const archetype = user.archetype || '';
        const matchesSearch = displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            archetype.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesArchetype = selectedArchetype === "all" || archetype === selectedArchetype;
        return matchesSearch && matchesArchetype;
    })
        .sort((a, b) => {
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
    const archetypeStats = ARCHETYPE_OPTIONS.reduce((acc, archetype) => {
        acc[archetype.id] = users.filter((user) => user.archetype === archetype.id).length;
        return acc;
    }, {});
    return (_jsx("div", { className: "min-h-screen p-8 bg-gradient-to-b from-space to-void texture-organic", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-12", children: [_jsx("h1", { className: "text-4xl font-cyber font-bold text-neon-cyan mb-4", "data-testid": "text-people-title", children: "Village Community" }), _jsx("p", { className: "text-xl text-gray-400", children: "Connect with builders, innovators, and visionaries shaping Village-One" })] }), _jsxs("div", { className: "grid md:grid-cols-4 gap-6 mb-8", children: [_jsxs(Card, { className: "card-rare bg-gradient-to-br from-void to-purple-deep border-holo-gold", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs(CardTitle, { className: "text-sm text-gray-300 flex items-center", children: [_jsx(Users, { size: 16, className: "mr-2" }), "Total Members"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-holo-gold", "data-testid": "text-total-members", children: users.length }) })] }), _jsxs(Card, { className: "card-epic bg-gradient-to-br from-void to-purple-deep border-electric-green", children: [_jsx(CardHeader, { className: "pb-3", children: _jsx(CardTitle, { className: "text-sm text-gray-300", children: "Active Contributors" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-electric-green", "data-testid": "text-active-contributors", children: users.filter((user) => {
                                            const contributions = (user.stats?.post_count || 0) + (user.stats?.comment_count || 0);
                                            return contributions > 0;
                                        }).length }) })] }), _jsxs(Card, { className: "card-legendary bg-gradient-to-br from-void to-purple-deep border-neon-cyan", children: [_jsx(CardHeader, { className: "pb-3", children: _jsx(CardTitle, { className: "text-sm text-gray-300", children: "Top Archetype" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-lg font-bold text-neon-cyan", "data-testid": "text-top-archetype", children: Object.entries(archetypeStats).reduce((a, b) => archetypeStats[a] > archetypeStats[b[0]] ? a : b[0], ARCHETYPE_OPTIONS[0]) }) })] }), _jsxs(Card, { className: "card-rare bg-gradient-to-br from-void to-purple-deep border-holo-gold", children: [_jsx(CardHeader, { className: "pb-3", children: _jsx(CardTitle, { className: "text-sm text-gray-300", children: "Avg Level" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-holo-gold", "data-testid": "text-avg-level", children: users.length > 0 ? Math.round(users.reduce((sum, user) => sum + (user.level || 1), 0) / users.length) : 0 }) })] })] }), _jsxs(Card, { className: "bg-gradient-to-br from-void to-space border-purple-deep mb-8", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-neon-cyan font-cyber", children: "Archetype Distribution" }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid md:grid-cols-3 lg:grid-cols-4 gap-4", children: ARCHETYPE_OPTIONS.map((archetype) => (_jsxs("div", { className: "text-center p-4 rounded-lg bg-space/50", "data-testid": `archetype-stat-${archetype.id}`, children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: archetype.label }), _jsx("div", { className: "text-lg font-bold text-electric-green", children: archetypeStats[archetype.id] || 0 }), _jsxs("div", { className: "text-xs text-gray-500", children: [users.length > 0 ? Math.round((archetypeStats[archetype.id] || 0) / users.length * 100) : 0, "%"] })] }, archetype.id))) }) })] }), _jsx(Card, { className: "bg-gradient-to-br from-void to-space border-purple-deep mb-8", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-3 text-gray-400", size: 20 }), _jsx(Input, { placeholder: "Search members...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 bg-space border-purple-deep text-white placeholder-gray-400", "data-testid": "input-search-members" })] }), _jsxs(Select, { value: selectedArchetype, onValueChange: setSelectedArchetype, children: [_jsx(SelectTrigger, { className: "bg-space border-purple-deep text-white", "data-testid": "select-archetype-filter", children: _jsx(SelectValue, { placeholder: "Filter by archetype" }) }), _jsxs(SelectContent, { className: "bg-void border-purple-deep", children: [_jsx(SelectItem, { value: "all", children: "All Archetypes" }), ARCHETYPE_OPTIONS.map((archetype) => (_jsxs(SelectItem, { value: archetype.id, children: [archetype.label, " (", archetypeStats[archetype.id] || 0, ")"] }, archetype.id)))] })] }), _jsxs(Select, { value: sortBy, onValueChange: setSortBy, children: [_jsx(SelectTrigger, { className: "bg-space border-purple-deep text-white", "data-testid": "select-sort-by", children: _jsx(SelectValue, { placeholder: "Sort by" }) }), _jsxs(SelectContent, { className: "bg-void border-purple-deep", children: [_jsx(SelectItem, { value: "level", children: "Level (High to Low)" }), _jsx(SelectItem, { value: "contributions", children: "Contributions (High to Low)" }), _jsx(SelectItem, { value: "username", children: "Name (A-Z)" })] })] })] }) }) }), isLoading ? (_jsx("div", { className: "text-center py-12", children: _jsx("div", { className: "text-neon-cyan", children: "Loading community members..." }) })) : filteredUsers.length === 0 ? (_jsx(Card, { className: "bg-gradient-to-br from-void to-space border-purple-deep", children: _jsxs(CardContent, { className: "text-center py-12", children: [_jsx(Filter, { className: "mx-auto text-gray-400 mb-4", size: 48 }), _jsx("h3", { className: "text-xl font-semibold text-gray-300 mb-2", children: "No members found" }), _jsx("p", { className: "text-gray-400", children: searchTerm || selectedArchetype !== "all"
                                    ? "Try adjusting your search filters"
                                    : "Be the first to join this community!" })] }) })) : (_jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filteredUsers.map((user) => (_jsx(VillageCard, { user: user, onClick: () => window.location.href = `/profile/${user.id}` }, user.id))) }))] }) }));
}

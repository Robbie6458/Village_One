import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Star, Award, Coins, Crown, Hammer, Leaf, ServerCog, Palette, DollarSign, Users, BookOpen, Instagram, Facebook, ExternalLink } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { cn } from "@/lib/utils";
const ARCHETYPE_ICONS = {
    "Builder": Hammer,
    "Horticulturist": Leaf,
    "Village Engineer": ServerCog,
    "Designer": Palette,
    "Funder": DollarSign,
    "Storyteller": BookOpen,
    "Artist": Palette,
    "Craftsperson": Hammer,
    "Permaculture Specialist": Leaf,
    "Community Facilitator": Users,
    // Legacy/fallback mappings
    "Signals Team": Users,
    "Resident Builder": Hammer,
    "Village Builder": Hammer, // Add this common fallback
};
const ARCHETYPE_COLORS = {
    "Builder": "holo-gold",
    "Horticulturist": "earth-green",
    "Village Engineer": "electric-green",
    "Designer": "purple-400",
    "Funder": "holo-gold",
    "Storyteller": "neon-cyan",
    "Artist": "purple-400",
    "Craftsperson": "holo-gold",
    "Permaculture Specialist": "earth-green",
    "Community Facilitator": "electric-green",
    // Legacy/fallback mappings
    "Signals Team": "neon-cyan",
    "Resident Builder": "electric-green",
    "Village Builder": "holo-gold", // Add this common fallback
};
const RARITY_BY_LEVEL = {
    1: "common",
    2: "common",
    3: "common",
    4: "rare",
    5: "rare",
    6: "epic",
    7: "epic",
    8: "legendary",
    9: "legendary",
    10: "legendary"
};
export default function VillageCard({ user, onClick }) {
    const level = user.level || 1;
    const rarity = RARITY_BY_LEVEL[Math.min(level, 10)] || "common";
    const ArchetypeIcon = user.archetype && ARCHETYPE_ICONS[user.archetype]
        ? ARCHETYPE_ICONS[user.archetype]
        : User;
    const archetypeColor = user.archetype && ARCHETYPE_COLORS[user.archetype]
        ? ARCHETYPE_COLORS[user.archetype]
        : "gray-400";
    // Generate a consistent avatar placeholder based on username
    const getAvatarColor = (username) => {
        const colors = ["electric-green", "neon-cyan", "holo-gold", "purple-400", "earth-green"];
        const index = username.length % colors.length;
        return colors[index];
    };
    const avatarColor = getAvatarColor(user.username);
    const getSocialLinkIcon = (platform) => {
        switch (platform) {
            case 'instagram': return Instagram;
            case 'facebook': return Facebook;
            case 'x': return FaXTwitter;
            default: return ExternalLink;
        }
    };
    return (_jsx(Card, { className: cn("bg-gradient-to-br from-void to-purple-deep hover:scale-105 transition-transform duration-300 cursor-pointer", rarity === "rare" && "card-rare", rarity === "epic" && "card-epic", rarity === "legendary" && "card-legendary"), onClick: onClick, "data-testid": `card-user-${user.id}`, children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "text-center mb-4", children: [_jsxs("div", { className: "relative inline-block mb-3", children: [user.profileImage ? (_jsx("img", { src: user.profileImage, alt: `${user.username} avatar`, className: cn("w-20 h-20 rounded-full border-2", rarity === "rare" && "border-holo-gold", rarity === "epic" && "border-purple-500", rarity === "legendary" && "border-orange-500", rarity === "common" && "border-gray-500"), "data-testid": `img-user-avatar-${user.id}` })) : (_jsx("div", { className: cn("w-20 h-20 rounded-full border-2 flex items-center justify-center", `bg-${avatarColor}/20`, rarity === "rare" && "border-holo-gold", rarity === "epic" && "border-purple-500", rarity === "legendary" && "border-orange-500", rarity === "common" && "border-gray-500"), children: _jsx(User, { className: `text-${avatarColor}`, size: 32 }) })), _jsx("div", { className: cn("absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-space-900", rarity === "rare" && "bg-holo-gold text-space-900", rarity === "epic" && "bg-purple-500 text-white", rarity === "legendary" && "bg-orange-500 text-white", rarity === "common" && "bg-gray-500 text-white"), children: level })] }), _jsx("h3", { className: "text-lg font-cyber font-bold text-white mb-1", "data-testid": `text-username-${user.id}`, children: user.username }), user.archetype && (_jsxs("div", { className: "flex items-center justify-center space-x-2 mb-3", children: [_jsx(ArchetypeIcon, { className: `text-${archetypeColor}`, size: 16 }), _jsx("span", { className: `text-sm text-${archetypeColor} font-semibold`, "data-testid": `text-archetype-${user.id}`, children: user.archetype })] }))] }), _jsxs("div", { className: "space-y-3 mb-4", children: [_jsx("div", { className: "flex justify-center space-x-1 mb-2", children: [...Array(5)].map((_, i) => (_jsx("div", { className: cn("w-2 h-2 rounded-full", i < level ? "bg-electric-green" : "bg-gray-600"), "data-testid": `level-star-${i}` }, i))) }), _jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [_jsxs("div", { className: "text-center p-2 rounded bg-space/50", children: [_jsx("div", { className: "text-gray-400", children: "Level" }), _jsx("div", { className: "text-electric-green font-bold", "data-testid": `text-level-${user.id}`, children: level })] }), _jsxs("div", { className: "text-center p-2 rounded bg-space/50", children: [_jsx("div", { className: "text-gray-400", children: "Contributions" }), _jsx("div", { className: "text-holo-gold font-bold", "data-testid": `text-contributions-${user.id}`, children: (user.contributions || 0).toLocaleString() })] })] })] }), user.bio && (_jsx("p", { className: "text-gray-300 text-sm text-center mb-4 line-clamp-2", "data-testid": `text-bio-${user.id}`, children: user.bio })), user.socialLinks && Object.values(user.socialLinks).some(link => link) && (_jsx("div", { className: "flex justify-center gap-2 mb-4", children: Object.entries(user.socialLinks).map(([platform, url]) => {
                        if (!url)
                            return null;
                        const IconComponent = getSocialLinkIcon(platform);
                        return (_jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), className: "p-1.5 rounded-lg bg-space-800/50 hover:bg-space-700/50 transition-colors", "data-testid": `link-social-${platform}-${user.id}`, children: _jsx(IconComponent, { className: "h-4 w-4 text-neon-cyan" }) }, platform));
                    }) })), user.skills && user.skills.length > 0 && (_jsxs("div", { className: "space-y-2 mb-4", children: [_jsx("div", { className: "text-xs text-gray-400 text-center", children: "Skills" }), _jsxs("div", { className: "flex flex-wrap gap-1 justify-center", children: [user.skills.slice(0, 3).map((skill, index) => (_jsx(Badge, { variant: "outline", className: "text-xs border-purple-deep text-neon-cyan", "data-testid": `badge-skill-${index}`, children: skill }, index))), user.skills.length > 3 && (_jsxs(Badge, { variant: "outline", className: "text-xs border-purple-deep text-gray-400", children: ["+", user.skills.length - 3] }))] })] })), _jsx("div", { className: "text-center pt-3 border-t border-purple-deep", children: _jsxs("div", { className: "flex items-center justify-center space-x-2", children: [rarity === "legendary" && _jsx(Crown, { className: "text-orange-500", size: 16 }), rarity === "epic" && _jsx(Award, { className: "text-purple-500", size: 16 }), rarity === "rare" && _jsx(Star, { className: "text-holo-gold", size: 16 }), rarity === "common" && _jsx(Coins, { className: "text-gray-500", size: 16 }), _jsx("span", { className: cn("text-xs font-semibold capitalize", rarity === "legendary" && "text-orange-500", rarity === "epic" && "text-purple-500", rarity === "rare" && "text-holo-gold", rarity === "common" && "text-gray-500"), children: rarity })] }) })] }) }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
export default function ArchetypeCard({ name, description, image, activeCount, level, rarity }) {
    const borderColors = {
        rare: "border-holo-gold",
        epic: "border-purple-500",
        legendary: "border-orange-500"
    };
    return (_jsxs("div", { className: cn("rounded-xl p-6 bg-gradient-to-br from-void to-purple-deep hover:scale-105 transition-transform duration-300", `card-${rarity}`), "data-testid": `card-archetype-${name.toLowerCase().replace(' ', '-')}`, children: [_jsx("img", { src: image, alt: `${name} Archetype`, className: cn("w-20 h-20 rounded-full mx-auto mb-4 border-2", borderColors[rarity]), "data-testid": `img-archetype-${name.toLowerCase().replace(' ', '-')}` }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-lg font-cyber font-bold text-holo-gold mb-2", "data-testid": `text-archetype-name-${name.toLowerCase().replace(' ', '-')}`, children: name }), _jsx("p", { className: "text-sm text-gray-300 mb-4", "data-testid": `text-archetype-description-${name.toLowerCase().replace(' ', '-')}`, children: description }), _jsx("div", { className: "flex justify-center space-x-1 mb-3", children: [...Array(5)].map((_, i) => (_jsx("div", { className: cn("w-2 h-2 rounded-full", i < level ? "bg-electric-green" : "bg-gray-600"), "data-testid": `level-indicator-${i}` }, i))) }), _jsxs("span", { className: "text-xs bg-holo-gold/20 text-holo-gold px-2 py-1 rounded-full", "data-testid": `text-active-count-${name.toLowerCase().replace(' ', '-')}`, children: [activeCount, " Active"] })] })] }));
}

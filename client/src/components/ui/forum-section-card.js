import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
export default function ForumSectionCard({ id, title, subtitle, description, icon: Icon, color, rarity, tags, sentiment = "neutral", threadCount = 0 }) {
    const colorClasses = {
        "holo-gold": "from-holo-gold to-earth-green",
        "electric-green": "from-electric-green to-earth-green",
        "neon-cyan": "from-neon-cyan to-electric-green"
    };
    const sentimentColors = {
        optimistic: "text-electric-green",
        focused: "text-neon-cyan",
        innovative: "text-electric-green",
        collaborative: "text-holo-gold",
        technical: "text-neon-cyan",
        creative: "text-electric-green",
        neutral: "text-gray-400",
        concerned: "text-orange-400"
    };
    return (_jsx(Link, { href: `/forum/${id}`, children: _jsxs("div", { className: cn("rounded-xl p-6 bg-gradient-to-br from-void to-space hover:scale-105 transition-transform duration-300 cursor-pointer h-80 flex flex-col", `card-${rarity}`), "data-testid": `card-forum-${id}`, children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx("div", { className: cn("w-12 h-12 bg-gradient-to-br rounded-lg flex items-center justify-center", colorClasses[color] || "from-gray-500 to-gray-600"), children: _jsx(Icon, { className: "text-space", size: 20 }) }), _jsxs("div", { children: [_jsx("h3", { className: cn("text-xl font-cyber font-bold", `text-${color}`), children: title }), _jsx("p", { className: cn("text-sm", `text-${color}`), children: subtitle })] })] }), _jsx("p", { className: "text-gray-300 text-sm mb-4 flex-grow", children: description }), _jsxs("div", { className: "mt-auto space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-gray-400", children: "Active Threads" }), _jsx("span", { className: "text-electric-green font-semibold", "data-testid": `text-thread-count-${id}`, children: threadCount })] }), _jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-gray-400", children: "AI Sentiment" }), _jsx("span", { className: cn("font-semibold capitalize", sentimentColors[sentiment]), "data-testid": `text-sentiment-${id}`, children: sentiment })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: tags.map((tag, index) => (_jsx("span", { className: cn("px-2 py-1 rounded text-xs", color === "holo-gold" && "bg-holo-gold/20 text-holo-gold", color === "electric-green" && "bg-electric-green/20 text-electric-green", color === "neon-cyan" && "bg-neon-cyan/20 text-neon-cyan"), "data-testid": `tag-${tag.toLowerCase()}`, children: tag }, index))) })] })] }) }));
}

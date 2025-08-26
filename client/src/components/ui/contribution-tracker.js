import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, Award } from "lucide-react";
import { cn } from "@/lib/utils";
const MILESTONES = [
    { amount: 100000, label: "Land Survey", icon: Target, color: "earth-green" },
    { amount: 250000, label: "Infrastructure Design", icon: TrendingUp, color: "neon-cyan" },
    { amount: 500000, label: "Construction Begin", icon: Award, color: "electric-green" },
    { amount: 750000, label: "First Buildings", icon: Award, color: "holo-gold" },
    { amount: 1000000, label: "Village Complete", icon: Award, color: "holo-gold" },
];
export default function ContributionTracker({ current, goal, progress, showMilestones = true, className }) {
    const nextMilestone = MILESTONES.find(milestone => current < milestone.amount);
    const completedMilestones = MILESTONES.filter(milestone => current >= milestone.amount);
    return (_jsxs("div", { className: cn("space-y-6", className), children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-400", children: "Progress to Goal" }), _jsxs("span", { className: "text-neon-cyan font-semibold", children: [Math.round(progress), "%"] })] }), _jsxs("div", { className: "relative", children: [_jsx(Progress, { value: progress, className: "h-4 bg-space", "data-testid": "progress-funding" }), showMilestones && MILESTONES.map((milestone, index) => {
                                const position = (milestone.amount / goal) * 100;
                                const isCompleted = current >= milestone.amount;
                                const Icon = milestone.icon;
                                return (_jsxs("div", { className: "absolute top-0 transform -translate-x-1/2 -translate-y-2", style: { left: `${Math.min(position, 95)}%` }, "data-testid": `milestone-${index}`, children: [_jsx("div", { className: cn("w-6 h-6 rounded-full flex items-center justify-center border-2 bg-space transition-colors duration-300", isCompleted
                                                ? `border-${milestone.color} bg-${milestone.color}/20`
                                                : "border-gray-600"), children: _jsx(Icon, { size: 12, className: cn(isCompleted ? `text-${milestone.color}` : "text-gray-600") }) }), _jsx("div", { className: "absolute top-8 left-1/2 transform -translate-x-1/2 z-10 opacity-0 hover:opacity-100 transition-opacity", children: _jsxs("div", { className: "bg-void border border-purple-deep rounded px-2 py-1 text-xs whitespace-nowrap", children: [_jsx("div", { className: cn("font-semibold", isCompleted ? `text-${milestone.color}` : "text-gray-400"), children: milestone.label }), _jsxs("div", { className: "text-gray-400", children: ["$", milestone.amount.toLocaleString()] })] }) })] }, index));
                            })] })] }), nextMilestone && (_jsx(Card, { className: "bg-gradient-to-r from-space/50 to-void/50 border-purple-deep", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: cn("w-10 h-10 rounded-lg flex items-center justify-center", `bg-${nextMilestone.color}/20`), children: _jsx(nextMilestone.icon, { className: `text-${nextMilestone.color}`, size: 20 }) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-white", children: "Next Milestone" }), _jsx("div", { className: `text-sm text-${nextMilestone.color}`, children: nextMilestone.label })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-lg font-bold text-white", children: ["$", nextMilestone.amount.toLocaleString()] }), _jsxs("div", { className: "text-sm text-gray-400", children: ["$", (nextMilestone.amount - current).toLocaleString(), " to go"] })] })] }), _jsx("div", { className: "mt-3", children: _jsx(Progress, { value: ((current % nextMilestone.amount) / nextMilestone.amount) * 100, className: "h-2 bg-space" }) })] }) })), showMilestones && completedMilestones.length > 0 && (_jsxs("div", { className: "space-y-3", children: [_jsxs("h4", { className: "text-sm font-semibold text-electric-green flex items-center", children: [_jsx(Award, { size: 16, className: "mr-2" }), "Completed Milestones"] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: completedMilestones.map((milestone, index) => {
                            const Icon = milestone.icon;
                            return (_jsxs("div", { className: cn("flex items-center space-x-2 p-3 rounded-lg", `bg-${milestone.color}/10 border border-${milestone.color}/30`), "data-testid": `completed-milestone-${index}`, children: [_jsx(Icon, { className: `text-${milestone.color}`, size: 16 }), _jsxs("div", { children: [_jsx("div", { className: `text-sm font-semibold text-${milestone.color}`, children: milestone.label }), _jsxs("div", { className: "text-xs text-gray-400", children: ["$", milestone.amount.toLocaleString()] })] })] }, index));
                        }) })] }))] }));
}

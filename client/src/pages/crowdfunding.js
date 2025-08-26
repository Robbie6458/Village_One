import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import ContributionTracker from "@/components/ui/contribution-tracker";
import { Crown, Hammer, Home, Star, Users, Target, TrendingUp, Gift } from "lucide-react";
const CONTRIBUTION_TIERS = [
    {
        id: "settler",
        name: "Village Settler",
        amount: 100,
        icon: Home,
        color: "earth-green",
        description: "Join the founding community and help establish Village-One",
        perks: [
            "Digital Village Member Certificate",
            "Access to exclusive community updates",
            "Village-One founding member badge",
            "Early access to village events"
        ]
    },
    {
        id: "builder",
        name: "Village Builder",
        amount: 500,
        icon: Hammer,
        color: "electric-green",
        description: "Contribute to the physical construction and development",
        perks: [
            "All Settler perks",
            "Your name on the Village-One founders wall",
            "Invitation to groundbreaking ceremony",
            "Quarterly progress reports with exclusive insights",
            "10% discount on future village stays"
        ]
    },
    {
        id: "founder",
        name: "Village Founder",
        amount: 2500,
        icon: Crown,
        color: "holo-gold",
        description: "Foundational leadership role in shaping Village-One's future",
        perks: [
            "All Builder perks",
            "Lifetime honorary Village-One citizenship",
            "Annual founder's retreat invitation",
            "Input on major village decisions",
            "Free annual week stay at Village-One",
            "Custom archetype assessment and role assignment"
        ]
    }
];
const contributionFormSchema = z.object({
    amount: z.number().min(1, "Amount must be at least $1"),
    tier: z.string().min(1, "Please select a contribution tier"),
});
export default function Crowdfunding() {
    const [selectedTier, setSelectedTier] = useState("");
    const [customAmount, setCustomAmount] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const { data: totalFunding } = useQuery({
        queryKey: ['/api/contributions/total'],
    });
    const { data: recentContributions = [] } = useQuery({
        queryKey: ['/api/contributions/recent'], // This endpoint would need to be implemented
        enabled: false, // Disable for now since endpoint doesn't exist
    });
    const form = useForm({
        resolver: zodResolver(contributionFormSchema),
        defaultValues: {
            amount: 0,
            tier: "",
        },
    });
    const contributeMutation = useMutation({
        mutationFn: (data) => apiRequest('POST', '/api/contributions', {
            ...data,
            userId: 'current-user-id', // In a real app, get from auth context
            perks: CONTRIBUTION_TIERS.find(t => t.id === data.tier)?.perks || [],
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/contributions/total'] });
            form.reset();
            setDialogOpen(false);
            setSelectedTier("");
            setCustomAmount(0);
        },
    });
    const handleTierSelect = (tier) => {
        setSelectedTier(tier.id);
        setCustomAmount(tier.amount);
        form.setValue('tier', tier.id);
        form.setValue('amount', tier.amount);
    };
    const handleCustomAmount = (amount) => {
        setCustomAmount(amount);
        form.setValue('amount', amount);
        // Determine tier based on amount
        const appropriateTier = CONTRIBUTION_TIERS
            .slice()
            .reverse()
            .find(tier => amount >= tier.amount);
        if (appropriateTier) {
            setSelectedTier(appropriateTier.id);
            form.setValue('tier', appropriateTier.id);
        }
    };
    const onSubmit = (data) => {
        contributeMutation.mutate(data);
    };
    const fundingGoal = 1000000; // $1M goal
    const currentFunding = totalFunding?.total || 0;
    const fundingProgress = (currentFunding / fundingGoal) * 100;
    return (_jsx("div", { className: "min-h-screen p-8 bg-gradient-to-b from-space to-void texture-organic", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl font-cyber font-bold text-neon-cyan mb-4", "data-testid": "text-crowdfunding-title", children: "Fund Village-One" }), _jsx("p", { className: "text-xl text-gray-400 max-w-3xl mx-auto", children: "Support the creation of a sustainable, self-sufficient community that serves as a blueprint for the future" })] }), _jsxs(Card, { className: "card-legendary bg-gradient-to-br from-void to-purple-deep border-holo-gold mb-12", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-3", children: [_jsx(Target, { className: "text-holo-gold", size: 24 }), _jsx("span", { className: "text-holo-gold font-cyber", children: "Funding Progress" })] }) }), _jsxs(CardContent, { children: [_jsx(ContributionTracker, { current: currentFunding, goal: fundingGoal, progress: fundingProgress }), _jsxs("div", { className: "grid md:grid-cols-3 gap-6 mt-8", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-3xl font-bold text-electric-green", "data-testid": "text-current-funding", children: ["$", currentFunding.toLocaleString()] }), _jsx("div", { className: "text-sm text-gray-400", children: "Raised" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-3xl font-bold text-holo-gold", "data-testid": "text-funding-goal", children: ["$", fundingGoal.toLocaleString()] }), _jsx("div", { className: "text-sm text-gray-400", children: "Goal" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-3xl font-bold text-neon-cyan", "data-testid": "text-funding-progress", children: [Math.round(fundingProgress), "%"] }), _jsx("div", { className: "text-sm text-gray-400", children: "Complete" })] })] })] })] }), _jsxs("div", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-cyber font-bold text-electric-green mb-8 text-center", children: "Choose Your Impact Level" }), _jsx("div", { className: "grid md:grid-cols-3 gap-8", children: CONTRIBUTION_TIERS.map((tier) => {
                                const Icon = tier.icon;
                                const isPopular = tier.id === "builder";
                                return (_jsxs(Card, { className: `relative bg-gradient-to-br from-void to-purple-deep hover:scale-105 transition-transform duration-300 cursor-pointer ${tier.id === "settler" ? "card-rare" :
                                        tier.id === "builder" ? "card-epic" : "card-legendary"}`, onClick: () => handleTierSelect(tier), "data-testid": `card-tier-${tier.id}`, children: [isPopular && (_jsx("div", { className: "absolute -top-3 left-1/2 transform -translate-x-1/2", children: _jsxs("div", { className: "bg-electric-green text-space px-4 py-1 rounded-full text-sm font-bold flex items-center", children: [_jsx(Star, { size: 16, className: "mr-1" }), "Most Popular"] }) })), _jsxs(CardHeader, { className: "text-center", children: [_jsx("div", { className: `w-16 h-16 bg-gradient-to-br from-${tier.color} to-electric-green rounded-lg flex items-center justify-center mx-auto mb-4`, children: _jsx(Icon, { className: "text-space", size: 32 }) }), _jsx(CardTitle, { className: `text-2xl font-cyber text-${tier.color}`, children: tier.name }), _jsxs("div", { className: "text-4xl font-bold text-white", children: ["$", tier.amount.toLocaleString()] })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("p", { className: "text-gray-300 text-center", children: tier.description }), _jsxs("div", { className: "space-y-2", children: [_jsxs("h4", { className: "font-semibold text-neon-cyan flex items-center", children: [_jsx(Gift, { size: 16, className: "mr-2" }), "Perks & Benefits"] }), _jsx("ul", { className: "space-y-1 text-sm text-gray-300", children: tier.perks.map((perk, index) => (_jsxs("li", { className: "flex items-start", children: [_jsx("div", { className: "w-2 h-2 bg-electric-green rounded-full mt-2 mr-2 flex-shrink-0" }), perk] }, index))) })] })] })] }, tier.id));
                            }) })] }), _jsxs(Card, { className: "card-epic bg-gradient-to-br from-void to-purple-deep border-electric-green max-w-2xl mx-auto", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-center text-electric-green font-cyber text-2xl", children: "Make Your Contribution" }) }), _jsx(CardContent, { children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-3 gap-3", children: CONTRIBUTION_TIERS.map((tier) => (_jsx(Button, { type: "button", variant: selectedTier === tier.id ? "default" : "outline", onClick: () => handleTierSelect(tier), className: `h-auto py-3 ${selectedTier === tier.id
                                                    ? "bg-gradient-to-r from-neon-cyan to-electric-green text-space"
                                                    : "border-purple-deep text-gray-300"}`, "data-testid": `button-select-tier-${tier.id}`, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "font-semibold", children: tier.name }), _jsxs("div", { className: "text-sm", children: ["$", tier.amount] })] }) }, tier.id))) }), _jsx(FormField, { control: form.control, name: "amount", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-gray-300", children: "Custom Amount ($)" }), _jsx(FormControl, { children: _jsx(Input, { type: "number", placeholder: "Enter custom amount...", className: "bg-space border-purple-deep text-white", value: customAmount || "", onChange: (e) => handleCustomAmount(Number(e.target.value)), "data-testid": "input-custom-amount" }) }), _jsx(FormMessage, {})] })) }), selectedTier && (_jsxs("div", { className: "p-4 rounded-lg bg-space/50 border border-purple-deep", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-3", children: [_jsx("div", { className: "text-lg font-semibold text-electric-green", children: CONTRIBUTION_TIERS.find(t => t.id === selectedTier)?.name }), _jsxs("div", { className: "text-lg font-bold text-white", children: ["$", customAmount.toLocaleString()] })] }), _jsx("div", { className: "text-sm text-gray-300", children: "You'll receive all perks for this tier and become a foundational member of Village-One." })] })), _jsx(Button, { type: "submit", disabled: !selectedTier || customAmount < 1 || contributeMutation.isPending, className: "w-full bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold py-3 text-lg", "data-testid": "button-contribute", children: contributeMutation.isPending ? 'Processing...' : `Contribute $${customAmount.toLocaleString()}` }), _jsx("div", { className: "text-center text-sm text-gray-400", children: _jsx("p", { children: "Secure payment processing \u2022 100% of funds go to Village-One development" }) })] }) }) })] }), _jsxs(Card, { className: "bg-gradient-to-br from-void to-space border-purple-deep mt-12", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-center text-neon-cyan font-cyber", children: "Your Impact" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid md:grid-cols-3 gap-8 text-center", children: [_jsxs("div", { children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-earth-green to-electric-green rounded-lg flex items-center justify-center mx-auto mb-4", children: _jsx(Home, { className: "text-space", size: 32 }) }), _jsx("h3", { className: "text-lg font-semibold text-earth-green mb-2", children: "Sustainable Living" }), _jsx("p", { className: "text-gray-300 text-sm", children: "Help create eco-friendly homes and buildings that minimize environmental impact while maximizing comfort and functionality." })] }), _jsxs("div", { children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-neon-cyan to-electric-green rounded-lg flex items-center justify-center mx-auto mb-4", children: _jsx(Users, { className: "text-space", size: 32 }) }), _jsx("h3", { className: "text-lg font-semibold text-neon-cyan mb-2", children: "Community Building" }), _jsx("p", { className: "text-gray-300 text-sm", children: "Foster connections and collaboration among diverse individuals working toward a shared vision of sustainable community." })] }), _jsxs("div", { children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-holo-gold to-electric-green rounded-lg flex items-center justify-center mx-auto mb-4", children: _jsx(TrendingUp, { className: "text-space", size: 32 }) }), _jsx("h3", { className: "text-lg font-semibold text-holo-gold mb-2", children: "Future Blueprint" }), _jsx("p", { className: "text-gray-300 text-sm", children: "Establish a replicable model that can inspire and guide the creation of sustainable communities worldwide." })] })] }) })] })] }) }));
}

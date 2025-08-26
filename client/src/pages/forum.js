import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PostCard from "@/components/ui/post-card";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Brain, Home, ChevronRight, Mountain, Sprout, Users, Building, ServerCog } from "lucide-react";
import { FORUM_SECTIONS } from "../../../shared/types";
const postFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    content: z.string().min(10, "Content must be at least 10 characters").max(5000, "Content too long"),
});
export default function Forum() {
    const { section } = useParams();
    const [dialogOpen, setDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();
    if (!section || !FORUM_SECTIONS.some(s => s.id === section)) {
        return (_jsx("div", { className: "min-h-screen p-8 bg-space flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-red-500", children: "Invalid Forum Section" }), _jsx("p", { className: "text-gray-400", children: "The requested forum section does not exist." })] }) }));
    }
    const { data: posts = [], isLoading } = useQuery({
        queryKey: [`/api/posts/${section}`],
    });
    const { data: sentiment } = useQuery({
        queryKey: [`/api/forum/${section}/sentiment`],
    });
    const form = useForm({
        resolver: zodResolver(postFormSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    });
    const createPostMutation = useMutation({
        mutationFn: async (data) => {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    forumSection: section,
                    status: 'published'
                })
            });
            if (!response.ok)
                throw new Error('Failed to create post');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/posts/${section}`] });
            queryClient.invalidateQueries({ queryKey: ['/api/sentiments'] });
            form.reset();
            setDialogOpen(false);
        },
    });
    const onSubmit = (data) => {
        createPostMutation.mutate(data);
    };
    const sectionInfo = {
        land: { title: "Land", subtitle: "Locations & Requirements", icon: Mountain, color: "holo-gold" },
        resources: { title: "Resources", subtitle: "Sustainable Sourcing", icon: Sprout, color: "electric-green" },
        people: { title: "People", subtitle: "Community Directory", icon: Users, color: "neon-cyan" },
        facilities: { title: "Facilities", subtitle: "Buildings & Infrastructure", icon: Building, color: "holo-gold" },
        operations: { title: "Operations", subtitle: "Revenue & Business Models", icon: ServerCog, color: "electric-green" },
        ownership: { title: "Ownership", subtitle: "Structure & Governance", icon: Users, color: "neon-cyan" }
    };
    const currentSection = sectionInfo[section];
    const IconComponent = currentSection?.icon || Building;
    const sectionTitles = {
        land: "Land & Locations",
        resources: "Sustainable Resources",
        people: "Community Directory",
        facilities: "Facilities & Infrastructure",
        operations: "Operations & Revenue",
        ownership: "Ownership Structure"
    };
    const sectionDescriptions = {
        land: "Discuss property locations, zoning requirements, climate considerations, and land acquisition strategies.",
        resources: "Share insights on sustainable sourcing, renewable energy options, and resource management systems.",
        people: "Connect with community members, share skills, and build collaborative relationships.",
        facilities: "Propose and discuss building designs, infrastructure systems, power management, water systems, and smart village technologies.",
        operations: "Discuss vacation rentals, workshops, revenue models, and sustainable business operations.",
        ownership: "Explore community land trusts, cooperative ownership, profit sharing, and governance structures."
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-space to-void", children: [_jsx("div", { className: "border-b border-purple-deep/30 bg-space/50 backdrop-blur-sm sticky top-0 z-40", children: _jsx("div", { className: "max-w-6xl mx-auto px-8 py-4", children: _jsxs("nav", { className: "flex items-center space-x-2 text-sm", children: [_jsx(Link, { href: "/", children: _jsxs("div", { className: "flex items-center space-x-1 text-gray-400 hover:text-neon-cyan transition-colors cursor-pointer", "data-testid": "breadcrumb-home", children: [_jsx(Home, { size: 16 }), _jsx("span", { children: "Village-One" })] }) }), _jsx(ChevronRight, { size: 14, className: "text-gray-600" }), _jsx("span", { className: "text-gray-400", children: "Forums" }), _jsx(ChevronRight, { size: 14, className: "text-gray-600" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(IconComponent, { size: 16, className: `text-${currentSection?.color}` }), _jsx("span", { className: `text-${currentSection?.color} font-semibold`, "data-testid": "breadcrumb-section", children: currentSection?.title })] })] }) }) }), _jsx("div", { className: "border-b border-purple-deep/30 bg-void/50 backdrop-blur-sm", children: _jsx("div", { className: "max-w-6xl mx-auto px-8 py-4", children: _jsx("div", { className: "flex items-center space-x-6 overflow-x-auto", children: FORUM_SECTIONS.map((forumSection) => {
                            const sectionData = sectionInfo[forumSection.id];
                            const SectionIcon = sectionData?.icon || Building;
                            const isActive = forumSection.id === section;
                            return (_jsx(Link, { href: `/forum/${forumSection.id}`, children: _jsxs("div", { className: `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${isActive
                                        ? `bg-${sectionData?.color}/20 text-${sectionData?.color} border border-${sectionData?.color}/30`
                                        : 'text-gray-400 hover:text-white hover:bg-purple-deep/30'}`, "data-testid": `nav-${forumSection.id}`, children: [_jsx(SectionIcon, { size: 16 }), _jsx("span", { className: "font-medium", children: sectionData?.title })] }) }, forumSection.id));
                        }) }) }) }), _jsxs("div", { className: "max-w-6xl mx-auto p-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: `text-4xl font-cyber font-bold text-${currentSection?.color} mb-2`, "data-testid": `text-forum-title-${section}`, children: currentSection?.title }), _jsx("p", { className: "text-lg text-gray-400 max-w-3xl", children: currentSection?.subtitle })] }), _jsxs(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "bg-gradient-to-r from-neon-cyan to-electric-green text-space font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300", "data-testid": "button-new-post", children: [_jsx(Plus, { size: 20, className: "mr-2" }), "New Post"] }) }), _jsxs(DialogContent, { className: "bg-void border-purple-deep text-white max-w-2xl", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-neon-cyan font-cyber", children: "Create New Post" }) }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [_jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-gray-300", children: "Title" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Enter post title...", className: "bg-space border-purple-deep text-white", "data-testid": "input-post-title", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "content", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-gray-300", children: "Content" }), _jsx(FormControl, { children: _jsx(RichTextEditor, { value: field.value, onChange: field.onChange, placeholder: "Share your ideas, questions, or insights..." }) }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setDialogOpen(false), className: "border-purple-deep text-gray-300", "data-testid": "button-cancel-post", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: createPostMutation.isPending, className: "bg-gradient-to-r from-neon-cyan to-electric-green text-space", "data-testid": "button-submit-post", children: createPostMutation.isPending ? 'Creating...' : 'Create Post' })] })] }) })] })] })] }), sentiment && (_jsxs(Card, { className: "card-epic bg-gradient-to-br from-void to-purple-deep border-electric-green mb-8", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-3", children: [_jsx(Brain, { className: "text-electric-green", size: 20 }), _jsx("span", { className: "text-electric-green font-cyber", children: "AI Forum Analysis" })] }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid md:grid-cols-3 gap-4 mb-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Sentiment" }), _jsx("div", { className: `text-lg font-semibold capitalize ${sentiment.sentiment === 'optimistic' ? 'text-electric-green' :
                                                                    sentiment.sentiment === 'focused' ? 'text-neon-cyan' :
                                                                        sentiment.sentiment === 'collaborative' ? 'text-holo-gold' :
                                                                            'text-gray-400'}`, "data-testid": "text-forum-sentiment", children: sentiment.sentiment })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Confidence" }), _jsxs("div", { className: "text-lg font-semibold text-neon-cyan", "data-testid": "text-sentiment-confidence", children: [sentiment.confidence, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Active Posts" }), _jsx("div", { className: "text-lg font-semibold text-holo-gold", "data-testid": "text-active-posts", children: posts.length })] })] }), _jsx("p", { className: "text-gray-300 text-sm", "data-testid": "text-sentiment-summary", children: sentiment.summary || "Analysis based on recent community discussions and engagement patterns." })] })] }))] }), _jsx("div", { className: "space-y-8", children: isLoading ? (_jsx("div", { className: "text-center py-12", children: _jsx("div", { className: "text-neon-cyan", children: "Loading posts..." }) })) : posts.length === 0 ? (_jsx(Card, { className: "bg-gradient-to-br from-void to-space border-purple-deep", children: _jsxs(CardContent, { className: "text-center py-12", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-300 mb-2", children: "No posts yet" }), _jsx("p", { className: "text-gray-400 mb-6", children: "Be the first to start a discussion in this forum!" }), _jsx(Button, { onClick: () => setDialogOpen(true), className: "bg-gradient-to-r from-neon-cyan to-electric-green text-space", "data-testid": "button-first-post", children: "Create First Post" })] }) })) : (_jsx("div", { className: "space-y-8", children: posts.map((post) => (_jsx("div", { className: "mb-6", children: _jsx(PostCard, { post: post, currentUser: currentUser }) }, post.id))) })) })] })] }));
}

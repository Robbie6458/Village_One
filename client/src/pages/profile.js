import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { User, Award, MessageCircle, Mail, ArrowLeft, Hammer, Leaf, ServerCog, Palette, DollarSign, Users, BookOpen, Edit, GraduationCap, Shield, ImageIcon, FileText, ExternalLinkIcon, Instagram, Facebook, Plus, Trash2 } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FORUM_SECTIONS } from "../../../shared/types";
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
    "Signals Team": Users,
    "Resident Builder": Hammer,
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
    "Signals Team": "neon-cyan",
    "Resident Builder": "electric-green",
};
export default function Profile() {
    const params = useParams();
    const userId = params.id;
    const { user: currentUser, session, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState("posts");
    // Helper to get auth header
    const getAuthHeader = () => {
        return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined;
    };
    // Use /api/users/me for own profile, /api/users/:id for others
    // Check if viewing own profile
    const isOwnProfile = isAuthenticated && (userId === 'me' || userId === currentUser?.id);
    const profileEndpoint = isOwnProfile ? '/api/users/me' : `/api/users/${userId}`;
    const isOwnProfile = isAuthenticated && (userId === 'me' || userId === currentUser?.id);
    const profileEndpoint = isOwnProfile ? '/api/users/me' : `/api/users/${userId}`;
    const { data: user, isLoading: userLoading } = useQuery({
        queryKey: [profileEndpoint],
        enabled: !!userId,
        queryFn: async () => {
            const headers = getAuthHeader();
            const res = await fetch(profileEndpoint, {
                headers: headers,
            });
            if (!res.ok)
                throw new Error('Failed to fetch user profile');
            return await res.json();
        },
    });
    const { data: userPosts = [], isLoading: postsLoading } = useQuery({
        queryKey: ['/api/posts/user', isOwnProfile && currentUser ? currentUser.id : userId],
        enabled: !!userId,
        queryFn: async () => {
            const res = await fetch(`/api/posts/user/${isOwnProfile && currentUser ? currentUser.id : userId}`);
            if (!res.ok)
                return [];
            return await res.json();
        },
    });
    const { data: userDegrees = [], isLoading: degreesLoading } = useQuery({
        queryKey: ['/api/users', userId, 'degrees'],
        enabled: !!userId,
        queryFn: async () => {
            const res = await fetch(`/api/users/${userId}/degrees`);
            if (!res.ok)
                return [];
            return await res.json();
        },
    });
    const { data: userCertificates = [], isLoading: certificatesLoading } = useQuery({
        queryKey: ['/api/users', userId, 'certificates'],
        enabled: !!userId,
        queryFn: async () => {
            const res = await fetch(`/api/users/${userId}/certificates`);
            if (!res.ok)
                return [];
            return await res.json();
        },
    });
    const { data: userGallery = [], isLoading: galleryLoading } = useQuery({
        queryKey: ['/api/users', userId, 'gallery'],
        enabled: !!userId,
        queryFn: async () => {
            const res = await fetch(`/api/users/${userId}/gallery`);
            if (!res.ok)
                return [];
            return await res.json();
        },
    });
    const { data: userDrafts = [], isLoading: draftsLoading } = useQuery({
        queryKey: ['/api/users/me/drafts'],
        enabled: isOwnProfile && isAuthenticated,
        queryFn: async () => {
            const res = await fetch(`/api/users/me/drafts`);
            if (!res.ok)
                return [];
            return await res.json();
        },
    });
    if (userLoading) {
        return (_jsx("div", { className: "container mx-auto p-6 max-w-6xl", children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-32 bg-space-800/50 rounded-lg mb-6" }), _jsx("div", { className: "h-8 bg-space-800/50 rounded w-1/4 mb-4" }), _jsx("div", { className: "h-4 bg-space-800/50 rounded w-1/2" })] }) }));
    }
    if (!user) {
        return (_jsx("div", { className: "container mx-auto p-6 max-w-6xl", children: _jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(User, { className: "mx-auto mb-4 h-12 w-12 text-space-400" }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "User not found" }), _jsx("p", { className: "text-space-400", children: "The profile you're looking for doesn't exist." }), _jsx(Link, { href: "/people", children: _jsxs(Button, { className: "mt-4", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Back to People"] }) })] }) }) }));
    }
    const ArchetypeIcon = ARCHETYPE_ICONS[user.archetype] || User;
    const archetypeColor = ARCHETYPE_COLORS[user.archetype] || "space-400";
    const getSocialLinkIcon = (platform) => {
        switch (platform) {
            case 'instagram': return Instagram;
            case 'facebook': return Facebook;
            case 'x': return FaXTwitter;
            default: return ExternalLinkIcon;
        }
    };
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    return (_jsxs("div", { className: "container mx-auto p-6 max-w-6xl space-y-6", children: [_jsx(Link, { href: "/people", children: _jsxs(Button, { variant: "ghost", size: "sm", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Back to People"] }) }), _jsxs(Card, { className: "relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-electric-green/10 via-neon-cyan/5 to-holo-gold/10" }), _jsx(CardContent, { className: "relative p-8", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [_jsx("div", { className: "flex-shrink-0", children: _jsxs("div", { className: "relative", children: [user.profileImageUrl ? (_jsx("img", { src: user.profileImageUrl, alt: user.username, className: "w-32 h-32 rounded-full object-cover border-2 border-electric-green/30" })) : (_jsx("div", { className: "w-32 h-32 rounded-full bg-space-800 flex items-center justify-center border-2 border-electric-green/30", children: _jsx(User, { className: "h-16 w-16 text-space-400" }) })), user.archetype && (_jsx("div", { className: `absolute -bottom-2 -right-2 p-2 rounded-full bg-${archetypeColor} border-2 border-space-900`, children: _jsx(ArchetypeIcon, { className: "h-5 w-5 text-space-900" }) }))] }) }), _jsxs("div", { className: "flex-1 space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h1", { className: "text-3xl font-bold bg-gradient-to-r from-neon-cyan to-electric-green bg-clip-text text-transparent", children: user.username }), isOwnProfile && (_jsx(Link, { href: "/profile/edit", children: _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Edit, { className: "h-4 w-4 mr-2" }), "Edit Profile"] }) }))] }), user.email && (_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Mail, { className: "h-4 w-4 text-space-400" }), _jsx("span", { className: "text-space-300", children: user.email })] })), user.bio && (_jsx("p", { className: "text-space-300 leading-relaxed mb-4", children: user.bio })), user.socialLinks && Object.values(user.socialLinks).some(link => link) && (_jsx("div", { className: "flex gap-3", children: Object.entries(user.socialLinks).map(([platform, url]) => {
                                                        if (!url)
                                                            return null;
                                                        const IconComponent = getSocialLinkIcon(platform);
                                                        return (_jsx("a", { href: url, target: "_blank", rel: "noopener noreferrer", className: "p-2 rounded-lg bg-space-800/50 hover:bg-space-700/50 transition-colors", "data-testid": `link-social-${platform}`, children: _jsx(IconComponent, { className: "h-5 w-5 text-neon-cyan" }) }, platform));
                                                    }) }))] }), _jsxs("div", { className: "flex gap-6 pt-4 border-t border-space-700", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-electric-green", children: user.level || 1 }), _jsx("div", { className: "text-sm text-space-400", children: "Level" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-neon-cyan", children: user.contributions || 0 }), _jsx("div", { className: "text-sm text-space-400", children: "Contributions" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-holo-gold", children: Array.isArray(userPosts) ? userPosts.length : 0 }), _jsx("div", { className: "text-sm text-space-400", children: "Posts" })] })] })] })] }) })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [_jsxs(TabsTrigger, { value: "posts", "data-testid": "tab-posts", children: [_jsx(FileText, { className: "h-4 w-4 mr-2" }), "Forum Posts"] }), _jsxs(TabsTrigger, { value: "credentials", "data-testid": "tab-credentials", children: [_jsx(GraduationCap, { className: "h-4 w-4 mr-2" }), "Credentials"] }), _jsxs(TabsTrigger, { value: "gallery", "data-testid": "tab-gallery", children: [_jsx(ImageIcon, { className: "h-4 w-4 mr-2" }), "Gallery"] }), _jsxs(TabsTrigger, { value: "archetype", "data-testid": "tab-archetype", children: [_jsx(Award, { className: "h-4 w-4 mr-2" }), "Archetype"] })] }), _jsxs(TabsContent, { value: "posts", className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Forum Posts" }), isOwnProfile && (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { size: "sm", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Create Post"] }) }), _jsxs(DialogContent, { className: "bg-void border-purple-deep text-white max-w-4xl max-h-[80vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-neon-cyan font-cyber", children: "Create New Post" }) }), _jsxs("div", { className: "text-center p-8", children: [_jsx("p", { className: "text-gray-400 mb-4", children: "Use the forum categories to create posts:" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: FORUM_SECTIONS.map(section => (_jsx(Link, { href: `/forum/${section.id}`, children: _jsx(Button, { variant: "outline", className: "w-full", children: section.label }) }, section.id))) })] })] })] }))] }), postsLoading ? (_jsx("div", { className: "space-y-4", children: [...Array(3)].map((_, i) => (_jsx(Card, { className: "animate-pulse", children: _jsxs(CardContent, { className: "p-4", children: [_jsx("div", { className: "h-4 bg-space-800 rounded w-3/4 mb-2" }), _jsx("div", { className: "h-3 bg-space-800 rounded w-1/2" })] }) }, i))) })) : userPosts && Array.isArray(userPosts) && userPosts.length > 0 ? (_jsx("div", { className: "space-y-4", children: userPosts.map((post) => (_jsx(Card, { className: "hover:bg-space-800/30 transition-colors", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx(Link, { href: `/forum/${post.forumSection}/${post.id}`, children: _jsx("h4", { className: "font-semibold hover:text-neon-cyan transition-colors cursor-pointer", children: post.title }) }), _jsx(Badge, { variant: "secondary", className: "text-xs", children: post.forumSection })] }), _jsxs("p", { className: "text-space-400 text-sm line-clamp-2 mb-2", children: [post.content.substring(0, 150), "..."] }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-space-500", children: [_jsx("span", { children: formatDate(post.createdAt) }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MessageCircle, { className: "h-3 w-3" }), post.commentCount || 0] })] })] }) }, post.id))) })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(FileText, { className: "mx-auto mb-4 h-12 w-12 text-space-400" }), _jsx("p", { className: "text-space-400", children: "No forum posts yet" }), isOwnProfile && (_jsx(Link, { href: "/forum", children: _jsx(Button, { className: "mt-4", children: "Create your first post" }) }))] }) }))] }), _jsxs(TabsContent, { value: "credentials", className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Degrees" }), isOwnProfile && (_jsxs(Button, { size: "sm", variant: "outline", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Degree"] }))] }), Array.isArray(userDegrees) && userDegrees.length > 0 ? (_jsx("div", { className: "grid gap-4 md:grid-cols-2", children: userDegrees.map((degree) => (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold", children: degree.degree }), _jsx("p", { className: "text-sm text-space-400", children: degree.field })] }), degree.verified && (_jsx(Badge, { variant: "default", className: "text-xs bg-electric-green text-space-900", children: "Verified" }))] }), _jsx("p", { className: "text-space-300 font-medium", children: degree.institution }), degree.year && (_jsxs("p", { className: "text-sm text-space-400", children: ["Class of ", degree.year] }))] }) }, degree.id))) })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(GraduationCap, { className: "mx-auto mb-4 h-12 w-12 text-space-400" }), _jsx("p", { className: "text-space-400", children: "No degrees added yet" })] }) }))] }), _jsx(Separator, {}), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Certificates" }), isOwnProfile && (_jsxs(Button, { size: "sm", variant: "outline", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Certificate"] }))] }), Array.isArray(userCertificates) && userCertificates.length > 0 ? (_jsx("div", { className: "grid gap-4 md:grid-cols-2", children: userCertificates.map((cert) => (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold", children: cert.name }), _jsx("p", { className: "text-sm text-space-400", children: cert.issuer })] }), cert.verified && (_jsx(Badge, { variant: "default", className: "text-xs bg-electric-green text-space-900", children: "Verified" }))] }), _jsxs("div", { className: "flex justify-between items-center text-sm text-space-400", children: [_jsx("span", { children: cert.issueDate && `Issued: ${formatDate(cert.issueDate)}` }), cert.url && (_jsx("a", { href: cert.url, target: "_blank", rel: "noopener noreferrer", children: _jsx(ExternalLinkIcon, { className: "h-4 w-4 text-neon-cyan" }) }))] })] }) }, cert.id))) })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(Shield, { className: "mx-auto mb-4 h-12 w-12 text-space-400" }), _jsx("p", { className: "text-space-400", children: "No certificates added yet" })] }) }))] })] }), _jsxs(TabsContent, { value: "gallery", className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Gallery" }), isOwnProfile && (_jsxs(Button, { size: "sm", variant: "outline", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add Image"] }))] }), Array.isArray(userGallery) && userGallery.length > 0 ? (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: userGallery.map((image) => (_jsxs(Card, { className: "overflow-hidden", children: [_jsx("div", { className: "aspect-square", children: _jsx("img", { src: image.imageUrl, alt: image.title || 'Gallery image', className: "w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" }) }), image.title && (_jsx(CardContent, { className: "p-3", children: _jsx("p", { className: "text-sm font-medium truncate", children: image.title }) }))] }, image.id))) })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(ImageIcon, { className: "mx-auto mb-4 h-12 w-12 text-space-400" }), _jsx("p", { className: "text-space-400", children: "No images in gallery yet" }), isOwnProfile && (_jsxs(Button, { className: "mt-4", variant: "outline", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Add your first image"] }))] }) }))] }), _jsxs(TabsContent, { value: "archetype", className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Village Archetype" }), user.archetype ? (_jsxs(Card, { className: "relative overflow-hidden", children: [_jsx("div", { className: `absolute inset-0 bg-${archetypeColor}/10` }), _jsxs(CardContent, { className: "relative p-6", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("div", { className: `p-3 rounded-full bg-${archetypeColor}`, children: _jsx(ArchetypeIcon, { className: "h-8 w-8 text-space-900" }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-2xl font-bold", children: user.archetype }), _jsx("p", { className: "text-space-400", children: "Village Role" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("h5", { className: "font-semibold mb-2", children: "Description" }), _jsx("p", { className: "text-space-300 leading-relaxed", children: getArchetypeDescription(user.archetype) })] }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold mb-2", children: "Key Strengths" }), _jsx("div", { className: "flex flex-wrap gap-2", children: getArchetypeStrengths(user.archetype).map((strength) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: strength }, strength))) })] })] }), isOwnProfile && (_jsx("div", { className: "mt-6 pt-4 border-t border-space-700", children: _jsx(Button, { size: "sm", variant: "outline", children: "Retake Assessment" }) }))] })] })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(Award, { className: "mx-auto mb-4 h-12 w-12 text-space-400" }), _jsx("p", { className: "text-space-400 mb-4", children: "No archetype assigned yet" }), isOwnProfile && (_jsx(Button, { children: "Take Archetype Assessment" }))] }) }))] }), isOwnProfile && (_jsxs(TabsContent, { value: "drafts", className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Draft Posts" }), _jsxs(Button, { size: "sm", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "New Draft"] })] }), Array.isArray(userDrafts) && userDrafts.length > 0 ? (_jsx("div", { className: "space-y-4", children: userDrafts.map((draft) => (_jsx(Card, { className: "hover:bg-space-800/30 transition-colors", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h4", { className: "font-semibold", children: draft.title || "Untitled Draft" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", children: "Edit" }), draft.title && draft.content && draft.forumSection && (_jsx(Button, { size: "sm", children: "Publish" })), _jsx(Button, { size: "sm", variant: "ghost", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }), _jsx("p", { className: "text-space-400 text-sm mb-2", children: draft.content ? `${draft.content.substring(0, 100)}...` : "No content" }), _jsxs("div", { className: "flex items-center justify-between text-xs text-space-500", children: [_jsxs("span", { children: ["Last edited: ", formatDate(draft.updatedAt)] }), draft.forumSection && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: draft.forumSection }))] })] }) }, draft.id))) })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(Edit, { className: "mx-auto mb-4 h-12 w-12 text-space-400" }), _jsx("p", { className: "text-space-400", children: "No drafts yet" }), _jsx(Button, { className: "mt-4", variant: "outline", children: "Create your first draft" })] }) }))] }))] })] }));
}
// Helper functions for archetype information
function getArchetypeDescription(archetype) {
    const descriptions = {
        "Builder": "Hands-on creators who love to construct and build the physical infrastructure of our village. They transform ideas into tangible reality.",
        "Horticulturist": "Green-thumbed specialists who understand plants, soil, and sustainable growing practices. They help create our food systems and gardens.",
        "Village Engineer": "Technical problem-solvers who design and maintain the systems that keep our village running smoothly and efficiently.",
        "Designer": "Creative visionaries who shape the aesthetic and functional aspects of our village spaces, from architecture to user experiences.",
        "Funder": "Financial contributors and advisors who help secure resources and manage the economic sustainability of our village project.",
        "Storyteller": "Communication specialists who share our vision, document our journey, and connect with the broader community.",
        "Artist": "Creative souls who bring beauty, culture, and inspiration to village life through various forms of artistic expression.",
        "Craftsperson": "Skilled artisans who create beautiful and functional items using traditional and modern techniques.",
        "Permaculture Specialist": "Experts in sustainable living systems who design regenerative landscapes and ecological solutions.",
        "Community Facilitator": "Social connectors who help build relationships, resolve conflicts, and foster collaboration within our community.",
        "Signals Team": "Information gatherers and analysts who help the village stay informed and make data-driven decisions.",
        "Resident Builder": "Community members who will live in the village and help with ongoing construction and maintenance projects."
    };
    return descriptions[archetype] || "A valued member of our village community with unique skills and contributions.";
}
function getArchetypeStrengths(archetype) {
    const strengths = {
        "Builder": ["Construction", "Problem Solving", "Physical Skills", "Project Management"],
        "Horticulturist": ["Plant Care", "Soil Management", "Sustainable Agriculture", "Ecosystem Design"],
        "Village Engineer": ["System Design", "Technical Analysis", "Infrastructure", "Innovation"],
        "Designer": ["Creative Vision", "User Experience", "Aesthetics", "Space Planning"],
        "Funder": ["Financial Planning", "Investment Strategy", "Resource Management", "Economic Analysis"],
        "Storyteller": ["Communication", "Content Creation", "Community Outreach", "Documentation"],
        "Artist": ["Creative Expression", "Cultural Development", "Inspiration", "Aesthetic Vision"],
        "Craftsperson": ["Manual Skills", "Quality Craftsmanship", "Tool Mastery", "Material Knowledge"],
        "Permaculture Specialist": ["Sustainable Systems", "Ecological Design", "Resource Conservation", "Natural Building"],
        "Community Facilitator": ["Relationship Building", "Conflict Resolution", "Event Planning", "Communication"],
        "Signals Team": ["Research", "Analysis", "Information Gathering", "Strategic Thinking"],
        "Resident Builder": ["Local Knowledge", "Ongoing Maintenance", "Community Living", "Practical Skills"]
    };
    return strengths[archetype] || ["Community Contribution", "Unique Perspective", "Collaborative Spirit"];
}

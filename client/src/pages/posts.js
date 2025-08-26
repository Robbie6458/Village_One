import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Calendar, MessageSquare, ThumbsUp, Eye } from "lucide-react";
import { PostEditor } from "@/components/forms/post-editor";
import { FORUM_SECTIONS } from "../../../shared/types";
export default function PostsPage() {
    const [selectedPost, setSelectedPost] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    // Fetch user's published posts
    const { data: publishedPosts = [], isLoading: loadingPublished } = useQuery({
        queryKey: ["/api/posts/user/me"]
    });
    // Fetch user's draft posts
    const { data: draftPosts = [], isLoading: loadingDrafts } = useQuery({
        queryKey: ["/api/users/me/drafts"]
    });
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const getCategoryName = (sectionId) => {
        return FORUM_SECTIONS.find(section => section.id === sectionId)?.name || sectionId;
    };
    const handlePostSaved = (post) => {
        setSelectedPost(null);
        setShowEditor(false);
    };
    const PostCard = ({ post, isDraft = false }) => (_jsxs(Card, { className: "group hover:shadow-md transition-shadow", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Badge, { variant: "outline", className: "text-xs", children: getCategoryName(post.forumSection) }), _jsx(Badge, { variant: isDraft ? "secondary" : "default", className: "text-xs", children: isDraft ? "Draft" : "Published" })] }), _jsx(CardTitle, { className: "text-lg leading-tight", children: post.title })] }), _jsxs(Dialog, { open: selectedPost?.id === post.id, onOpenChange: (open) => !open && setSelectedPost(null), children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedPost(post), className: "opacity-0 group-hover:opacity-100 transition-opacity", "data-testid": `button-edit-post-${post.id}`, children: _jsx(Edit, { className: "w-4 h-4" }) }) }), _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Edit Post" }) }), _jsx(PostEditor, { post: selectedPost || undefined, onSave: handlePostSaved, onCancel: () => setSelectedPost(null), showInModal: true })] })] })] }) }), _jsxs(CardContent, { className: "pt-0", children: [_jsx("p", { className: "text-muted-foreground text-sm line-clamp-3 mb-4", children: post.content }), _jsx("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3" }), isDraft
                                            ? `Updated ${formatDate(post.updatedAt || post.createdAt || new Date())}`
                                            : `Published ${formatDate(post.publishedAt || post.createdAt || new Date())}`] }), !isDraft && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(ThumbsUp, { className: "w-3 h-3" }), post.upvotes || 0] }), _jsxs(Link, { href: `/forum/${post.forumSection}/${post.id}`, className: "flex items-center gap-1 hover:text-primary", children: [_jsx(Eye, { className: "w-3 h-3" }), "View Post"] })] }))] }) })] })] }, post.id));
    return (_jsxs("div", { className: "container mx-auto p-6 max-w-6xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "My Posts" }), _jsx("p", { className: "text-muted-foreground", children: "Manage your published posts and drafts" })] }), _jsxs(Dialog, { open: showEditor, onOpenChange: setShowEditor, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { "data-testid": "button-create-new-post", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "New Post"] }) }), _jsxs(DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Create New Post" }) }), _jsx(PostEditor, { onSave: handlePostSaved, onCancel: () => setShowEditor(false), showInModal: true })] })] })] }), _jsxs(Tabs, { defaultValue: "published", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsxs(TabsTrigger, { value: "published", "data-testid": "tab-published-posts", children: ["Published (", publishedPosts.length, ")"] }), _jsxs(TabsTrigger, { value: "drafts", "data-testid": "tab-draft-posts", children: ["Drafts (", draftPosts.length, ")"] })] }), _jsx(TabsContent, { value: "published", className: "mt-6", children: loadingPublished ? (_jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 6 }).map((_, i) => (_jsxs(Card, { className: "animate-pulse", children: [_jsxs(CardHeader, { children: [_jsx("div", { className: "h-4 bg-muted rounded w-3/4" }), _jsx("div", { className: "h-6 bg-muted rounded w-full" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "h-3 bg-muted rounded" }), _jsx("div", { className: "h-3 bg-muted rounded w-5/6" })] }) })] }, i))) })) : publishedPosts.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(MessageSquare, { className: "w-12 h-12 mx-auto text-muted-foreground mb-4" }), _jsx("h3", { className: "text-lg font-semibold mb-2", children: "No published posts yet" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Share your ideas with the Village-One community" }), _jsxs(Button, { onClick: () => setShowEditor(true), "data-testid": "button-create-first-post", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create Your First Post"] })] })) : (_jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: publishedPosts.map((post) => (_jsx(PostCard, { post: post }, post.id))) })) }), _jsx(TabsContent, { value: "drafts", className: "mt-6", children: loadingDrafts ? (_jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 3 }).map((_, i) => (_jsxs(Card, { className: "animate-pulse", children: [_jsxs(CardHeader, { children: [_jsx("div", { className: "h-4 bg-muted rounded w-3/4" }), _jsx("div", { className: "h-6 bg-muted rounded w-full" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "h-3 bg-muted rounded" }), _jsx("div", { className: "h-3 bg-muted rounded w-5/6" })] }) })] }, i))) })) : draftPosts.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Edit, { className: "w-12 h-12 mx-auto text-muted-foreground mb-4" }), _jsx("h3", { className: "text-lg font-semibold mb-2", children: "No drafts saved" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Start writing and save drafts to continue later" }), _jsxs(Button, { onClick: () => setShowEditor(true), "data-testid": "button-create-first-draft", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Start Writing"] })] })) : (_jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: draftPosts.map((post) => (_jsx(PostCard, { post: post, isDraft: true }, post.id))) })) })] })] }));
}

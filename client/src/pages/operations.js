import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, MessageCircle, Plus, ServerCog, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
export default function Operations() {
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const queryClient = useQueryClient();
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const { data: posts, isLoading: postsLoading } = useQuery({
        queryKey: ['/api/posts/operations'],
    });
    const { data: sentiment } = useQuery({
        queryKey: ['/api/sentiments/operations'],
    });
    const { data: comments } = useQuery({
        queryKey: ['/api/comments', selectedPost],
        enabled: !!selectedPost,
    });
    const createPostMutation = useMutation({
        mutationFn: async (postData) => {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...postData,
                    forumSection: 'operations'
                })
            });
            if (!response.ok)
                throw new Error(`${response.status}: ${response.statusText}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/posts/operations'] });
            setNewPostTitle("");
            setNewPostContent("");
            setShowNewPostForm(false);
            toast({
                title: "Success",
                description: "Your post has been created successfully!",
            });
        },
        onError: (error) => {
            if (isUnauthorizedError(error)) {
                toast({
                    title: "Unauthorized",
                    description: "You are logged out. Logging in again...",
                    variant: "destructive",
                });
                setTimeout(() => {
                    window.location.href = "/api/login";
                }, 500);
                return;
            }
            toast({
                title: "Error",
                description: "Failed to create post. Please try again.",
                variant: "destructive",
            });
        },
    });
    const createCommentMutation = useMutation({
        mutationFn: async (commentData) => {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData)
            });
            if (!response.ok)
                throw new Error(`${response.status}: ${response.statusText}`);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/comments', selectedPost] });
            setNewComment("");
            toast({
                title: "Success",
                description: "Your comment has been added!",
            });
        },
        onError: (error) => {
            if (isUnauthorizedError(error)) {
                toast({
                    title: "Unauthorized",
                    description: "You are logged out. Logging in again...",
                    variant: "destructive",
                });
                setTimeout(() => {
                    window.location.href = "/api/login";
                }, 500);
                return;
            }
            toast({
                title: "Error",
                description: "Failed to add comment. Please try again.",
                variant: "destructive",
            });
        },
    });
    const handleCreatePost = () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please log in to create a post.",
                variant: "destructive",
            });
            setTimeout(() => {
                window.location.href = "/api/login";
            }, 500);
            return;
        }
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            toast({
                title: "Missing Information",
                description: "Please fill in both title and content.",
                variant: "destructive",
            });
            return;
        }
        createPostMutation.mutate({
            title: newPostTitle,
            content: newPostContent,
        });
    };
    const handleCreateComment = () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please log in to add a comment.",
                variant: "destructive",
            });
            setTimeout(() => {
                window.location.href = "/api/login";
            }, 500);
            return;
        }
        if (!newComment.trim() || !selectedPost)
            return;
        createCommentMutation.mutate({
            postId: selectedPost,
            content: newComment,
        });
    };
    const getSentimentColor = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'positive': return 'text-electric-green';
            case 'negative': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };
    const getSentimentBadgeColor = (sentiment) => {
        switch (sentiment?.toLowerCase()) {
            case 'positive': return 'bg-electric-green/20 text-electric-green';
            case 'negative': return 'bg-red-400/20 text-red-400';
            default: return 'bg-gray-400/20 text-gray-400';
        }
    };
    if (postsLoading) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-void to-space texture-organic pt-20", children: _jsx("div", { className: "max-w-6xl mx-auto px-6 py-12", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-electric-green mx-auto" }), _jsx("p", { className: "text-gray-400 mt-4", children: "Loading operations discussions..." })] }) }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-void to-space texture-organic pt-20", children: _jsxs("div", { className: "max-w-6xl mx-auto px-6 py-12", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsxs("div", { className: "flex items-center justify-center space-x-3 mb-6", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-electric-green to-neon-cyan rounded-xl flex items-center justify-center", children: _jsx(ServerCog, { className: "text-space", size: 28 }) }), _jsx("h1", { className: "text-5xl font-cyber font-bold text-electric-green", "data-testid": "text-operations-title", children: "Operations" })] }), _jsx("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto mb-8", children: "Revenue streams, business models, and operational strategies that keep Village-One sustainable" }), sentiment && (_jsxs(Card, { className: "max-w-2xl mx-auto bg-gradient-to-r from-void to-purple-deep border-purple-deep/50 mb-8", children: [_jsx(CardHeader, { className: "pb-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-electric-green to-neon-cyan rounded-lg flex items-center justify-center animate-pulse", children: _jsx(TrendingUp, { className: "text-space", size: 16 }) }), _jsx(CardTitle, { className: "text-lg text-electric-green", "data-testid": "text-ai-analysis", children: "AI Forum Analysis" }), _jsx(Badge, { className: getSentimentBadgeColor(sentiment.sentiment), "data-testid": "badge-sentiment", children: sentiment.sentiment })] }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-300 text-sm", "data-testid": "text-sentiment-summary", children: sentiment.summary }) })] })), _jsxs(Button, { onClick: () => setShowNewPostForm(!showNewPostForm), className: "bg-gradient-to-r from-electric-green to-neon-cyan text-space font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300", "data-testid": "button-new-post", children: [_jsx(Plus, { size: 20, className: "mr-2" }), "Start New Discussion"] })] }), showNewPostForm && (_jsxs(Card, { className: "max-w-4xl mx-auto mb-8 bg-gradient-to-r from-void to-purple-deep border-purple-deep/50", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-electric-green", "data-testid": "text-new-post-title", children: "New Operations Discussion" }), _jsx(CardDescription, { children: "Share ideas about revenue streams, business models, or operational strategies" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx(Input, { placeholder: "Discussion title...", value: newPostTitle, onChange: (e) => setNewPostTitle(e.target.value), className: "bg-space border-purple-deep text-white", "data-testid": "input-post-title" }), _jsx(Textarea, { placeholder: "Describe your operational idea, revenue model, or business strategy...", value: newPostContent, onChange: (e) => setNewPostContent(e.target.value), rows: 6, className: "bg-space border-purple-deep text-white resize-none", "data-testid": "textarea-post-content" }), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx(Button, { variant: "ghost", onClick: () => setShowNewPostForm(false), "data-testid": "button-cancel-post", children: "Cancel" }), _jsx(Button, { onClick: handleCreatePost, disabled: createPostMutation.isPending, className: "bg-electric-green text-space hover:bg-electric-green/80", "data-testid": "button-submit-post", children: createPostMutation.isPending ? "Posting..." : "Post Discussion" })] })] })] })), _jsxs("div", { className: "space-y-6", children: [posts?.map((post) => (_jsxs(Card, { className: "bg-gradient-to-r from-void to-purple-deep border-purple-deep/50 hover:border-electric-green/50 transition-all duration-300", "data-testid": `post-${post.id}`, children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx(CardTitle, { className: "text-white mb-2 hover:text-electric-green transition-colors cursor-pointer", "data-testid": `post-title-${post.id}`, children: post.title }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-gray-400", children: [_jsxs("span", { children: ["by ", post.author?.username || 'Anonymous'] }), _jsx("span", { className: "text-electric-green", children: post.author?.archetype || 'Village Builder' }), _jsx("span", { children: new Date(post.createdAt).toLocaleDateString() })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(ArrowUp, { size: 16, className: "text-electric-green" }), _jsx("span", { className: "text-electric-green text-sm", "data-testid": `upvotes-${post.id}`, children: post.upvotes })] }), post.downvotes > 0 && (_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(ArrowDown, { size: 16, className: "text-red-400" }), _jsx("span", { className: "text-red-400 text-sm", "data-testid": `downvotes-${post.id}`, children: post.downvotes })] }))] })] }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-gray-300 mb-4", "data-testid": `post-content-${post.id}`, children: post.content }), _jsx("div", { className: "flex items-center justify-between", children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedPost(selectedPost === post.id ? null : post.id), className: "text-gray-400 hover:text-electric-green", "data-testid": `button-comments-${post.id}`, children: [_jsx(MessageCircle, { size: 16, className: "mr-2" }), selectedPost === post.id ? 'Hide Comments' : 'View Comments'] }) }), selectedPost === post.id && (_jsxs("div", { className: "mt-6 pt-6 border-t border-purple-deep/50", children: [_jsx("h4", { className: "text-white font-semibold mb-4", "data-testid": `comments-header-${post.id}`, children: "Comments" }), _jsxs("div", { className: "mb-6", children: [_jsx(Textarea, { placeholder: "Add your thoughts on this operational strategy...", value: newComment, onChange: (e) => setNewComment(e.target.value), rows: 3, className: "bg-space border-purple-deep text-white resize-none mb-3", "data-testid": `textarea-comment-${post.id}` }), _jsx(Button, { onClick: handleCreateComment, disabled: createCommentMutation.isPending, size: "sm", className: "bg-electric-green text-space hover:bg-electric-green/80", "data-testid": `button-add-comment-${post.id}`, children: createCommentMutation.isPending ? "Adding..." : "Add Comment" })] }), _jsxs("div", { className: "space-y-4", children: [comments?.map((comment) => (_jsxs("div", { className: "bg-space/20 rounded-lg p-4", "data-testid": `comment-${comment.id}`, children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("span", { className: "text-white font-medium", "data-testid": `comment-author-${comment.id}`, children: comment.author?.username || 'Anonymous' }), _jsx("span", { className: "text-electric-green text-sm", children: comment.author?.archetype || 'Village Builder' }), _jsx("span", { className: "text-gray-500 text-sm", children: new Date(comment.createdAt).toLocaleDateString() })] }), _jsx("p", { className: "text-gray-300", "data-testid": `comment-content-${comment.id}`, children: comment.content })] }, comment.id))), comments?.length === 0 && (_jsx("p", { className: "text-gray-500 text-center py-4", "data-testid": `no-comments-${post.id}`, children: "No comments yet. Be the first to share your thoughts!" }))] })] }))] })] }, post.id))), posts?.length === 0 && (_jsx(Card, { className: "bg-gradient-to-r from-void to-purple-deep border-purple-deep/50 text-center py-12", children: _jsxs(CardContent, { children: [_jsx(ServerCog, { size: 48, className: "text-gray-600 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-white mb-2", "data-testid": "text-no-posts", children: "No discussions yet" }), _jsx("p", { className: "text-gray-400 mb-6", children: "Start the conversation about Village-One's operations and revenue models" }), _jsx(Button, { onClick: () => setShowNewPostForm(true), className: "bg-electric-green text-space hover:bg-electric-green/80", "data-testid": "button-first-post", children: "Create First Discussion" })] }) }))] })] }) }));
}

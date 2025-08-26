import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PostContent from "@/components/ui/post-content";
import { ArrowLeft, MessageCircle, ArrowUp, ArrowDown, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
const commentFormSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
});
export default function PostPage() {
    const { id } = useParams();
    const [, setLocation] = useLocation();
    const queryClient = useQueryClient();
    const { data: post, isLoading } = useQuery({
        queryKey: ['/api/post', id],
        enabled: !!id,
    });
    const { data: comments = [] } = useQuery({
        queryKey: ['/api/comments', id],
        enabled: !!id,
    });
    const form = useForm({
        resolver: zodResolver(commentFormSchema),
        defaultValues: {
            content: "",
        },
    });
    const createCommentMutation = useMutation({
        mutationFn: async (data) => {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    postId: id,
                })
            });
            if (!response.ok)
                throw new Error('Failed to create comment');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/comments', id] });
            form.reset();
        },
    });
    const onSubmit = (data) => {
        createCommentMutation.mutate(data);
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen p-8 bg-space flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-8 h-8 border-2 border-electric-green border-t-transparent rounded-full animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-gray-400", children: "Loading post..." })] }) }));
    }
    if (!post) {
        return (_jsx("div", { className: "min-h-screen p-8 bg-space flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-red-500 mb-4", children: "Post Not Found" }), _jsx("p", { className: "text-gray-400 mb-6", children: "The requested post could not be found." }), _jsx(Button, { onClick: () => setLocation("/forum/land"), className: "bg-electric-green text-space hover:bg-neon-cyan", children: "Back to Forums" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-space to-void p-6", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("div", { className: "mb-6", children: _jsx(Link, { href: `/forum/${post.forumSection}`, children: _jsxs(Button, { variant: "ghost", className: "text-gray-400 hover:text-white", "data-testid": "button-back", children: [_jsx(ArrowLeft, { className: "mr-2", size: 16 }), "Back to ", post.forumSection, " Forum"] }) }) }), _jsxs(Card, { className: "bg-void border-purple-deep mb-8", children: [_jsx(CardHeader, { className: "border-b border-purple-deep", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-2xl font-cyber font-bold text-white mb-3", "data-testid": "text-post-title", children: post.title }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-gray-400", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(User, { size: 16 }), _jsx(Link, { href: `/profile/${post.author?.id}`, className: "hover:text-electric-green transition-colors", children: post.author?.username || 'Unknown User' })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Calendar, { size: 16 }), _jsx("span", { children: post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Unknown' })] })] })] }), _jsxs("div", { className: "flex flex-col items-center space-y-2 ml-6", children: [_jsx(Button, { variant: "ghost", size: "sm", className: "text-gray-400 hover:text-electric-green", children: _jsx(ArrowUp, { size: 16 }) }), _jsx("span", { className: "text-sm font-bold text-electric-green", children: post.upvotes || 0 }), _jsx(Button, { variant: "ghost", size: "sm", className: "text-gray-400 hover:text-red-400", children: _jsx(ArrowDown, { size: 16 }) })] })] }) }), _jsx(CardContent, { className: "p-6", children: _jsx(PostContent, { content: post.content }) })] }), _jsxs(Card, { className: "bg-void border-purple-deep", children: [_jsx(CardHeader, { className: "border-b border-purple-deep", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(MessageCircle, { className: "text-neon-cyan", size: 20 }), _jsxs("h2", { className: "text-lg font-cyber font-bold text-white", children: ["Comments (", comments.length, ")"] })] }) }), _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "mb-6 p-4 bg-space rounded-lg border border-purple-deep", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-300 mb-3", children: "Add a comment" }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "content", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormControl, { children: _jsx(Textarea, { ...field, placeholder: "Share your thoughts on this post...", className: "bg-void border-purple-deep text-white placeholder:text-gray-500 focus:border-electric-green", rows: 3, "data-testid": "textarea-comment" }) }), _jsx(FormMessage, {})] })) }), _jsx(Button, { type: "submit", disabled: createCommentMutation.isPending, className: "bg-electric-green text-space hover:bg-neon-cyan", "data-testid": "button-submit-comment", children: createCommentMutation.isPending ? "Posting..." : "Post Comment" })] }) })] }), _jsx("div", { className: "space-y-4", children: comments.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(MessageCircle, { className: "mx-auto text-gray-600 mb-3", size: 48 }), _jsx("p", { className: "text-gray-400", children: "No comments yet. Be the first to share your thoughts!" })] })) : (comments.map((comment) => (_jsxs("div", { className: "border border-purple-deep rounded-lg p-4 bg-space/50", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx(Link, { href: `/profile/${comment.author?.id}`, className: "text-electric-green hover:text-neon-cyan font-semibold transition-colors", children: comment.author?.username || 'Unknown User' }), _jsx("span", { className: "text-xs text-gray-500", children: comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Unknown' })] }), _jsx("p", { className: "text-gray-300 leading-relaxed", children: comment.content })] }, comment.id)))) })] })] })] }) }));
}

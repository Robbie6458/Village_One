import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, MessageSquare, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
export default function PostCard({ post, currentUser }) {
    const [voteData, setVoteData] = useState({
        upvotes: post.upvotes || 0,
        downvotes: post.downvotes || 0,
        userVote: null
    });
    const queryClient = useQueryClient();
    // Fetch user's current vote for this post
    const { data: userVoteData } = useQuery({
        queryKey: [`/api/votes/${post.id}/user`],
        enabled: !!currentUser,
        staleTime: 30000, // Cache for 30 seconds
    });
    useEffect(() => {
        if (userVoteData) {
            setVoteData(prev => ({
                ...prev,
                userVote: userVoteData.voteType
            }));
        }
    }, [userVoteData]);
    const voteMutation = useMutation({
        mutationFn: (voteType) => apiRequest('POST', '/api/votes', {
            postId: post.id,
            voteType,
        }),
        onSuccess: (data) => {
            // Update local state with server response
            setVoteData({
                upvotes: data.upvotes,
                downvotes: data.downvotes,
                userVote: data.currentVote
            });
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['/api/posts', post.forumSection] });
            queryClient.invalidateQueries({ queryKey: [`/api/votes/${post.id}/user`] });
        },
    });
    const handleVote = (voteType) => {
        if (!currentUser) {
            // Redirect to login if not authenticated
            window.location.href = '/api/login';
            return;
        }
        voteMutation.mutate(voteType);
    };
    const netScore = voteData.upvotes - voteData.downvotes;
    const scoreColor = netScore > 0 ? 'text-electric-green' : netScore < 0 ? 'text-red-400' : 'text-gray-400';
    return (_jsxs(Card, { className: "bg-gradient-to-br from-void to-space border-purple-deep hover:border-neon-cyan transition-colors duration-300", "data-testid": `card-post-${post.id}`, children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-xl font-semibold text-white mb-2", "data-testid": `text-post-title-${post.id}`, children: post.title }), _jsxs("div", { className: "flex items-center space-x-4 text-sm text-gray-400", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(User, { size: 16 }), _jsx("span", { "data-testid": `text-post-author-${post.id}`, children: post.author?.username || 'Anonymous' }), post.author?.archetype && (_jsxs("span", { className: "text-neon-cyan", "data-testid": `text-post-archetype-${post.id}`, children: ["\u2022 ", post.author.archetype] }))] }), _jsx("div", { className: "text-gray-500", children: new Date(post.createdAt).toLocaleDateString() })] })] }), _jsxs("div", { className: cn("text-center px-4", scoreColor), children: [_jsx("div", { className: "text-lg font-bold", "data-testid": `text-post-score-${post.id}`, children: netScore > 0 ? `+${netScore}` : netScore }), _jsx("div", { className: "text-xs text-gray-400", children: "score" })] })] }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-gray-300 leading-relaxed mb-6", "data-testid": `text-post-content-${post.id}`, children: post.content }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => handleVote('upvote'), disabled: voteMutation.isPending, className: cn("text-gray-400 hover:text-electric-green", voteData.userVote === 'upvote' && "text-electric-green bg-electric-green/10"), "data-testid": `button-upvote-${post.id}`, children: [_jsx(ArrowUp, { size: 16 }), _jsx("span", { className: "ml-1", children: voteData.upvotes })] }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => handleVote('downvote'), disabled: voteMutation.isPending, className: cn("text-gray-400 hover:text-red-400", voteData.userVote === 'downvote' && "text-red-400 bg-red-400/10"), "data-testid": `button-downvote-${post.id}`, children: [_jsx(ArrowDown, { size: 16 }), _jsx("span", { className: "ml-1", children: voteData.downvotes })] })] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "text-gray-400 hover:text-neon-cyan", "data-testid": `button-comment-${post.id}`, children: [_jsx(MessageSquare, { size: 16 }), _jsx("span", { className: "ml-1", children: "Comment" })] })] })] })] }));
}

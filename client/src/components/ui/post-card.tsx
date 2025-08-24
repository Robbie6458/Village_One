import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, MessageSquare, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    authorId: string;
    forumSection: string;
    upvotes: number;
    downvotes: number;
    createdAt: string;
    author?: {
      username: string;
      archetype?: string;
      level?: number;
    };
  };
  currentUser?: {
    id: string;
    username: string;
  } | null;
}

export default function PostCard({ post, currentUser }: PostCardProps) {
  const [voteData, setVoteData] = useState({
    upvotes: post.upvotes || 0,
    downvotes: post.downvotes || 0,
    userVote: null as 'upvote' | 'downvote' | null
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
    mutationFn: (voteType: 'upvote' | 'downvote') =>
      apiRequest('POST', '/api/votes', {
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

  const handleVote = (voteType: 'upvote' | 'downvote') => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      window.location.href = '/api/login';
      return;
    }
    voteMutation.mutate(voteType);
  };

  const netScore = voteData.upvotes - voteData.downvotes;
  const scoreColor = netScore > 0 ? 'text-electric-green' : netScore < 0 ? 'text-red-400' : 'text-gray-400';

  return (
    <Card 
      className="bg-gradient-to-br from-void to-space border-purple-deep hover:border-neon-cyan transition-colors duration-300"
      data-testid={`card-post-${post.id}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2" data-testid={`text-post-title-${post.id}`}>
              {post.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span data-testid={`text-post-author-${post.id}`}>
                  {post.author?.username || 'Anonymous'}
                </span>
                {post.author?.archetype && (
                  <span className="text-neon-cyan" data-testid={`text-post-archetype-${post.id}`}>
                    • {post.author.archetype}
                  </span>
                )}
              </div>
              <div className="text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Vote Score */}
          <div className={cn("text-center px-4", scoreColor)}>
            <div className="text-lg font-bold" data-testid={`text-post-score-${post.id}`}>
              {netScore > 0 ? `+${netScore}` : netScore}
            </div>
            <div className="text-xs text-gray-400">score</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-300 leading-relaxed mb-6" data-testid={`text-post-content-${post.id}`}>
          {post.content}
        </p>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('upvote')}
              disabled={voteMutation.isPending}
              className={cn(
                "text-gray-400 hover:text-electric-green",
                voteData.userVote === 'upvote' && "text-electric-green bg-electric-green/10"
              )}
              data-testid={`button-upvote-${post.id}`}
            >
              <ArrowUp size={16} />
              <span className="ml-1">{voteData.upvotes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote('downvote')}
              disabled={voteMutation.isPending}
              className={cn(
                "text-gray-400 hover:text-red-400",
                voteData.userVote === 'downvote' && "text-red-400 bg-red-400/10"
              )}
              data-testid={`button-downvote-${post.id}`}
            >
              <ArrowDown size={16} />
              <span className="ml-1">{voteData.downvotes}</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-neon-cyan"
            data-testid={`button-comment-${post.id}`}
          >
            <MessageSquare size={16} />
            <span className="ml-1">Comment</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

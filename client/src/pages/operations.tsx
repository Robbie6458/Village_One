import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, MessageCircle, Plus, ServerCog, Calendar, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Post {
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
    archetype: string;
  };
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  author?: {
    username: string;
    archetype: string;
  };
}

interface ForumSentiment {
  section: string;
  sentiment: string;
  confidence: number;
  summary: string;
}

export default function Operations() {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts/operations'],
  });

  const { data: sentiment } = useQuery<ForumSentiment>({
    queryKey: ['/api/sentiments/operations'],
  });

  const { data: comments } = useQuery<Comment[]>({
    queryKey: ['/api/comments', selectedPost],
    enabled: !!selectedPost,
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string }) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postData,
          forumSection: 'operations'
        })
      });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
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
      if (isUnauthorizedError(error as Error)) {
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
    mutationFn: async (commentData: { postId: string; content: string }) => {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
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
      if (isUnauthorizedError(error as Error)) {
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

    if (!newComment.trim() || !selectedPost) return;

    createCommentMutation.mutate({
      postId: selectedPost,
      content: newComment,
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-electric-green';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'bg-electric-green/20 text-electric-green';
      case 'negative': return 'bg-red-400/20 text-red-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-void to-space texture-organic pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-green mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading operations discussions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-void to-space texture-organic pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-electric-green to-neon-cyan rounded-xl flex items-center justify-center">
              <ServerCog className="text-space" size={28} />
            </div>
            <h1 className="text-5xl font-cyber font-bold text-electric-green" data-testid="text-operations-title">
              Operations
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Revenue streams, business models, and operational strategies that keep Village-One sustainable
          </p>

          {/* AI Forum Analysis */}
          {sentiment && (
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-void to-purple-deep border-purple-deep/50 mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-electric-green to-neon-cyan rounded-lg flex items-center justify-center animate-pulse">
                    <TrendingUp className="text-space" size={16} />
                  </div>
                  <CardTitle className="text-lg text-electric-green" data-testid="text-ai-analysis">AI Forum Analysis</CardTitle>
                  <Badge className={getSentimentBadgeColor(sentiment.sentiment)} data-testid="badge-sentiment">
                    {sentiment.sentiment}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm" data-testid="text-sentiment-summary">
                  {sentiment.summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* New Post Button */}
          <Button 
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="bg-gradient-to-r from-electric-green to-neon-cyan text-space font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300"
            data-testid="button-new-post"
          >
            <Plus size={20} className="mr-2" />
            Start New Discussion
          </Button>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <Card className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-void to-purple-deep border-purple-deep/50">
            <CardHeader>
              <CardTitle className="text-electric-green" data-testid="text-new-post-title">New Operations Discussion</CardTitle>
              <CardDescription>Share ideas about revenue streams, business models, or operational strategies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Discussion title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="bg-space border-purple-deep text-white"
                data-testid="input-post-title"
              />
              <Textarea
                placeholder="Describe your operational idea, revenue model, or business strategy..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={6}
                className="bg-space border-purple-deep text-white resize-none"
                data-testid="textarea-post-content"
              />
              <div className="flex justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowNewPostForm(false)}
                  data-testid="button-cancel-post"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={createPostMutation.isPending}
                  className="bg-electric-green text-space hover:bg-electric-green/80"
                  data-testid="button-submit-post"
                >
                  {createPostMutation.isPending ? "Posting..." : "Post Discussion"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-6">
          {posts?.map((post) => (
            <Card 
              key={post.id} 
              className="bg-gradient-to-r from-void to-purple-deep border-purple-deep/50 hover:border-electric-green/50 transition-all duration-300"
              data-testid={`post-${post.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white mb-2 hover:text-electric-green transition-colors cursor-pointer" data-testid={`post-title-${post.id}`}>
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>by {post.author?.username || 'Anonymous'}</span>
                      <span className="text-electric-green">{post.author?.archetype || 'Village Builder'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ArrowUp size={16} className="text-electric-green" />
                      <span className="text-electric-green text-sm" data-testid={`upvotes-${post.id}`}>{post.upvotes}</span>
                    </div>
                    {post.downvotes > 0 && (
                      <div className="flex items-center space-x-1">
                        <ArrowDown size={16} className="text-red-400" />
                        <span className="text-red-400 text-sm" data-testid={`downvotes-${post.id}`}>{post.downvotes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4" data-testid={`post-content-${post.id}`}>{post.content}</p>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                    className="text-gray-400 hover:text-electric-green"
                    data-testid={`button-comments-${post.id}`}
                  >
                    <MessageCircle size={16} className="mr-2" />
                    {selectedPost === post.id ? 'Hide Comments' : 'View Comments'}
                  </Button>
                </div>

                {/* Comments Section */}
                {selectedPost === post.id && (
                  <div className="mt-6 pt-6 border-t border-purple-deep/50">
                    <h4 className="text-white font-semibold mb-4" data-testid={`comments-header-${post.id}`}>Comments</h4>
                    
                    {/* New Comment Form */}
                    <div className="mb-6">
                      <Textarea
                        placeholder="Add your thoughts on this operational strategy..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        className="bg-space border-purple-deep text-white resize-none mb-3"
                        data-testid={`textarea-comment-${post.id}`}
                      />
                      <Button
                        onClick={handleCreateComment}
                        disabled={createCommentMutation.isPending}
                        size="sm"
                        className="bg-electric-green text-space hover:bg-electric-green/80"
                        data-testid={`button-add-comment-${post.id}`}
                      >
                        {createCommentMutation.isPending ? "Adding..." : "Add Comment"}
                      </Button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments?.map((comment) => (
                        <div key={comment.id} className="bg-space/20 rounded-lg p-4" data-testid={`comment-${comment.id}`}>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-white font-medium" data-testid={`comment-author-${comment.id}`}>
                              {comment.author?.username || 'Anonymous'}
                            </span>
                            <span className="text-electric-green text-sm">
                              {comment.author?.archetype || 'Village Builder'}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300" data-testid={`comment-content-${comment.id}`}>{comment.content}</p>
                        </div>
                      ))}
                      {comments?.length === 0 && (
                        <p className="text-gray-500 text-center py-4" data-testid={`no-comments-${post.id}`}>
                          No comments yet. Be the first to share your thoughts!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {posts?.length === 0 && (
            <Card className="bg-gradient-to-r from-void to-purple-deep border-purple-deep/50 text-center py-12">
              <CardContent>
                <ServerCog size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2" data-testid="text-no-posts">No discussions yet</h3>
                <p className="text-gray-400 mb-6">
                  Start the conversation about Village-One's operations and revenue models
                </p>
                <Button
                  onClick={() => setShowNewPostForm(true)}
                  className="bg-electric-green text-space hover:bg-electric-green/80"
                  data-testid="button-first-post"
                >
                  Create First Discussion
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import PostContent from "@/components/ui/post-content";
import { ArrowLeft, MessageCircle, ArrowUp, ArrowDown, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Post, User as UserType, Comment } from "../../../shared/types";

interface PostWithAuthor extends Post {
  author: UserType;
  comments?: CommentWithAuthor[];
}

interface CommentWithAuthor extends Comment {
  author: UserType;
}

const commentFormSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
});

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery<PostWithAuthor>({
    queryKey: ['/api/post', id],
    enabled: !!id,
  });

  const { data: comments = [] } = useQuery<CommentWithAuthor[]>({
    queryKey: ['/api/comments', id],
    enabled: !!id,
  });

  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof commentFormSchema>) => {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          postId: id,
        })
      });
      if (!response.ok) throw new Error('Failed to create comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments', id] });
      form.reset();
    },
  });

  const onSubmit = (data: z.infer<typeof commentFormSchema>) => {
    createCommentMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 bg-space flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-electric-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen p-8 bg-space flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-6">The requested post could not be found.</p>
          <Button onClick={() => setLocation("/forum/land")} className="bg-electric-green text-space hover:bg-neon-cyan">
            Back to Forums
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-space to-void p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href={`/forum/${post.forumSection}`}>
            <Button variant="ghost" className="text-gray-400 hover:text-white" data-testid="button-back">
              <ArrowLeft className="mr-2" size={16} />
              Back to {post.forumSection} Forum
            </Button>
          </Link>
        </div>

        {/* Post */}
        <Card className="bg-void border-purple-deep mb-8">
          <CardHeader className="border-b border-purple-deep">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-cyber font-bold text-white mb-3" data-testid="text-post-title">
                  {post.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <Link href={`/profile/${post.author?.id}`} className="hover:text-electric-green transition-colors">
                      {post.author?.username || 'Unknown User'}
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>
                      {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2 ml-6">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-electric-green">
                  <ArrowUp size={16} />
                </Button>
                <span className="text-sm font-bold text-electric-green">{post.upvotes || 0}</span>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
                  <ArrowDown size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <PostContent content={post.content} />
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="bg-void border-purple-deep">
          <CardHeader className="border-b border-purple-deep">
            <div className="flex items-center space-x-2">
              <MessageCircle className="text-neon-cyan" size={20} />
              <h2 className="text-lg font-cyber font-bold text-white">
                Comments ({comments.length})
              </h2>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Add Comment Form */}
            <div className="mb-6 p-4 bg-space rounded-lg border border-purple-deep">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Add a comment</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Share your thoughts on this post..."
                            className="bg-void border-purple-deep text-white placeholder:text-gray-500 focus:border-electric-green"
                            rows={3}
                            data-testid="textarea-comment"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={createCommentMutation.isPending}
                    className="bg-electric-green text-space hover:bg-neon-cyan"
                    data-testid="button-submit-comment"
                  >
                    {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="mx-auto text-gray-600 mb-3" size={48} />
                  <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border border-purple-deep rounded-lg p-4 bg-space/50">
                    <div className="flex items-center justify-between mb-3">
                      <Link 
                        href={`/profile/${comment.author?.id}`} 
                        className="text-electric-green hover:text-neon-cyan font-semibold transition-colors"
                      >
                        {comment.author?.username || 'Unknown User'}
                      </Link>
                      <span className="text-xs text-gray-500">
                        {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Unknown'}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
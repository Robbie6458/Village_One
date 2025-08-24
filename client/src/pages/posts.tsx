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
import { FORUM_SECTIONS } from "@shared/types";
import type { Post } from "@shared/types";

export default function PostsPage() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Fetch user's published posts
  const { data: publishedPosts = [], isLoading: loadingPublished } = useQuery<Post[]>({
    queryKey: ["/api/posts/user/me"]
  });

  // Fetch user's draft posts
  const { data: draftPosts = [], isLoading: loadingDrafts } = useQuery<Post[]>({
    queryKey: ["/api/users/me/drafts"]
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (sectionId: string) => {
    return FORUM_SECTIONS.find(section => section.id === sectionId)?.name || sectionId;
  };

  const handlePostSaved = (post: Post) => {
    setSelectedPost(null);
    setShowEditor(false);
  };

  const PostCard = ({ post, isDraft = false }: { post: Post; isDraft?: boolean }) => (
    <Card key={post.id} className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {getCategoryName(post.forumSection)}
              </Badge>
              <Badge 
                variant={isDraft ? "secondary" : "default"}
                className="text-xs"
              >
                {isDraft ? "Draft" : "Published"}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight">
              {post.title}
            </CardTitle>
          </div>
          <Dialog open={selectedPost?.id === post.id} onOpenChange={(open) => !open && setSelectedPost(null)}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPost(post)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`button-edit-post-${post.id}`}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Post</DialogTitle>
              </DialogHeader>
              <PostEditor
                post={selectedPost || undefined}
                onSave={handlePostSaved}
                onCancel={() => setSelectedPost(null)}
                showInModal={true}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {post.content}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {isDraft 
                ? `Updated ${formatDate(post.updatedAt || post.createdAt || new Date())}`
                : `Published ${formatDate(post.publishedAt || post.createdAt || new Date())}`
              }
            </div>
            {!isDraft && (
              <>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {post.upvotes || 0}
                </div>
                <Link href={`/forum/${post.forumSection}/${post.id}`} className="flex items-center gap-1 hover:text-primary">
                  <Eye className="w-3 h-3" />
                  View Post
                </Link>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Posts</h1>
          <p className="text-muted-foreground">
            Manage your published posts and drafts
          </p>
        </div>
        
        <Dialog open={showEditor} onOpenChange={setShowEditor}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-new-post">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <PostEditor
              onSave={handlePostSaved}
              onCancel={() => setShowEditor(false)}
              showInModal={true}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="published" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="published" data-testid="tab-published-posts">
            Published ({publishedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" data-testid="tab-draft-posts">
            Drafts ({draftPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="mt-6">
          {loadingPublished ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-6 bg-muted rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : publishedPosts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No published posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Share your ideas with the Village-One community
              </p>
              <Button onClick={() => setShowEditor(true)} data-testid="button-create-first-post">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {publishedPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="drafts" className="mt-6">
          {loadingDrafts ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-6 bg-muted rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : draftPosts.length === 0 ? (
            <div className="text-center py-12">
              <Edit className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No drafts saved</h3>
              <p className="text-muted-foreground mb-4">
                Start writing and save drafts to continue later
              </p>
              <Button onClick={() => setShowEditor(true)} data-testid="button-create-first-draft">
                <Plus className="w-4 h-4 mr-2" />
                Start Writing
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {draftPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} isDraft={true} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
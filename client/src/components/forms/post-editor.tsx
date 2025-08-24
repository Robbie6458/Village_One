import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Send, Edit3, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FORUM_SECTIONS } from "@shared/types";
import type { Post } from "@shared/types";

// Form validation schema
const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  content: z.string().min(1, "Content is required").min(10, "Content must be at least 10 characters"),
  forumSection: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published"])
});

type PostFormData = z.infer<typeof postFormSchema>;

interface PostEditorProps {
  post?: Post; // For editing existing posts
  defaultCategory?: string; // Pre-select category when creating from forum page
  onSave?: (post: Post) => void;
  onCancel?: () => void;
  showInModal?: boolean;
}

export function PostEditor({ 
  post, 
  defaultCategory, 
  onSave, 
  onCancel,
  showInModal = false 
}: PostEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      forumSection: post?.forumSection || defaultCategory || "",
      status: post?.status || "draft"
    }
  });

  // Create new post
  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to create post");
      return response.json();
    },
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/me/drafts"] });
      toast({
        title: "Success",
        description: newPost.status === "published" ? "Post published successfully!" : "Draft saved successfully!"
      });
      onSave?.(newPost);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive"
      });
    }
  });

  // Update existing post
  const updatePostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const response = await fetch(`/api/posts/${post!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to update post");
      return response.json();
    },
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/me/drafts"] });
      toast({
        title: "Success",
        description: "Post updated successfully!"
      });
      onSave?.(updatedPost);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive"
      });
    }
  });

  // Publish draft
  const publishMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${post!.id}/publish`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to publish post");
      return response.json();
    },
    onSuccess: (publishedPost) => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/me/drafts"] });
      toast({
        title: "Success",
        description: "Post published successfully!"
      });
      onSave?.(publishedPost);
    }
  });

  // Revert to draft
  const revertMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${post!.id}/revert`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to revert post");
      return response.json();
    },
    onSuccess: (draftPost) => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users/me/drafts"] });
      toast({
        title: "Success",
        description: "Post reverted to draft"
      });
      onSave?.(draftPost);
    }
  });

  const onSubmit = (data: PostFormData) => {
    if (post) {
      updatePostMutation.mutate(data);
    } else {
      createPostMutation.mutate(data);
    }
  };

  const saveDraft = () => {
    const data = { ...form.getValues(), status: "draft" as const };
    if (post) {
      updatePostMutation.mutate(data);
    } else {
      createPostMutation.mutate(data);
    }
  };

  const publishNow = () => {
    const data = { ...form.getValues(), status: "published" as const };
    if (post) {
      updatePostMutation.mutate(data);
    } else {
      createPostMutation.mutate(data);
    }
  };

  const isLoading = createPostMutation.isPending || 
                   updatePostMutation.isPending || 
                   publishMutation.isPending || 
                   revertMutation.isPending;

  const content = (
    <div className="space-y-6">
      {/* Status Badge for existing posts */}
      {post && (
        <div className="flex items-center justify-between">
          <Badge 
            variant={post.status === "published" ? "default" : "secondary"}
            className="mb-4"
          >
            {post.status === "published" ? "Published" : "Draft"}
          </Badge>
          
          {/* Quick actions for existing posts */}
          <div className="flex gap-2">
            {post.status === "draft" && (
              <Button
                onClick={() => publishMutation.mutate()}
                disabled={isLoading}
                size="sm"
                data-testid="button-publish-draft"
              >
                <Send className="w-4 h-4 mr-1" />
                Publish
              </Button>
            )}
            {post.status === "published" && (
              <Button
                onClick={() => revertMutation.mutate()}
                disabled={isLoading}
                variant="outline"
                size="sm"
                data-testid="button-revert-to-draft"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Revert to Draft
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Toggle Preview Mode */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {post ? "Edit Post" : "Create New Post"}
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPreviewMode(!previewMode)}
          data-testid="button-toggle-preview"
        >
          <Eye className="w-4 h-4 mr-1" />
          {previewMode ? "Edit" : "Preview"}
        </Button>
      </div>

      {previewMode ? (
        // Preview Mode
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{form.watch("title") || "Untitled Post"}</CardTitle>
              <Badge variant="outline">
                {FORUM_SECTIONS.find(section => section.id === form.watch("forumSection"))?.name || "No Category"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              {form.watch("content")?.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              )) || <p className="text-muted-foreground">No content yet...</p>}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Edit Mode
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter post title..." 
                      {...field}
                      data-testid="input-post-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="forumSection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-post-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORUM_SECTIONS.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content here..."
                      className="min-h-[200px] resize-y"
                      {...field}
                      data-testid="textarea-post-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}

      {/* Action Buttons */}
      {!previewMode && (
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={saveDraft}
            variant="outline"
            disabled={isLoading}
            data-testid="button-save-draft"
          >
            <Save className="w-4 h-4 mr-1" />
            Save Draft
          </Button>
          
          <Button
            type="button"
            onClick={publishNow}
            disabled={isLoading || !form.formState.isValid}
            data-testid="button-publish-post"
          >
            <Send className="w-4 h-4 mr-1" />
            {post?.status === "published" ? "Update & Publish" : "Publish Now"}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (showInModal) {
    return content;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        {content}
      </CardContent>
    </Card>
  );
}
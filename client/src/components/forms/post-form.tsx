import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Send } from "lucide-react";

const FORUM_CATEGORIES = [
  { value: "land", label: "Land & Location" },
  { value: "resources", label: "Resources & Materials" },
  { value: "people", label: "People & Community" },
  { value: "buildings", label: "Buildings & Infrastructure" },
  { value: "operations", label: "Operations & Management" },
  { value: "ownership", label: "Ownership & Governance" },
];

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(1, "Content is required").min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
});

type PostFormData = z.infer<typeof postFormSchema>;

interface PostFormProps {
  onClose: () => void;
  draft?: any;
  initialCategory?: string;
  mode?: 'create' | 'edit-draft' | 'edit-post';
  postId?: string;
}

export function PostForm({ onClose, draft, initialCategory, mode = 'create', postId }: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: draft?.title || "",
      content: draft?.content || "",
      category: draft?.category || initialCategory || "",
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      if (mode === 'edit-draft' && draft) {
        return apiRequest(`/api/users/me/drafts/${draft.id}`, 'PATCH', data);
      } else {
        return apiRequest('/api/users/me/drafts', 'POST', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me/drafts'] });
      toast({
        title: "Draft Saved",
        description: "Your post has been saved as a draft.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save draft",
        variant: "destructive",
      });
    },
  });

  const publishPostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      if (mode === 'edit-post' && postId) {
        return apiRequest(`/api/posts/${postId}`, 'PATCH', data);
      } else {
        // Create new post
        const response = await apiRequest('/api/posts', 'POST', data);
        
        // If this was created from a draft, delete the draft
        if (draft) {
          await apiRequest(`/api/users/me/drafts/${draft.id}`, 'DELETE');
        }
        
        return response;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me/drafts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts', 'user'] });
      
      toast({
        title: mode === 'edit-post' ? "Post Updated" : "Post Published",
        description: `Your post has been ${mode === 'edit-post' ? 'updated' : 'published'} successfully.`,
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to publish post",
        variant: "destructive",
      });
    },
  });

  const deleteDraftMutation = useMutation({
    mutationFn: async () => {
      if (draft) {
        return apiRequest(`/api/users/me/drafts/${draft.id}`, 'DELETE');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/me/drafts'] });
      toast({
        title: "Draft Deleted",
        description: "Your draft has been deleted.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete draft",
        variant: "destructive",
      });
    },
  });

  const onSaveDraft = (data: PostFormData) => {
    saveDraftMutation.mutate(data);
  };

  const onPublish = (data: PostFormData) => {
    publishPostMutation.mutate(data);
  };

  const onDeleteDraft = () => {
    if (confirm("Are you sure you want to delete this draft?")) {
      deleteDraftMutation.mutate();
    }
  };

  const getTitle = () => {
    if (mode === 'edit-post') return 'Edit Post';
    if (mode === 'edit-draft') return 'Edit Draft';
    return draft ? 'Continue Draft' : 'Create New Post';
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORUM_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter post title..." 
                      {...field} 
                      data-testid="input-title"
                    />
                  </FormControl>
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
                      placeholder="Write your post content..." 
                      rows={10}
                      {...field} 
                      data-testid="textarea-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <div className="space-x-2">
                {mode === 'edit-draft' && draft && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onDeleteDraft}
                    disabled={deleteDraftMutation.isPending}
                    data-testid="button-delete-draft"
                  >
                    {deleteDraftMutation.isPending ? "Deleting..." : "Delete Draft"}
                  </Button>
                )}
              </div>

              <div className="space-x-2">
                <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
                  Cancel
                </Button>
                
                {mode !== 'edit-post' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={form.handleSubmit(onSaveDraft)}
                    disabled={saveDraftMutation.isPending}
                    data-testid="button-save-draft"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saveDraftMutation.isPending ? "Saving..." : "Save Draft"}
                  </Button>
                )}
                
                <Button
                  onClick={form.handleSubmit(onPublish)}
                  disabled={publishPostMutation.isPending}
                  data-testid="button-publish"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {publishPostMutation.isPending ? 
                    "Publishing..." : 
                    mode === 'edit-post' ? "Update Post" : "Publish Post"
                  }
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
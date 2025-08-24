import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface PostCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: string;
}

const FORUM_CATEGORIES = [
  { id: "land", name: "Land & Location" },
  { id: "resources", name: "Resources & Materials" },
  { id: "people", name: "People & Community" },
  { id: "facilities", name: "Buildings & Infrastructure" },
  { id: "operations", name: "Operations & Business" },
  { id: "ownership", name: "Ownership & Governance" }
];

export function PostCreateDialog({ open, onOpenChange, defaultCategory = "land" }: PostCreateDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: defaultCategory,
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormValues) => {
      return apiRequest("/api/posts", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Post Created",
        description: "Your post has been shared with the community.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PostFormValues) => {
    createPostMutation.mutate(data);
  };

  return (
    <DialogContent className="bg-void border-purple-deep text-white max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-neon-cyan font-cyber">Create New Post</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-space border-purple-deep text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-void border-purple-deep">
                    {FORUM_CATEGORIES.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id}
                        className="text-white hover:bg-purple-deep"
                      >
                        {category.name}
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
                <FormLabel className="text-gray-300">Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter post title..."
                    className="bg-space border-purple-deep text-white"
                    data-testid="input-post-title"
                    {...field}
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
                <FormLabel className="text-gray-300">Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts, ideas, or questions..."
                    className="bg-space border-purple-deep text-white min-h-[150px]"
                    data-testid="textarea-post-content"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPostMutation.isPending}
              className="bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold"
              data-testid="button-submit"
            >
              {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
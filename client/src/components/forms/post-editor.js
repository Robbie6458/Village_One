import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { useToast } from "@/hooks/use-toast";
import { FORUM_SECTIONS } from "../../../../shared/types";
// Form validation schema
const postFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
    content: z.string().min(1, "Content is required").min(10, "Content must be at least 10 characters"),
    forumSection: z.string().min(1, "Category is required"),
    status: z.enum(["draft", "published"])
});
export function PostEditor({ post, defaultCategory, onSave, onCancel, showInModal = false }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [previewMode, setPreviewMode] = useState(false);
    const form = useForm({
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
        mutationFn: async (data) => {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok)
                throw new Error("Failed to create post");
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
        mutationFn: async (data) => {
            const response = await fetch(`/api/posts/${post.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!response.ok)
                throw new Error("Failed to update post");
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
            const response = await fetch(`/api/posts/${post.id}/publish`, {
                method: "POST"
            });
            if (!response.ok)
                throw new Error("Failed to publish post");
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
            const response = await fetch(`/api/posts/${post.id}/revert`, {
                method: "POST"
            });
            if (!response.ok)
                throw new Error("Failed to revert post");
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
    const onSubmit = (data) => {
        if (post) {
            updatePostMutation.mutate(data);
        }
        else {
            createPostMutation.mutate(data);
        }
    };
    const saveDraft = () => {
        const data = { ...form.getValues(), status: "draft" };
        if (post) {
            updatePostMutation.mutate(data);
        }
        else {
            createPostMutation.mutate(data);
        }
    };
    const publishNow = () => {
        const data = { ...form.getValues(), status: "published" };
        if (post) {
            updatePostMutation.mutate(data);
        }
        else {
            createPostMutation.mutate(data);
        }
    };
    const isLoading = createPostMutation.isPending ||
        updatePostMutation.isPending ||
        publishMutation.isPending ||
        revertMutation.isPending;
    const content = (_jsxs("div", { className: "space-y-6", children: [post && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Badge, { variant: post.status === "published" ? "default" : "secondary", className: "mb-4", children: post.status === "published" ? "Published" : "Draft" }), _jsxs("div", { className: "flex gap-2", children: [post.status === "draft" && (_jsxs(Button, { onClick: () => publishMutation.mutate(), disabled: isLoading, size: "sm", "data-testid": "button-publish-draft", children: [_jsx(Send, { className: "w-4 h-4 mr-1" }), "Publish"] })), post.status === "published" && (_jsxs(Button, { onClick: () => revertMutation.mutate(), disabled: isLoading, variant: "outline", size: "sm", "data-testid": "button-revert-to-draft", children: [_jsx(Edit3, { className: "w-4 h-4 mr-1" }), "Revert to Draft"] }))] })] })), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-lg font-semibold", children: post ? "Edit Post" : "Create New Post" }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setPreviewMode(!previewMode), "data-testid": "button-toggle-preview", children: [_jsx(Eye, { className: "w-4 h-4 mr-1" }), previewMode ? "Edit" : "Preview"] })] }), previewMode ? (
            // Preview Mode
            _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { children: form.watch("title") || "Untitled Post" }), _jsx(Badge, { variant: "outline", children: FORUM_SECTIONS.find(section => section.id === form.watch("forumSection"))?.name || "No Category" })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "prose dark:prose-invert max-w-none", children: form.watch("content")?.split('\n').map((paragraph, index) => (_jsx("p", { className: "mb-4", children: paragraph }, index))) || _jsx("p", { className: "text-muted-foreground", children: "No content yet..." }) }) })] })) : (
            // Edit Mode
            _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Title" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Enter post title...", ...field, "data-testid": "input-post-title" }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "forumSection", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Category" }), _jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [_jsx(FormControl, { children: _jsx(SelectTrigger, { "data-testid": "select-post-category", children: _jsx(SelectValue, { placeholder: "Select a category" }) }) }), _jsx(SelectContent, { children: FORUM_SECTIONS.map((section) => (_jsx(SelectItem, { value: section.id, children: section.name }, section.id))) })] }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "content", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Content" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Write your post content here...", className: "min-h-[200px] resize-y", ...field, "data-testid": "textarea-post-content" }) }), _jsx(FormMessage, {})] })) })] }) })), !previewMode && (_jsxs("div", { className: "flex gap-3 pt-4", children: [_jsxs(Button, { type: "button", onClick: saveDraft, variant: "outline", disabled: isLoading, "data-testid": "button-save-draft", children: [_jsx(Save, { className: "w-4 h-4 mr-1" }), "Save Draft"] }), _jsxs(Button, { type: "button", onClick: publishNow, disabled: isLoading || !form.formState.isValid, "data-testid": "button-publish-post", children: [_jsx(Send, { className: "w-4 h-4 mr-1" }), post?.status === "published" ? "Update & Publish" : "Publish Now"] }), onCancel && (_jsx(Button, { type: "button", variant: "ghost", onClick: onCancel, "data-testid": "button-cancel-edit", children: "Cancel" }))] }))] }));
    if (showInModal) {
        return content;
    }
    return (_jsx(Card, { className: "w-full max-w-4xl mx-auto", children: _jsx(CardContent, { className: "p-6", children: content }) }));
}

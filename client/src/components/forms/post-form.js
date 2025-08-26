import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export function PostForm({ onClose, draft, initialCategory, mode = 'create', postId }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const form = useForm({
        resolver: zodResolver(postFormSchema),
        defaultValues: {
            title: draft?.title || "",
            content: draft?.content || "",
            category: draft?.category || initialCategory || "",
        },
    });
    const saveDraftMutation = useMutation({
        mutationFn: async (data) => {
            if (mode === 'edit-draft' && draft) {
                return apiRequest(`/api/users/me/drafts/${draft.id}`, 'PATCH', data);
            }
            else {
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
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to save draft",
                variant: "destructive",
            });
        },
    });
    const publishPostMutation = useMutation({
        mutationFn: async (data) => {
            if (mode === 'edit-post' && postId) {
                return apiRequest(`/api/posts/${postId}`, 'PATCH', data);
            }
            else {
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
        onError: (error) => {
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
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete draft",
                variant: "destructive",
            });
        },
    });
    const onSaveDraft = (data) => {
        saveDraftMutation.mutate(data);
    };
    const onPublish = (data) => {
        publishPostMutation.mutate(data);
    };
    const onDeleteDraft = () => {
        if (confirm("Are you sure you want to delete this draft?")) {
            deleteDraftMutation.mutate();
        }
    };
    const getTitle = () => {
        if (mode === 'edit-post')
            return 'Edit Post';
        if (mode === 'edit-draft')
            return 'Edit Draft';
        return draft ? 'Continue Draft' : 'Create New Post';
    };
    return (_jsxs(Card, { className: "w-full max-w-3xl", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: getTitle() }) }), _jsx(CardContent, { children: _jsx(Form, { ...form, children: _jsxs("div", { className: "space-y-6", children: [_jsx(FormField, { control: form.control, name: "category", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Category" }), _jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [_jsx(FormControl, { children: _jsx(SelectTrigger, { "data-testid": "select-category", children: _jsx(SelectValue, { placeholder: "Select a category" }) }) }), _jsx(SelectContent, { children: FORUM_CATEGORIES.map((category) => (_jsx(SelectItem, { value: category.value, children: category.label }, category.value))) })] }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Title" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Enter post title...", ...field, "data-testid": "input-title" }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "content", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Content" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Write your post content...", rows: 10, ...field, "data-testid": "textarea-content" }) }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "flex justify-between", children: [_jsx("div", { className: "space-x-2", children: mode === 'edit-draft' && draft && (_jsx(Button, { type: "button", variant: "destructive", onClick: onDeleteDraft, disabled: deleteDraftMutation.isPending, "data-testid": "button-delete-draft", children: deleteDraftMutation.isPending ? "Deleting..." : "Delete Draft" })) }), _jsxs("div", { className: "space-x-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, "data-testid": "button-cancel", children: "Cancel" }), mode !== 'edit-post' && (_jsxs(Button, { type: "button", variant: "outline", onClick: form.handleSubmit(onSaveDraft), disabled: saveDraftMutation.isPending, "data-testid": "button-save-draft", children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), saveDraftMutation.isPending ? "Saving..." : "Save Draft"] })), _jsxs(Button, { onClick: form.handleSubmit(onPublish), disabled: publishPostMutation.isPending, "data-testid": "button-publish", children: [_jsx(Send, { className: "h-4 w-4 mr-2" }), publishPostMutation.isPending ?
                                                        "Publishing..." :
                                                        mode === 'edit-post' ? "Update Post" : "Publish Post"] })] })] })] }) }) })] }));
}

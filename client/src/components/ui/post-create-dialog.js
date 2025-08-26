import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
const FORUM_CATEGORIES = [
    { id: "land", name: "Land & Location" },
    { id: "resources", name: "Resources & Materials" },
    { id: "people", name: "People & Community" },
    { id: "facilities", name: "Buildings & Infrastructure" },
    { id: "operations", name: "Operations & Business" },
    { id: "ownership", name: "Ownership & Governance" }
];
export function PostCreateDialog({ open, onOpenChange, defaultCategory = "land" }) {
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(postFormSchema),
        defaultValues: {
            title: "",
            content: "",
            category: defaultCategory,
        },
    });
    const createPostMutation = useMutation({
        mutationFn: async (data) => {
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
    const onSubmit = (data) => {
        createPostMutation.mutate(data);
    };
    return (_jsxs(DialogContent, { className: "bg-void border-purple-deep text-white max-w-2xl", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-neon-cyan font-cyber", children: "Create New Post" }) }), _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [_jsx(FormField, { control: form.control, name: "category", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-gray-300", children: "Category" }), _jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [_jsx(FormControl, { children: _jsx(SelectTrigger, { className: "bg-space border-purple-deep text-white", children: _jsx(SelectValue, { placeholder: "Select a category" }) }) }), _jsx(SelectContent, { className: "bg-void border-purple-deep", children: FORUM_CATEGORIES.map((category) => (_jsx(SelectItem, { value: category.id, className: "text-white hover:bg-purple-deep", children: category.name }, category.id))) })] }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "title", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-gray-300", children: "Title" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "Enter post title...", className: "bg-space border-purple-deep text-white", "data-testid": "input-post-title", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "content", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { className: "text-gray-300", children: "Content" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Share your thoughts, ideas, or questions...", className: "bg-space border-purple-deep text-white min-h-[150px]", "data-testid": "textarea-post-content", ...field }) }), _jsx(FormMessage, {})] })) }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), className: "border-gray-600 text-gray-300 hover:bg-gray-700", "data-testid": "button-cancel", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: createPostMutation.isPending, className: "bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold", "data-testid": "button-submit", children: createPostMutation.isPending ? 'Creating...' : 'Create Post' })] })] }) })] }));
}

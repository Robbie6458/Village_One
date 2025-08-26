import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Upload } from "lucide-react";
export function GalleryImageForm({ onClose }) {
    const [formData, setFormData] = useState({
        url: "",
        caption: "",
        alt: "",
    });
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const addImageMutation = useMutation({
        mutationFn: (data) => apiRequest('/api/gallery', 'POST', data),
        onSuccess: () => {
            // Invalidate all related queries to ensure fresh data
            queryClient.invalidateQueries({ queryKey: ['/api/users'] });
            toast({
                title: "Image Added",
                description: "Your image has been added to the gallery successfully.",
            });
            onClose();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to add image",
                variant: "destructive",
            });
        },
    });
    const handleGetUploadParameters = async () => {
        const response = await apiRequest("/api/objects/upload", "POST", {});
        const data = await response.json();
        return {
            method: "PUT",
            url: data.uploadURL,
        };
    };
    const handleUploadComplete = (result) => {
        setIsUploading(false);
        if (result.successful && result.successful.length > 0) {
            const uploadedFile = result.successful[0];
            const imageUrl = uploadedFile.uploadURL;
            // Extract filename for alt text if not provided
            const fileName = uploadedFile.name || "Uploaded image";
            setFormData({
                ...formData,
                url: imageUrl || "",
                alt: formData.alt || fileName,
            });
            toast({
                title: "Upload Complete",
                description: "Image uploaded successfully. Add a caption and save.",
            });
        }
    };
    const handleUploadStart = () => {
        setIsUploading(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.url) {
            toast({
                title: "Error",
                description: "Please upload an image or provide an image URL",
                variant: "destructive",
            });
            return;
        }
        addImageMutation.mutate(formData);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-lg font-semibold text-white", children: "Upload Image" }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Choose an image from your computer (max 10MB)" })] }), _jsx(ObjectUploader, { maxNumberOfFiles: 1, maxFileSize: 10485760, onGetUploadParameters: handleGetUploadParameters, onComplete: handleUploadComplete, buttonClassName: "w-full h-32 border-2 border-dashed border-space-600 hover:border-electric-green transition-colors", children: _jsxs("div", { className: "flex flex-col items-center gap-3 text-center", children: [_jsx(Upload, { className: "h-8 w-8 text-space-400" }), _jsx("span", { className: "text-lg", children: "Choose Image from Computer" }), _jsx("span", { className: "text-sm text-gray-400", children: "Drag and drop or click to browse" })] }) }), isUploading && (_jsx("div", { className: "text-center", children: _jsx("p", { className: "text-sm text-electric-green", children: "Uploading image..." }) }))] }), formData.url && (_jsxs("div", { className: "border border-space-600 rounded-lg p-4 bg-space-800/30", children: [_jsx(Label, { className: "text-sm text-gray-400 block mb-2", children: "Preview (4:5 aspect ratio)" }), _jsx("div", { className: "max-w-48 mx-auto", children: _jsx("div", { className: "aspect-[4/5] bg-space-900 rounded-lg overflow-hidden", children: _jsx("img", { src: formData.url, alt: "Preview", className: "w-full h-full object-cover", onError: () => {
                                    toast({
                                        title: "Invalid Image",
                                        description: "The provided URL does not contain a valid image",
                                        variant: "destructive",
                                    });
                                } }) }) })] })), _jsxs("div", { children: [_jsx(Label, { htmlFor: "caption", className: "text-white", children: "Caption" }), _jsx(Textarea, { id: "caption", value: formData.caption, onChange: (e) => setFormData({ ...formData, caption: e.target.value }), placeholder: "Write a caption for this image...", rows: 3, className: "mt-2", "data-testid": "input-caption" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "alt", className: "text-white", children: "Alt Text (for accessibility)" }), _jsx(Input, { id: "alt", value: formData.alt, onChange: (e) => setFormData({ ...formData, alt: e.target.value }), placeholder: "Describe the image for accessibility", className: "mt-2", "data-testid": "input-alt-text" })] }), _jsxs("div", { className: "flex justify-end space-x-2 pt-4 border-t border-space-600", children: [_jsx(Button, { variant: "outline", type: "button", onClick: onClose, "data-testid": "button-cancel", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: addImageMutation.isPending || !formData.url || isUploading, className: "bg-electric-green hover:bg-electric-green/80 text-space", "data-testid": "button-add-image", children: addImageMutation.isPending ? "Adding..." : "Add Image" })] })] }));
}

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
import type { UploadResult } from "@uppy/core";

interface GalleryImageFormProps {
  onClose: () => void;
}

export function GalleryImageForm({ onClose }: GalleryImageFormProps) {
  const [formData, setFormData] = useState({
    url: "",
    caption: "",
    alt: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addImageMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/gallery', 'POST', data),
    onSuccess: () => {
      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Image Added",
        description: "Your image has been added to the gallery successfully.",
      });
      onClose();
    },
    onError: (error: any) => {
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
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold text-white">Upload Image</Label>
          <p className="text-sm text-gray-400 mt-1">Choose an image from your computer (max 10MB)</p>
        </div>
        
        <ObjectUploader
          maxNumberOfFiles={1}
          maxFileSize={10485760} // 10MB
          onGetUploadParameters={handleGetUploadParameters}
          onComplete={handleUploadComplete}
          buttonClassName="w-full h-32 border-2 border-dashed border-space-600 hover:border-electric-green transition-colors"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <Upload className="h-8 w-8 text-space-400" />
            <span className="text-lg">Choose Image from Computer</span>
            <span className="text-sm text-gray-400">Drag and drop or click to browse</span>
          </div>
        </ObjectUploader>
        
        {isUploading && (
          <div className="text-center">
            <p className="text-sm text-electric-green">Uploading image...</p>
          </div>
        )}
      </div>

      {formData.url && (
        <div className="border border-space-600 rounded-lg p-4 bg-space-800/30">
          <Label className="text-sm text-gray-400 block mb-2">Preview (4:5 aspect ratio)</Label>
          <div className="max-w-48 mx-auto">
            <div className="aspect-[4/5] bg-space-900 rounded-lg overflow-hidden">
              <img 
                src={formData.url} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={() => {
                  toast({
                    title: "Invalid Image",
                    description: "The provided URL does not contain a valid image",
                    variant: "destructive",
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="caption" className="text-white">Caption</Label>
        <Textarea
          id="caption"
          value={formData.caption}
          onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
          placeholder="Write a caption for this image..."
          rows={3}
          className="mt-2"
          data-testid="input-caption"
        />
      </div>

      <div>
        <Label htmlFor="alt" className="text-white">Alt Text (for accessibility)</Label>
        <Input
          id="alt"
          value={formData.alt}
          onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
          placeholder="Describe the image for accessibility"
          className="mt-2"
          data-testid="input-alt-text"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-space-600">
        <Button variant="outline" type="button" onClick={onClose} data-testid="button-cancel">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={addImageMutation.isPending || !formData.url || isUploading}
          className="bg-electric-green hover:bg-electric-green/80 text-space"
          data-testid="button-add-image"
        >
          {addImageMutation.isPending ? "Adding..." : "Add Image"}
        </Button>
      </div>
    </form>
  );
}
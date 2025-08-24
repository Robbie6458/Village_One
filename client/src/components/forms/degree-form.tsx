import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DegreeFormProps {
  onClose: () => void;
}

export function DegreeForm({ onClose }: DegreeFormProps) {
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field: "",
    year: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addDegreeMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/degrees', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', 'me', 'degrees'] });
      toast({
        title: "Degree Added",
        description: "Your degree has been added successfully.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add degree",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution || !formData.degree || !formData.field) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addDegreeMutation.mutate({
      ...formData,
      year: formData.year ? parseInt(formData.year) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="institution">Institution *</Label>
        <Input
          id="institution"
          value={formData.institution}
          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          placeholder="e.g., University of California"
          data-testid="input-institution"
        />
      </div>

      <div>
        <Label htmlFor="degree">Degree *</Label>
        <Input
          id="degree"
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          placeholder="e.g., Bachelor of Science"
          data-testid="input-degree"
        />
      </div>

      <div>
        <Label htmlFor="field">Field of Study *</Label>
        <Input
          id="field"
          value={formData.field}
          onChange={(e) => setFormData({ ...formData, field: e.target.value })}
          placeholder="e.g., Computer Science"
          data-testid="input-field"
        />
      </div>

      <div>
        <Label htmlFor="year">Graduation Year</Label>
        <Input
          id="year"
          type="number"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          placeholder="e.g., 2020"
          data-testid="input-year"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
          Cancel
        </Button>
        <Button type="submit" disabled={addDegreeMutation.isPending} data-testid="button-save-degree">
          {addDegreeMutation.isPending ? "Adding..." : "Add Degree"}
        </Button>
      </div>
    </form>
  );
}
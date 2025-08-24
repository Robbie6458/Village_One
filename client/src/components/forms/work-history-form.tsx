import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface WorkHistoryFormProps {
  onClose: () => void;
}

export function WorkHistoryForm({ onClose }: WorkHistoryFormProps) {
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrentJob: false,
    description: "",
    achievements: "",
    skills: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addWorkHistoryMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/work-history', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      queryClient.refetchQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Work Experience Added",
        description: "Your work experience has been added successfully.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add work experience",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.company || !formData.startDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      ...formData,
      endDate: formData.endDate && !formData.isCurrentJob ? formData.endDate : null,
    };

    addWorkHistoryMutation.mutate(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="jobTitle">Job Title *</Label>
          <Input
            id="jobTitle"
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            placeholder="e.g., Software Engineer"
            data-testid="input-job-title"
          />
        </div>

        <div>
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g., Tech Corp Inc."
            data-testid="input-company"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., San Francisco, CA"
          data-testid="input-location"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            data-testid="input-start-date"
          />
        </div>

        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            disabled={formData.isCurrentJob}
            data-testid="input-end-date"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isCurrentJob"
          checked={formData.isCurrentJob}
          onCheckedChange={(checked) => 
            setFormData({ ...formData, isCurrentJob: checked as boolean, endDate: checked ? "" : formData.endDate })
          }
          data-testid="checkbox-current-job"
        />
        <Label htmlFor="isCurrentJob">This is my current job</Label>
      </div>

      <div>
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your role and responsibilities..."
          rows={4}
          data-testid="textarea-description"
        />
      </div>

      <div>
        <Label htmlFor="achievements">Key Achievements</Label>
        <Textarea
          id="achievements"
          value={formData.achievements}
          onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
          placeholder="List your major accomplishments and successes..."
          rows={3}
          data-testid="textarea-achievements"
        />
      </div>

      <div>
        <Label htmlFor="skills">Skills Used</Label>
        <Input
          id="skills"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="e.g., React, Node.js, Python (comma-separated)"
          data-testid="input-skills"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
          Cancel
        </Button>
        <Button type="submit" disabled={addWorkHistoryMutation.isPending} data-testid="button-save-work-history">
          {addWorkHistoryMutation.isPending ? "Adding..." : "Add Experience"}
        </Button>
      </div>
    </form>
  );
}
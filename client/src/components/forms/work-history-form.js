import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
export function WorkHistoryForm({ onClose }) {
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
        mutationFn: (data) => apiRequest('/api/work-history', 'POST', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/users'] });
            queryClient.refetchQueries({ queryKey: ['/api/users'] });
            toast({
                title: "Work Experience Added",
                description: "Your work experience has been added successfully.",
            });
            onClose();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to add work experience",
                variant: "destructive",
            });
        },
    });
    const handleSubmit = (e) => {
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
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "jobTitle", children: "Job Title *" }), _jsx(Input, { id: "jobTitle", value: formData.jobTitle, onChange: (e) => setFormData({ ...formData, jobTitle: e.target.value }), placeholder: "e.g., Software Engineer", "data-testid": "input-job-title" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "company", children: "Company *" }), _jsx(Input, { id: "company", value: formData.company, onChange: (e) => setFormData({ ...formData, company: e.target.value }), placeholder: "e.g., Tech Corp Inc.", "data-testid": "input-company" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "location", children: "Location" }), _jsx(Input, { id: "location", value: formData.location, onChange: (e) => setFormData({ ...formData, location: e.target.value }), placeholder: "e.g., San Francisco, CA", "data-testid": "input-location" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "startDate", children: "Start Date *" }), _jsx(Input, { id: "startDate", type: "date", value: formData.startDate, onChange: (e) => setFormData({ ...formData, startDate: e.target.value }), "data-testid": "input-start-date" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "endDate", children: "End Date" }), _jsx(Input, { id: "endDate", type: "date", value: formData.endDate, onChange: (e) => setFormData({ ...formData, endDate: e.target.value }), disabled: formData.isCurrentJob, "data-testid": "input-end-date" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "isCurrentJob", checked: formData.isCurrentJob, onCheckedChange: (checked) => setFormData({ ...formData, isCurrentJob: checked, endDate: checked ? "" : formData.endDate }), "data-testid": "checkbox-current-job" }), _jsx(Label, { htmlFor: "isCurrentJob", children: "This is my current job" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "description", children: "Job Description" }), _jsx(Textarea, { id: "description", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "Describe your role and responsibilities...", rows: 4, "data-testid": "textarea-description" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "achievements", children: "Key Achievements" }), _jsx(Textarea, { id: "achievements", value: formData.achievements, onChange: (e) => setFormData({ ...formData, achievements: e.target.value }), placeholder: "List your major accomplishments and successes...", rows: 3, "data-testid": "textarea-achievements" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "skills", children: "Skills Used" }), _jsx(Input, { id: "skills", value: formData.skills, onChange: (e) => setFormData({ ...formData, skills: e.target.value }), placeholder: "e.g., React, Node.js, Python (comma-separated)", "data-testid": "input-skills" })] }), _jsxs("div", { className: "flex justify-end space-x-2 pt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, "data-testid": "button-cancel", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: addWorkHistoryMutation.isPending, "data-testid": "button-save-work-history", children: addWorkHistoryMutation.isPending ? "Adding..." : "Add Experience" })] })] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
export function DegreeForm({ onClose }) {
    const [formData, setFormData] = useState({
        institution: "",
        degree: "",
        field: "",
        year: "",
    });
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const addDegreeMutation = useMutation({
        mutationFn: (data) => apiRequest('/api/degrees', 'POST', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/users'] });
            queryClient.invalidateQueries({ queryKey: ['/api/users', 'me', 'degrees'] });
            toast({
                title: "Degree Added",
                description: "Your degree has been added successfully.",
            });
            onClose();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to add degree",
                variant: "destructive",
            });
        },
    });
    const handleSubmit = (e) => {
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
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "institution", children: "Institution *" }), _jsx(Input, { id: "institution", value: formData.institution, onChange: (e) => setFormData({ ...formData, institution: e.target.value }), placeholder: "e.g., University of California", "data-testid": "input-institution" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "degree", children: "Degree *" }), _jsx(Input, { id: "degree", value: formData.degree, onChange: (e) => setFormData({ ...formData, degree: e.target.value }), placeholder: "e.g., Bachelor of Science", "data-testid": "input-degree" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "field", children: "Field of Study *" }), _jsx(Input, { id: "field", value: formData.field, onChange: (e) => setFormData({ ...formData, field: e.target.value }), placeholder: "e.g., Computer Science", "data-testid": "input-field" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "year", children: "Graduation Year" }), _jsx(Input, { id: "year", type: "number", value: formData.year, onChange: (e) => setFormData({ ...formData, year: e.target.value }), placeholder: "e.g., 2020", "data-testid": "input-year" })] }), _jsxs("div", { className: "flex justify-end space-x-2 pt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, "data-testid": "button-cancel", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: addDegreeMutation.isPending, "data-testid": "button-save-degree", children: addDegreeMutation.isPending ? "Adding..." : "Add Degree" })] })] }));
}

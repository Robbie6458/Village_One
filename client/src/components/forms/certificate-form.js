import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
export function CertificateForm({ onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        url: "",
    });
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const addCertificateMutation = useMutation({
        mutationFn: (data) => apiRequest('/api/certificates', 'POST', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/users'] });
            queryClient.invalidateQueries({ queryKey: ['/api/users', 'me', 'certificates'] });
            toast({
                title: "Certificate Added",
                description: "Your certificate has been added successfully.",
            });
            onClose();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to add certificate",
                variant: "destructive",
            });
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.issuer) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }
        const submitData = {
            ...formData,
        };
        addCertificateMutation.mutate(submitData);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Certificate Name *" }), _jsx(Input, { id: "name", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "e.g., AWS Certified Solutions Architect", "data-testid": "input-certificate-name" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "issuer", children: "Issuing Organization *" }), _jsx(Input, { id: "issuer", value: formData.issuer, onChange: (e) => setFormData({ ...formData, issuer: e.target.value }), placeholder: "e.g., Amazon Web Services", "data-testid": "input-issuer" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "issueDate", children: "Issue Date" }), _jsx(Input, { id: "issueDate", type: "date", value: formData.issueDate, onChange: (e) => setFormData({ ...formData, issueDate: e.target.value }), "data-testid": "input-issue-date" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "expiryDate", children: "Expiry Date" }), _jsx(Input, { id: "expiryDate", type: "date", value: formData.expiryDate, onChange: (e) => setFormData({ ...formData, expiryDate: e.target.value }), "data-testid": "input-expiry-date" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "credentialId", children: "Credential ID" }), _jsx(Input, { id: "credentialId", value: formData.credentialId, onChange: (e) => setFormData({ ...formData, credentialId: e.target.value }), placeholder: "e.g., AWS-SAA-123456", "data-testid": "input-credential-id" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "url", children: "Verification URL" }), _jsx(Input, { id: "url", type: "url", value: formData.url, onChange: (e) => setFormData({ ...formData, url: e.target.value }), placeholder: "https://...", "data-testid": "input-verification-url" })] }), _jsxs("div", { className: "flex justify-end space-x-2 pt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onClose, "data-testid": "button-cancel", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: addCertificateMutation.isPending, "data-testid": "button-save-certificate", children: addCertificateMutation.isPending ? "Adding..." : "Add Certificate" })] })] }));
}

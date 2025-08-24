import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CertificateFormProps {
  onClose: () => void;
}

export function CertificateForm({ onClose }: CertificateFormProps) {
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
    mutationFn: (data: any) => apiRequest('/api/certificates', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', 'me', 'certificates'] });
      toast({
        title: "Certificate Added",
        description: "Your certificate has been added successfully.",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add certificate",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Certificate Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., AWS Certified Solutions Architect"
          data-testid="input-certificate-name"
        />
      </div>

      <div>
        <Label htmlFor="issuer">Issuing Organization *</Label>
        <Input
          id="issuer"
          value={formData.issuer}
          onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
          placeholder="e.g., Amazon Web Services"
          data-testid="input-issuer"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            data-testid="input-issue-date"
          />
        </div>

        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            data-testid="input-expiry-date"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="credentialId">Credential ID</Label>
        <Input
          id="credentialId"
          value={formData.credentialId}
          onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
          placeholder="e.g., AWS-SAA-123456"
          data-testid="input-credential-id"
        />
      </div>

      <div>
        <Label htmlFor="url">Verification URL</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://..."
          data-testid="input-verification-url"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
          Cancel
        </Button>
        <Button type="submit" disabled={addCertificateMutation.isPending} data-testid="button-save-certificate">
          {addCertificateMutation.isPending ? "Adding..." : "Add Certificate"}
        </Button>
      </div>
    </form>
  );
}
import { useState } from "react";
import * as React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { ArrowLeft, User, Upload, Link as LinkIcon, Instagram, Facebook } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";

export default function ProfileEdit() {
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState({ 
    instagram: "", 
    facebook: "", 
    x: "" 
  });
  const [profileImage, setProfileImage] = useState("");

  const { data: userData, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return {
        ...data,
        email: user.email,
        username: data.display_name,
        firstName: data.display_name?.split(' ')[0],
        lastName: data.display_name?.split(' ')[1],
        profileImageUrl: data.avatar_url,
        socialLinks: data.social_links
      };
    },
    enabled: isAuthenticated,
  });

  // Update state when user data loads
  React.useEffect(() => {
    if (userData) {
      setFirstName((userData as any).firstName || "");
      setLastName((userData as any).lastName || "");
      setUsername((userData as any).username || "");
      setEmail((userData as any).email || "");
      setBio((userData as any).bio || "");
      const links = (userData as any).socialLinks;
      setSocialLinks({
        instagram: links?.instagram || "",
        facebook: links?.facebook || "",
        x: links?.x || ""
      });
      setProfileImage((userData as any).profileImageUrl || "");
    }
  }, [userData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { updateProfile } = await import('@/api/profile');
      return updateProfile({
        displayName: updates.displayName,
        bio: updates.bio,
        socialLinks: updates.socialLinks,
        avatarUrl: updates.profileImageUrl,
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      // Invalidate both profile and users queries
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      navigate(`/profile/me`);
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("/api/objects/upload", "POST", {});
    return {
      method: "PUT" as const,
      url: (response as any).uploadURL,
    };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      try {
        const response = await apiRequest("/api/profile-images", "PUT", {
          profileImageURL: uploadURL,
        });
        setProfileImage((response as any).objectPath);
        toast({
          title: "Image Uploaded",
          description: "Your profile image has been uploaded successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to set profile image.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine firstName and lastName into displayName for database storage
    const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();
    
    const updates = {
      displayName: displayName || username, // Use combined name or fall back to username
      bio,
      socialLinks,
      profileImageUrl: profileImage,
    };
    
    updateProfileMutation.mutate(updates);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-b from-space to-void texture-organic flex items-center justify-center">
        <Card className="card-legendary bg-gradient-to-br from-void to-purple-deep border-holo-gold max-w-md w-full text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-holo-gold mb-4">Authentication Required</h2>
            <p className="text-gray-300 mb-6">You need to be logged in to edit your profile.</p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold"
            >
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-b from-space to-void texture-organic flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-green mx-auto"></div>
          <p className="text-gray-300 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-space to-void texture-organic">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/profile/me">
            <Button variant="ghost" className="text-gray-300 hover:text-white mr-4" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <h1 className="text-3xl font-cyber text-holo-gold">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Section */}
          <Card className="bg-void border-purple-deep">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-neon-cyan" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="bg-purple-deep border-purple-light text-white"
                    data-testid="input-first-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="bg-purple-deep border-purple-light text-white"
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a unique username"
                  className="bg-purple-deep border-purple-light text-white"
                  data-testid="input-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  readOnly
                  placeholder="Enter your email address"
                  className="bg-purple-deep border-purple-light text-white opacity-75"
                  data-testid="input-email"
                />
                <p className="text-xs text-gray-400">Email is managed through your account settings and cannot be changed here.</p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Picture Section */}
          <Card className="bg-void border-purple-deep">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="w-5 h-5 mr-2 text-neon-cyan" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80"} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full border-2 border-holo-gold object-cover"
                />
                <div className="flex-1">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={5242880} // 5MB
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleUploadComplete}
                    buttonClassName="bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Image
                  </ObjectUploader>
                  <p className="text-xs text-gray-400 mt-2">
                    Upload an image from your computer (max 5MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card className="bg-void border-purple-deep">
            <CardHeader>
              <CardTitle className="text-white">Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="bio" className="text-gray-300">About You</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the community about yourself, your vision for Village-One, and what skills you bring..."
                className="bg-purple-deep border-purple-light text-white min-h-[120px] mt-2"
                maxLength={500}
                data-testid="textarea-bio"
              />
              <p className="text-xs text-gray-400 mt-1">
                {bio.length}/500 characters
              </p>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="bg-void border-purple-deep">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <LinkIcon className="w-5 h-5 mr-2 text-neon-cyan" />
                Social Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2 text-gray-300">
                    <Instagram size={16} className="text-pink-500" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="https://instagram.com/username"
                    className="bg-purple-deep border-purple-light text-white"
                    data-testid="input-instagram"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2 text-gray-300">
                    <Facebook size={16} className="text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="https://facebook.com/username"
                    className="bg-purple-deep border-purple-light text-white"
                    data-testid="input-facebook"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="x" className="flex items-center gap-2 text-gray-300">
                    <FaXTwitter size={16} className="text-white" />
                    X (Twitter)
                  </Label>
                  <Input
                    id="x"
                    value={socialLinks.x}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, x: e.target.value }))}
                    placeholder="https://x.com/username"
                    className="bg-purple-deep border-purple-light text-white"
                    data-testid="input-x"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/profile/me')}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold"
              data-testid="button-save"
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
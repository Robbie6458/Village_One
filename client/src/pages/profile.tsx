import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Star, 
  Award, 
  MessageCircle, 
  Mail, 
  ArrowLeft,
  Hammer,
  Leaf,
  ServerCog,
  Palette,
  DollarSign,
  Users,
  BookOpen,
  Edit,
  ExternalLink,
  GraduationCap,
  Shield,
  ImageIcon,
  FileText,
  Calendar,
  ExternalLinkIcon,
  Instagram,
  Facebook,
  Plus,
  Trash2
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FORUM_SECTIONS } from "../../../shared/types";

const ARCHETYPE_ICONS = {
  "Builder": Hammer,
  "Horticulturist": Leaf, 
  "Village Engineer": ServerCog,
  "Designer": Palette,
  "Funder": DollarSign,
  "Storyteller": BookOpen,
  "Artist": Palette,
  "Craftsperson": Hammer,
  "Permaculture Specialist": Leaf,
  "Community Facilitator": Users,
  "Signals Team": Users,
  "Resident Builder": Hammer,
};

const ARCHETYPE_COLORS = {
  "Builder": "holo-gold",
  "Horticulturist": "earth-green",
  "Village Engineer": "electric-green",
  "Designer": "purple-400",
  "Funder": "holo-gold",
  "Storyteller": "neon-cyan",
  "Artist": "purple-400",
  "Craftsperson": "holo-gold",
  "Permaculture Specialist": "earth-green",
  "Community Facilitator": "electric-green",
  "Signals Team": "neon-cyan", 
  "Resident Builder": "electric-green",
};

export default function Profile() {
  const params = useParams();
  const userId = params.id;
  const { user: currentUser, session, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");

  // Helper to get auth header
  const getAuthHeader = () => {
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined;
  };

  // Use /api/users/me for own profile, /api/users/:id for others
  const isOwnProfile = isAuthenticated && (userId === 'me' || userId === currentUser?.id);
  const profileEndpoint = isOwnProfile ? '/api/users/me' : `/api/users/${userId}`;

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: [profileEndpoint],
    enabled: !!userId,
    queryFn: async () => {
      const headers = getAuthHeader();
      const res = await fetch(profileEndpoint, {
        headers: headers,
      });
      if (!res.ok) throw new Error('Failed to fetch user profile');
      return await res.json();
    },
  });

  const { data: userPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['/api/posts/user', isOwnProfile && currentUser ? currentUser.id : userId],
    enabled: !!userId,
    // ...existing code...
  });

  const { data: userDegrees = [], isLoading: degreesLoading } = useQuery({
    queryKey: ['/api/users', userId, 'degrees'],
    enabled: !!userId,
    // ...existing code...
  });

  const { data: userCertificates = [], isLoading: certificatesLoading } = useQuery({
    queryKey: ['/api/users', userId, 'certificates'],
    enabled: !!userId,
    // ...existing code...
  });

  const { data: userGallery = [], isLoading: galleryLoading } = useQuery({
    queryKey: ['/api/users', userId, 'gallery'],
    enabled: !!userId,
    // ...existing code...
  });

  const { data: userDrafts = [], isLoading: draftsLoading } = useQuery({
    queryKey: ['/api/users/me/drafts'],
    enabled: isOwnProfile && isAuthenticated,
    // ...existing code...
  });

  if (userLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-32 bg-space-800/50 rounded-lg mb-6"></div>
          <div className="h-8 bg-space-800/50 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-space-800/50 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardContent className="p-8 text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-space-400" />
            <h2 className="text-xl font-semibold mb-2">User not found</h2>
            <p className="text-space-400">The profile you're looking for doesn't exist.</p>
            <Link href="/people">
              <Button className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to People
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ArchetypeIcon = ARCHETYPE_ICONS[(user as any).archetype as keyof typeof ARCHETYPE_ICONS] || User;
  const archetypeColor = ARCHETYPE_COLORS[(user as any).archetype as keyof typeof ARCHETYPE_COLORS] || "space-400";

  const getSocialLinkIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'x': return FaXTwitter;
      default: return ExternalLinkIcon;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      {/* Back Navigation */}
      <Link href="/people">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to People
        </Button>
      </Link>

      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-electric-green/10 via-neon-cyan/5 to-holo-gold/10"></div>
        <CardContent className="relative p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                {(user as any).profileImageUrl ? (
                  <img 
                    src={(user as any).profileImageUrl} 
                    alt={(user as any).username}
                    className="w-32 h-32 rounded-full object-cover border-2 border-electric-green/30"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-space-800 flex items-center justify-center border-2 border-electric-green/30">
                    <User className="h-16 w-16 text-space-400" />
                  </div>
                )}
                {(user as any).archetype && (
                  <div className={`absolute -bottom-2 -right-2 p-2 rounded-full bg-${archetypeColor} border-2 border-space-900`}>
                    <ArchetypeIcon className="h-5 w-5 text-space-900" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-electric-green bg-clip-text text-transparent">
                    {(user as any).username}
                  </h1>
                  {isOwnProfile && (
                    <Link href="/profile/edit">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  )}
                </div>
                
                {(user as any).email && (
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-space-400" />
                    <span className="text-space-300">{(user as any).email}</span>
                  </div>
                )}

                {(user as any).bio && (
                  <p className="text-space-300 leading-relaxed mb-4">{(user as any).bio}</p>
                )}

                {/* Social Links */}
                {(user as any).socialLinks && Object.values((user as any).socialLinks).some(link => link) && (
                  <div className="flex gap-3">
                    {Object.entries((user as any).socialLinks).map(([platform, url]) => {
                      if (!url) return null;
                      const IconComponent = getSocialLinkIcon(platform);
                      return (
                        <a 
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-space-800/50 hover:bg-space-700/50 transition-colors"
                          data-testid={`link-social-${platform}`}
                        >
                          <IconComponent className="h-5 w-5 text-neon-cyan" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6 pt-4 border-t border-space-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-electric-green">{(user as any).level || 1}</div>
                  <div className="text-sm text-space-400">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-cyan">{(user as any).contributions || 0}</div>
                  <div className="text-sm text-space-400">Contributions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-holo-gold">{Array.isArray(userPosts) ? userPosts.length : 0}</div>
                  <div className="text-sm text-space-400">Posts</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts" data-testid="tab-posts">
            <FileText className="h-4 w-4 mr-2" />
            Forum Posts
          </TabsTrigger>
          <TabsTrigger value="credentials" data-testid="tab-credentials">
            <GraduationCap className="h-4 w-4 mr-2" />
            Credentials
          </TabsTrigger>
          <TabsTrigger value="gallery" data-testid="tab-gallery">
            <ImageIcon className="h-4 w-4 mr-2" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="archetype" data-testid="tab-archetype">
            <Award className="h-4 w-4 mr-2" />
            Archetype
          </TabsTrigger>
        </TabsList>

        {/* Forum Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Forum Posts</h3>
            {isOwnProfile && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-void border-purple-deep text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-neon-cyan font-cyber">Create New Post</DialogTitle>
                  </DialogHeader>
                  <div className="text-center p-8">
                    <p className="text-gray-400 mb-4">Use the forum categories to create posts:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {FORUM_SECTIONS.map(section => (
                        <Link key={section.id} href={`/forum/${section.id}`}>
                          <Button variant="outline" className="w-full">
                            {section.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {postsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-space-800 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-space-800 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : userPosts && Array.isArray(userPosts) && userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post: any) => (
                <Card key={post.id} className="hover:bg-space-800/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/forum/${post.forumSection}/${post.id}`}>
                        <h4 className="font-semibold hover:text-neon-cyan transition-colors cursor-pointer">
                          {post.title}
                        </h4>
                      </Link>
                      <Badge variant="secondary" className="text-xs">
                        {post.forumSection}
                      </Badge>
                    </div>
                    <p className="text-space-400 text-sm line-clamp-2 mb-2">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 text-xs text-space-500">
                      <span>{formatDate(post.createdAt)}</span>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.commentCount || 0}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-space-400" />
                <p className="text-space-400">No forum posts yet</p>
                {isOwnProfile && (
                  <Link href="/forum">
                    <Button className="mt-4">Create your first post</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Credentials Tab */}
        <TabsContent value="credentials" className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Degrees</h3>
              {isOwnProfile && (
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Degree
                </Button>
              )}
            </div>
            
            {Array.isArray(userDegrees) && userDegrees.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {userDegrees.map((degree: any) => (
                  <Card key={degree.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{degree.degree}</h4>
                          <p className="text-sm text-space-400">{degree.field}</p>
                        </div>
                        {degree.verified && (
                          <Badge variant="default" className="text-xs bg-electric-green text-space-900">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-space-300 font-medium">{degree.institution}</p>
                      {degree.year && (
                        <p className="text-sm text-space-400">Class of {degree.year}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <GraduationCap className="mx-auto mb-4 h-12 w-12 text-space-400" />
                  <p className="text-space-400">No degrees added yet</p>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Certificates</h3>
              {isOwnProfile && (
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certificate
                </Button>
              )}
            </div>
            
            {Array.isArray(userCertificates) && userCertificates.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {userCertificates.map((cert: any) => (
                  <Card key={cert.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-sm text-space-400">{cert.issuer}</p>
                        </div>
                        {cert.verified && (
                          <Badge variant="default" className="text-xs bg-electric-green text-space-900">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-sm text-space-400">
                        <span>
                          {cert.issueDate && `Issued: ${formatDate(cert.issueDate)}`}
                        </span>
                        {cert.url && (
                          <a href={cert.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLinkIcon className="h-4 w-4 text-neon-cyan" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Shield className="mx-auto mb-4 h-12 w-12 text-space-400" />
                  <p className="text-space-400">No certificates added yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Gallery</h3>
            {isOwnProfile && (
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            )}
          </div>
          
          {Array.isArray(userGallery) && userGallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userGallery.map((image: any) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-square">
                    <img
                      src={image.imageUrl}
                      alt={image.title || 'Gallery image'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                  {image.title && (
                    <CardContent className="p-3">
                      <p className="text-sm font-medium truncate">{image.title}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <ImageIcon className="mx-auto mb-4 h-12 w-12 text-space-400" />
                <p className="text-space-400">No images in gallery yet</p>
                {isOwnProfile && (
                  <Button className="mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first image
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Archetype Tab */}
        <TabsContent value="archetype" className="space-y-4">
          <h3 className="text-xl font-semibold">Village Archetype</h3>
          
          {(user as any).archetype ? (
            <Card className="relative overflow-hidden">
              <div className={`absolute inset-0 bg-${archetypeColor}/10`}></div>
              <CardContent className="relative p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full bg-${archetypeColor}`}>
                    <ArchetypeIcon className="h-8 w-8 text-space-900" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">{(user as any).archetype}</h4>
                    <p className="text-space-400">Village Role</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold mb-2">Description</h5>
                    <p className="text-space-300 leading-relaxed">
                      {getArchetypeDescription((user as any).archetype)}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">Key Strengths</h5>
                    <div className="flex flex-wrap gap-2">
                      {getArchetypeStrengths((user as any).archetype).map((strength: string) => (
                        <Badge key={strength} variant="outline" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <div className="mt-6 pt-4 border-t border-space-700">
                    <Button size="sm" variant="outline">
                      Retake Assessment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="mx-auto mb-4 h-12 w-12 text-space-400" />
                <p className="text-space-400 mb-4">No archetype assigned yet</p>
                {isOwnProfile && (
                  <Button>Take Archetype Assessment</Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Drafts Tab (Only for own profile) */}
        {isOwnProfile && (
          <TabsContent value="drafts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Draft Posts</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Draft
              </Button>
            </div>
            
            {Array.isArray(userDrafts) && userDrafts.length > 0 ? (
              <div className="space-y-4">
                {userDrafts.map((draft: any) => (
                  <Card key={draft.id} className="hover:bg-space-800/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">
                          {draft.title || "Untitled Draft"}
                        </h4>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          {draft.title && draft.content && draft.forumSection && (
                            <Button size="sm">
                              Publish
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-space-400 text-sm mb-2">
                        {draft.content ? `${draft.content.substring(0, 100)}...` : "No content"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-space-500">
                        <span>Last edited: {formatDate(draft.updatedAt)}</span>
                        {draft.forumSection && (
                          <Badge variant="secondary" className="text-xs">
                            {draft.forumSection}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Edit className="mx-auto mb-4 h-12 w-12 text-space-400" />
                  <p className="text-space-400">No drafts yet</p>
                  <Button className="mt-4" variant="outline">
                    Create your first draft
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// Helper functions for archetype information
function getArchetypeDescription(archetype: string): string {
  const descriptions: Record<string, string> = {
    "Builder": "Hands-on creators who love to construct and build the physical infrastructure of our village. They transform ideas into tangible reality.",
    "Horticulturist": "Green-thumbed specialists who understand plants, soil, and sustainable growing practices. They help create our food systems and gardens.",
    "Village Engineer": "Technical problem-solvers who design and maintain the systems that keep our village running smoothly and efficiently.",
    "Designer": "Creative visionaries who shape the aesthetic and functional aspects of our village spaces, from architecture to user experiences.",
    "Funder": "Financial contributors and advisors who help secure resources and manage the economic sustainability of our village project.",
    "Storyteller": "Communication specialists who share our vision, document our journey, and connect with the broader community.",
    "Artist": "Creative souls who bring beauty, culture, and inspiration to village life through various forms of artistic expression.",
    "Craftsperson": "Skilled artisans who create beautiful and functional items using traditional and modern techniques.",
    "Permaculture Specialist": "Experts in sustainable living systems who design regenerative landscapes and ecological solutions.",
    "Community Facilitator": "Social connectors who help build relationships, resolve conflicts, and foster collaboration within our community.",
    "Signals Team": "Information gatherers and analysts who help the village stay informed and make data-driven decisions.",
    "Resident Builder": "Community members who will live in the village and help with ongoing construction and maintenance projects."
  };
  
  return descriptions[archetype] || "A valued member of our village community with unique skills and contributions.";
}

function getArchetypeStrengths(archetype: string): string[] {
  const strengths: Record<string, string[]> = {
    "Builder": ["Construction", "Problem Solving", "Physical Skills", "Project Management"],
    "Horticulturist": ["Plant Care", "Soil Management", "Sustainable Agriculture", "Ecosystem Design"],
    "Village Engineer": ["System Design", "Technical Analysis", "Infrastructure", "Innovation"],
    "Designer": ["Creative Vision", "User Experience", "Aesthetics", "Space Planning"],
    "Funder": ["Financial Planning", "Investment Strategy", "Resource Management", "Economic Analysis"],
    "Storyteller": ["Communication", "Content Creation", "Community Outreach", "Documentation"],
    "Artist": ["Creative Expression", "Cultural Development", "Inspiration", "Aesthetic Vision"],
    "Craftsperson": ["Manual Skills", "Quality Craftsmanship", "Tool Mastery", "Material Knowledge"],
    "Permaculture Specialist": ["Sustainable Systems", "Ecological Design", "Resource Conservation", "Natural Building"],
    "Community Facilitator": ["Relationship Building", "Conflict Resolution", "Event Planning", "Communication"],
    "Signals Team": ["Research", "Analysis", "Information Gathering", "Strategic Thinking"],
    "Resident Builder": ["Local Knowledge", "Ongoing Maintenance", "Community Living", "Practical Skills"]
  };
  
  return strengths[archetype] || ["Community Contribution", "Unique Perspective", "Collaborative Spirit"];
}
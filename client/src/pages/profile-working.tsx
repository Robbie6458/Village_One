import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
  GraduationCap,
  Shield,
  ImageIcon,
  FileText,
  Plus,
  Trash2,
  Building,
  Calendar
} from "lucide-react";
import { DegreeForm } from "@/components/forms/degree-form";
import { CertificateForm } from "@/components/forms/certificate-form";
import { GalleryImageForm } from "@/components/forms/gallery-image-form";
import { WorkHistoryForm } from "@/components/forms/work-history-form";
import { ArchetypeQuiz } from "@/components/forms/archetype-quiz";

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
  const { user: currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Dialog states
  const [showDegreeForm, setShowDegreeForm] = useState(false);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [showWorkHistoryForm, setShowWorkHistoryForm] = useState(false);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [showArchetypeQuiz, setShowArchetypeQuiz] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/users', userId],
    enabled: !!userId,
  });

  const { data: userPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['/api/posts/user', userId === 'me' && currentUser ? (currentUser as any).id : userId],
    enabled: !!userId,
  });

  const { data: userDegrees = [] } = useQuery({
    queryKey: ['/api/users', userId === 'me' && currentUser ? (currentUser as any).id : userId, 'degrees'],
    enabled: !!userId,
  });

  const { data: userCertificates = [] } = useQuery({
    queryKey: ['/api/users', userId === 'me' && currentUser ? (currentUser as any).id : userId, 'certificates'],
    enabled: !!userId,
  });

  const { data: userGallery = [] } = useQuery({
    queryKey: ['/api/users', userId === 'me' && currentUser ? (currentUser as any).id : userId, 'gallery'],
    enabled: !!userId,
  });

  const { data: userWorkHistory = [] } = useQuery({
    queryKey: ['/api/users', userId === 'me' && currentUser ? (currentUser as any).id : userId, 'work-history'],
    enabled: !!userId,
  });

  const { data: userArchetype } = useQuery({
    queryKey: ['/api/users', userId === 'me' && currentUser ? (currentUser as any).id : userId, 'archetype-assessment'],
    enabled: !!userId,
  });

  // Check if viewing own profile
  const isOwnProfile = isAuthenticated && (userId === 'me' || (userId === (currentUser as any)?.id));



  // Delete mutations
  const deleteDegree = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/degrees/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'degrees'] });
      toast({ title: "Degree deleted successfully" });
    },
  });

  const deleteCertificate = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/certificates/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'certificates'] });
      toast({ title: "Certificate deleted successfully" });
    },
  });

  const deleteWorkHistory = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/work-history/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'work-history'] });
      toast({ title: "Work history deleted successfully" });
    },
  });

  const deleteGalleryImage = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/gallery/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({ title: "Image deleted successfully" });
    },
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
            <h3 className="text-lg font-semibold mb-2">User Not Found</h3>
            <p className="text-space-400 mb-4">The profile you're looking for doesn't exist.</p>
            <Link href="/people">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to People
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userArchetypeData = userArchetype || { primaryArchetype: (user as any)?.archetype || 'Village Builder' };
  const ArchetypeIcon = ARCHETYPE_ICONS[(userArchetypeData as any)?.primaryArchetype as keyof typeof ARCHETYPE_ICONS] || Hammer;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <Card className="mb-6 bg-gradient-to-r from-void to-purple-deep border-purple-deep">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-neon-cyan to-electric-green rounded-full flex items-center justify-center">
              <User className="text-space" size={64} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-holo-gold" data-testid="text-username">
                  {(user as any)?.username || (user as any)?.email?.split('@')[0] || 'User'}
                </h1>
                {isOwnProfile && (
                  <Link href={`/profile/${userId}/edit`}>
                    <Button variant="outline" size="sm" data-testid="button-edit-profile">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </Link>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <ArchetypeIcon className="text-electric-green" size={20} />
                <Badge variant="secondary" className="bg-electric-green text-space">
                  {(userArchetypeData as any)?.primaryArchetype}
                </Badge>
                <span className="text-gray-400">•</span>
                <span className="text-neon-cyan">Level {(user as any)?.level || 1}</span>
                <span className="text-gray-400">•</span>
                <span className="text-holo-gold">{((user as any)?.contributions || 0).toLocaleString()} contributions</span>
              </div>
              
              {(user as any)?.bio && (
                <p className="text-gray-300 mb-4">{(user as any)?.bio}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  {(user as any)?.email}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  {(userPosts as any[])?.length || 0} posts
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-void">
          <TabsTrigger value="posts" data-testid="tab-posts">Forum Posts</TabsTrigger>
          <TabsTrigger value="credentials" data-testid="tab-credentials">Credentials</TabsTrigger>
          <TabsTrigger value="work" data-testid="tab-work">Work History</TabsTrigger>
          <TabsTrigger value="gallery" data-testid="tab-gallery">Gallery</TabsTrigger>
          <TabsTrigger value="archetype" data-testid="tab-archetype">Archetype</TabsTrigger>
        </TabsList>

        {/* Forum Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-holo-gold">Forum Posts</h2>
            {isOwnProfile && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-post">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-void border-purple-deep text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-neon-cyan font-cyber">Create New Post</DialogTitle>
                  </DialogHeader>
                  <div className="text-center p-8">
                    <p className="text-gray-400 mb-4">Choose a forum category to create your post:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/forum/land">
                        <Button variant="outline" className="w-full">Land & Location</Button>
                      </Link>
                      <Link href="/forum/resources">
                        <Button variant="outline" className="w-full">Resources</Button>
                      </Link>
                      <Link href="/forum/people">
                        <Button variant="outline" className="w-full">People</Button>
                      </Link>
                      <Link href="/forum/facilities">
                        <Button variant="outline" className="w-full">Buildings & Infrastructure</Button>
                      </Link>
                      <Link href="/forum/operations">
                        <Button variant="outline" className="w-full">Operations</Button>
                      </Link>
                      <Link href="/forum/ownership">
                        <Button variant="outline" className="w-full">Ownership</Button>
                      </Link>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {(userPosts as any[])?.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-space-400" />
                <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                <p className="text-space-400 mb-4">
                  {isOwnProfile ? "Start sharing your thoughts with the community!" : "This user hasn't posted anything yet."}
                </p>
                {isOwnProfile && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button data-testid="button-first-post">Create Your First Post</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-void border-purple-deep text-white max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-neon-cyan font-cyber">Create New Post</DialogTitle>
                      </DialogHeader>
                      <div className="text-center p-8">
                        <p className="text-gray-400 mb-4">Choose a forum category to create your post:</p>
                        <div className="grid grid-cols-2 gap-3">
                          <Link href="/forum/land">
                            <Button variant="outline" className="w-full">Land & Location</Button>
                          </Link>
                          <Link href="/forum/resources">
                            <Button variant="outline" className="w-full">Resources</Button>
                          </Link>
                          <Link href="/forum/people">
                            <Button variant="outline" className="w-full">People</Button>
                          </Link>
                          <Link href="/forum/facilities">
                            <Button variant="outline" className="w-full">Buildings & Infrastructure</Button>
                          </Link>
                          <Link href="/forum/operations">
                            <Button variant="outline" className="w-full">Operations</Button>
                          </Link>
                          <Link href="/forum/ownership">
                            <Button variant="outline" className="w-full">Ownership</Button>
                          </Link>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {(userPosts as any[])?.map((post: any) => (
                <Card key={post.id} className="hover:border-electric-green/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white hover:text-electric-green">
                        <Link href={`/post/${post.id}`}>{post.title}</Link>
                      </h3>
                      <Badge variant="outline">{post.section}</Badge>
                    </div>
                    <p className="text-gray-400 mb-4">{post.content.substring(0, 200)}...</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.votes || 0} votes</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Credentials Tab */}
        <TabsContent value="credentials" className="space-y-6">
          {/* Degrees Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-holo-gold flex items-center gap-2">
                <GraduationCap size={20} />
                Education
              </h3>
              {isOwnProfile && (
                <Dialog open={showDegreeForm} onOpenChange={setShowDegreeForm}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" data-testid="button-add-degree">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Degree
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Degree</DialogTitle>
                    </DialogHeader>
                    <DegreeForm onClose={() => setShowDegreeForm(false)} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            {(userDegrees as any[])?.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <GraduationCap className="mx-auto mb-2 h-8 w-8 text-space-400" />
                  <p className="text-space-400">No degrees added yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {(userDegrees as any[])?.map((degree: any) => (
                  <Card key={degree.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{degree.degree} in {degree.field}</h4>
                          <p className="text-electric-green">{degree.institution}</p>
                          {degree.year && <p className="text-gray-400">Class of {degree.year}</p>}
                        </div>
                        {isOwnProfile && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteDegree.mutate(degree.id)}
                            disabled={deleteDegree.isPending}
                            data-testid={`button-delete-degree-${degree.id}`}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-purple-deep/50" />

          {/* Certificates Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-holo-gold flex items-center gap-2">
                <Shield size={20} />
                Certifications
              </h3>
              {isOwnProfile && (
                <Dialog open={showCertificateForm} onOpenChange={setShowCertificateForm}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" data-testid="button-add-certificate">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Certificate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Certificate</DialogTitle>
                    </DialogHeader>
                    <CertificateForm onClose={() => setShowCertificateForm(false)} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            {(userCertificates as any[])?.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="mx-auto mb-2 h-8 w-8 text-space-400" />
                  <p className="text-space-400">No certificates added yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {(userCertificates as any[])?.map((cert: any) => (
                  <Card key={cert.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{cert.name}</h4>
                          <p className="text-electric-green">{cert.issuer}</p>
                          {cert.issueDate && (
                            <p className="text-gray-400">
                              Issued: {new Date(cert.issueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {isOwnProfile && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCertificate.mutate(cert.id)}
                            disabled={deleteCertificate.isPending}
                            data-testid={`button-delete-certificate-${cert.id}`}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Work History Tab */}
        <TabsContent value="work" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-holo-gold flex items-center gap-2">
              <Building size={20} />
              Work Experience
            </h2>
            {isOwnProfile && (
              <Dialog open={showWorkHistoryForm} onOpenChange={setShowWorkHistoryForm}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-work-history">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Work Experience</DialogTitle>
                  </DialogHeader>
                  <WorkHistoryForm onClose={() => setShowWorkHistoryForm(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {(userWorkHistory as any[])?.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="mx-auto mb-4 h-12 w-12 text-space-400" />
                <h3 className="text-lg font-semibold mb-2">No Work Experience</h3>
                <p className="text-space-400 mb-4">
                  {isOwnProfile ? "Add your professional experience to showcase your skills." : "This user hasn't added work experience yet."}
                </p>
                {isOwnProfile && (
                  <Button onClick={() => setShowWorkHistoryForm(true)} data-testid="button-first-work-history">
                    Add Your First Experience
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {(userWorkHistory as any[])?.map((work: any) => (
                <Card key={work.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{work.jobTitle}</h3>
                        <p className="text-electric-green">{work.company}</p>
                        {work.location && <p className="text-gray-400">{work.location}</p>}
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Calendar size={14} />
                          <span>
                            {new Date(work.startDate).toLocaleDateString()} - 
                            {work.isCurrentJob ? ' Present' : ` ${new Date(work.endDate).toLocaleDateString()}`}
                          </span>
                        </div>
                      </div>
                      {isOwnProfile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteWorkHistory.mutate(work.id)}
                          disabled={deleteWorkHistory.isPending}
                          data-testid={`button-delete-work-${work.id}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                    
                    {work.description && (
                      <div className="mb-4">
                        <h4 className="font-medium text-neon-cyan mb-2">Description</h4>
                        <p className="text-gray-300">{work.description}</p>
                      </div>
                    )}
                    
                    {work.achievements && (
                      <div className="mb-4">
                        <h4 className="font-medium text-neon-cyan mb-2">Key Achievements</h4>
                        <p className="text-gray-300">{work.achievements}</p>
                      </div>
                    )}
                    
                    {work.skills && (
                      <div>
                        <h4 className="font-medium text-neon-cyan mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {work.skills.split(',').map((skill: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-holo-gold flex items-center gap-2">
              <ImageIcon size={20} />
              Photo Gallery
            </h2>
            {isOwnProfile && (
              <Dialog open={showGalleryForm} onOpenChange={setShowGalleryForm}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-image">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Photo</DialogTitle>
                  </DialogHeader>
                  <GalleryImageForm onClose={() => setShowGalleryForm(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {(userGallery as any[])?.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ImageIcon className="mx-auto mb-4 h-12 w-12 text-space-400" />
                <h3 className="text-lg font-semibold mb-2">No Photos</h3>
                <p className="text-space-400 mb-4">
                  {isOwnProfile ? "Share your photos with the community!" : "This user hasn't shared any photos yet."}
                </p>
                {isOwnProfile && (
                  <Button onClick={() => setShowGalleryForm(true)} data-testid="button-first-image">
                    Add Your First Image
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(userGallery as any[])?.map((image: any) => (
                <Card key={image.id} className="overflow-hidden bg-space-800/50 border-space-700">
                  <div className="aspect-[4/5] bg-space-900 overflow-hidden">
                    {image.url ? (
                      <img 
                        src={image.url} 
                        alt={image.alt || image.caption || 'Gallery image'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center hidden">
                      <ImageIcon className="text-space-400" size={48} />
                    </div>
                  </div>
                  {image.caption && (
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-300 flex-1">{image.caption}</p>
                        {isOwnProfile && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGalleryImage.mutate(image.id)}
                            disabled={deleteGalleryImage.isPending}
                            data-testid={`button-delete-image-${image.id}`}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-2"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Archetype Tab */}
        <TabsContent value="archetype" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-holo-gold flex items-center gap-2">
              <ArchetypeIcon size={20} />
              Village Archetype
            </h2>
            {isOwnProfile && (
              <Dialog open={showArchetypeQuiz} onOpenChange={setShowArchetypeQuiz}>
                <DialogTrigger asChild>
                  <Button data-testid="button-take-assessment">
                    {userArchetype ? 'Retake Assessment' : 'Take Assessment'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <ArchetypeQuiz onClose={() => setShowArchetypeQuiz(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {userArchetype ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-holo-gold to-electric-green rounded-full flex items-center justify-center">
                    <ArchetypeIcon className="text-space" size={40} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-holo-gold mb-2">
                    {(userArchetype as any)?.primaryArchetype}
                  </h3>
                  
                  <p className="text-gray-300 mb-6">
                    Your primary village archetype based on assessment results.
                  </p>
                </div>

                {(userArchetype as any)?.scores && (
                  <div className="max-w-md mx-auto space-y-3 mb-6">
                    <h4 className="text-sm font-semibold text-neon-cyan mb-3 text-center">Detailed Scores</h4>
                    {Object.entries((userArchetype as any)?.scores || {}).sort(([,a], [,b]) => (b as number) - (a as number)).map(([archetype, score]) => (
                      <div key={archetype} className="flex justify-between items-center">
                        <span className="text-white text-sm">{archetype}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-space-800 rounded-full h-2">
                            <div 
                              className="bg-electric-green h-2 rounded-full" 
                              style={{ width: `${((score as number) / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-neon-cyan w-8 text-right text-sm">{score as any}/5</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(userArchetype as any)?.description && (
                  <div className="p-4 bg-space-800/50 rounded-lg mb-6">
                    <p className="text-gray-300 text-sm">{(userArchetype as any)?.description}</p>
                  </div>
                )}

                {(userArchetype as any)?.completedAt && (
                  <div className="text-center">
                    <p className="text-gray-400 text-xs">
                      Assessment completed on {new Date((userArchetype as any)?.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Star className="mx-auto mb-4 h-12 w-12 text-space-400" />
                <h3 className="text-lg font-semibold mb-2">Discover Your Village Role</h3>
                <p className="text-space-400 mb-6">
                  {isOwnProfile 
                    ? "Take our assessment to discover which village archetype matches your skills and interests!"
                    : "This user hasn't taken the archetype assessment yet."
                  }
                </p>
                {isOwnProfile && (
                  <Button 
                    onClick={() => setShowArchetypeQuiz(true)}
                    className="bg-gradient-to-r from-holo-gold to-electric-green text-space"
                    data-testid="button-first-assessment"
                  >
                    Take Archetype Assessment
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>


      </Tabs>
    </div>
  );
}
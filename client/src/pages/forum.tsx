import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import PostCard from "@/components/ui/post-card";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Plus, ArrowUp, ArrowDown, Brain, Home, ChevronRight, Mountain, Sprout, Users, Building, ServerCog, MessageCircle, User, Calendar } from "lucide-react";
import { FORUM_SECTIONS, type Post, type User as UserType } from "../../../shared/types";
import { formatDistanceToNow } from "date-fns";

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(10, "Content must be at least 10 characters").max(5000, "Content too long"),
});

interface PostWithAuthor extends Post {
  author: UserType;
}

export default function Forum() {
  const { section } = useParams<{ section: string }>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  if (!section || !FORUM_SECTIONS.some(s => s.id === section)) {
    return (
      <div className="min-h-screen p-8 bg-space flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Invalid Forum Section</h1>
          <p className="text-gray-400">The requested forum section does not exist.</p>
        </div>
      </div>
    );
  }

  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  const { data: posts = [], isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: [`/api/posts/${section}`],
  });

  const { data: sentiment } = useQuery({
    queryKey: [`/api/forum/${section}/sentiment`],
  });

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: z.infer<typeof postFormSchema>) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          forumSection: section,
          status: 'published'
        })
      });
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${section}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/sentiments'] });
      form.reset();
      setDialogOpen(false);
    },
  });

  const onSubmit = (data: z.infer<typeof postFormSchema>) => {
    createPostMutation.mutate(data);
  };

  const sectionInfo = {
    land: { title: "Land", subtitle: "Locations & Requirements", icon: Mountain, color: "holo-gold" },
    resources: { title: "Resources", subtitle: "Sustainable Sourcing", icon: Sprout, color: "electric-green" },
    people: { title: "People", subtitle: "Community Directory", icon: Users, color: "neon-cyan" },
    facilities: { title: "Facilities", subtitle: "Buildings & Infrastructure", icon: Building, color: "holo-gold" },
    operations: { title: "Operations", subtitle: "Revenue & Business Models", icon: ServerCog, color: "electric-green" },
    ownership: { title: "Ownership", subtitle: "Structure & Governance", icon: Users, color: "neon-cyan" }
  };

  const currentSection = sectionInfo[section as keyof typeof sectionInfo];
  const IconComponent = currentSection?.icon || Building;

  const sectionTitles = {
    land: "Land & Locations",
    resources: "Sustainable Resources", 
    people: "Community Directory",
    facilities: "Facilities & Infrastructure",
    operations: "Operations & Revenue",
    ownership: "Ownership Structure"
  };

  const sectionDescriptions = {
    land: "Discuss property locations, zoning requirements, climate considerations, and land acquisition strategies.",
    resources: "Share insights on sustainable sourcing, renewable energy options, and resource management systems.",
    people: "Connect with community members, share skills, and build collaborative relationships.",
    facilities: "Propose and discuss building designs, infrastructure systems, power management, water systems, and smart village technologies.",
    operations: "Discuss vacation rentals, workshops, revenue models, and sustainable business operations.",
    ownership: "Explore community land trusts, cooperative ownership, profit sharing, and governance structures."
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-space to-void">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-purple-deep/30 bg-space/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/">
              <div className="flex items-center space-x-1 text-gray-400 hover:text-neon-cyan transition-colors cursor-pointer" data-testid="breadcrumb-home">
                <Home size={16} />
                <span>Village-One</span>
              </div>
            </Link>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="text-gray-400">Forums</span>
            <ChevronRight size={14} className="text-gray-600" />
            <div className="flex items-center space-x-2">
              <IconComponent size={16} className={`text-${currentSection?.color}`} />
              <span className={`text-${currentSection?.color} font-semibold`} data-testid="breadcrumb-section">
                {currentSection?.title}
              </span>
            </div>
          </nav>
        </div>
      </div>

      {/* Forum Category Navigation */}
      <div className="border-b border-purple-deep/30 bg-void/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center space-x-6 overflow-x-auto">
            {FORUM_SECTIONS.map((forumSection) => {
              const sectionData = sectionInfo[forumSection.id as keyof typeof sectionInfo];
              const SectionIcon = sectionData?.icon || Building;
              const isActive = forumSection.id === section;
              
              return (
                <Link key={forumSection.id} href={`/forum/${forumSection.id}`}>
                  <div 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive 
                        ? `bg-${sectionData?.color}/20 text-${sectionData?.color} border border-${sectionData?.color}/30` 
                        : 'text-gray-400 hover:text-white hover:bg-purple-deep/30'
                    }`}
                    data-testid={`nav-${forumSection.id}`}
                  >
                    <SectionIcon size={16} />
                    <span className="font-medium">{sectionData?.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {/* Forum Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className={`text-4xl font-cyber font-bold text-${currentSection?.color} mb-2`} data-testid={`text-forum-title-${section}`}>
                {currentSection?.title}
              </h1>
              <p className="text-lg text-gray-400 max-w-3xl">
                {currentSection?.subtitle}
              </p>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-neon-cyan to-electric-green text-space font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300"
                  data-testid="button-new-post"
                >
                  <Plus size={20} className="mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-void border-purple-deep text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-neon-cyan font-cyber">Create New Post</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter post title..."
                              className="bg-space border-purple-deep text-white"
                              data-testid="input-post-title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Content</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Share your ideas, questions, or insights..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setDialogOpen(false)}
                        className="border-purple-deep text-gray-300"
                        data-testid="button-cancel-post"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createPostMutation.isPending}
                        className="bg-gradient-to-r from-neon-cyan to-electric-green text-space"
                        data-testid="button-submit-post"
                      >
                        {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* AI Sentiment Summary */}
          {sentiment && (
            <Card className="card-epic bg-gradient-to-br from-void to-purple-deep border-electric-green mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Brain className="text-electric-green" size={20} />
                  <span className="text-electric-green font-cyber">AI Forum Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Sentiment</div>
                    <div className={`text-lg font-semibold capitalize ${
                      sentiment.sentiment === 'optimistic' ? 'text-electric-green' :
                      sentiment.sentiment === 'focused' ? 'text-neon-cyan' :
                      sentiment.sentiment === 'collaborative' ? 'text-holo-gold' :
                      'text-gray-400'
                    }`} data-testid="text-forum-sentiment">
                      {sentiment.sentiment}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Confidence</div>
                    <div className="text-lg font-semibold text-neon-cyan" data-testid="text-sentiment-confidence">
                      {sentiment.confidence}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Active Posts</div>
                    <div className="text-lg font-semibold text-holo-gold" data-testid="text-active-posts">
                      {posts.length}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm" data-testid="text-sentiment-summary">
                  {sentiment.summary || "Analysis based on recent community discussions and engagement patterns."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Posts List */}
        <div className="space-y-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-neon-cyan">Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <Card className="bg-gradient-to-br from-void to-space border-purple-deep">
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No posts yet</h3>
                <p className="text-gray-400 mb-6">
                  Be the first to start a discussion in this forum!
                </p>
                <Button 
                  onClick={() => setDialogOpen(true)}
                  className="bg-gradient-to-r from-neon-cyan to-electric-green text-space"
                  data-testid="button-first-post"
                >
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <div key={post.id} className="mb-6">
                  <PostCard 
                    post={post} 
                    currentUser={currentUser}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

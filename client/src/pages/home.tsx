import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ForumSectionCard from "@/components/ui/forum-section-card";
import ArchetypeCard from "@/components/ui/archetype-card";
import ChatWidget from "@/components/ui/chat-widget";
import VillageCard from "@/components/ui/village-card";
import { 
  Mountain, 
  Sprout, 
  Users, 
  Building, 
  ServerCog, 
  ChartLine,
  Brain,
  Leaf,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface SentimentData {
  section: { id: string; name: string };
  sentiment: string;
  confidence: number;
  summary: string;
  activeThreads?: number;
}

interface VillageState {
  summary: string;
  stats: {
    totalUsers: number;
    totalPosts: number;
    totalFunding: number;
    totalVotes: number;
    activeContributors: number;
  };
}

const FORUM_SECTIONS = [
  {
    id: "land",
    title: "Land",
    subtitle: "Locations & Requirements",
    description: "Discuss zoning, property sales, size requirements, and climate considerations. Vote on priority locations.",
    icon: Mountain,
    color: "holo-gold",
    rarity: "rare",
    tags: ["Maps", "Zoning", "Climate"]
  },
  {
    id: "resources", 
    title: "Resources",
    subtitle: "Sustainable Sourcing",
    description: "Source food, materials, and energy. Vote on sustainable options like solar vs wind power.",
    icon: Sprout,
    color: "electric-green", 
    rarity: "epic",
    tags: ["Solar", "Food", "Materials"]
  },
  {
    id: "people",
    title: "People", 
    subtitle: "Community Directory",
    description: "Browse member profiles by archetype. Connect with Funders, Designers, Builders, and more.",
    icon: Users,
    color: "neon-cyan",
    rarity: "legendary",
    tags: ["Builders", "Funders", "Designers"]
  },
  {
    id: "buildings",
    title: "Buildings & Infrastructure",
    subtitle: "Design & Systems", 
    description: "Propose building types, power grids, water systems, and connectivity. Share designs, specifications, and system integrations.",
    icon: Building,
    color: "holo-gold",
    rarity: "rare", 
    tags: ["Eco-Cabin", "Power", "Water", "Smart Tech"]
  },
  {
    id: "ownership",
    title: "Ownership",
    subtitle: "Structure & Governance",
    description: "Discuss community land trusts, cooperative ownership models, profit sharing, and governance structures.",
    icon: Users,
    color: "neon-cyan",
    rarity: "legendary",
    tags: ["CLT", "Coop", "ESOP"]
  },
  {
    id: "operations",
    title: "Operations",
    subtitle: "Revenue & Business Models",
    description: "Explore vacation rentals, workshops, manufacturing, and other revenue streams to sustain the village.",
    icon: ServerCog,
    color: "electric-green",
    rarity: "epic",
    tags: ["Rentals", "Workshops", "Revenue"]
  }
];

const ARCHETYPES = [
  {
    name: "Builder",
    description: "Hands-on creators who bring designs to life through skilled craftsmanship and sustainable practices.",
    icon: "⚒️",
    activeCount: 67,
    rarity: "rare" as const
  },
  {
    name: "Horticulturist", 
    description: "Food system designers who create sustainable growing practices and permaculture solutions.",
    icon: "🌱",
    activeCount: 34,
    rarity: "epic" as const
  },
  {
    name: "Village Engineer",
    description: "Systems architects who design infrastructure, power grids, and technological integrations.",
    icon: "⚡",
    activeCount: 23,
    rarity: "legendary" as const
  },
  {
    name: "Designer",
    description: "Creative visionaries who shape the aesthetic and functional aspects of village spaces.",
    icon: "🎨",
    activeCount: 41,
    rarity: "epic" as const
  },
  {
    name: "Funder",
    description: "Financial catalysts who provide capital and strategic investment for village development.",
    icon: "💰",
    activeCount: 12,
    rarity: "legendary" as const
  },
  {
    name: "Storyteller",
    description: "Community communicators who share our vision and connect people through narrative.",
    icon: "📖",
    activeCount: 28,
    rarity: "rare" as const
  },
  {
    name: "Artist",
    description: "Creative spirits who bring beauty and cultural expression to village life.",
    icon: "🎭",
    activeCount: 31,
    rarity: "epic" as const
  },
  {
    name: "Craftsperson",
    description: "Skilled artisans who create functional beauty using traditional and modern techniques.",
    icon: "🔨",
    activeCount: 45,
    rarity: "rare" as const
  },
  {
    name: "Permaculture Specialist",
    description: "Regenerative agriculture experts who design self-sustaining ecological systems.",
    icon: "🌿",
    activeCount: 22,
    rarity: "legendary" as const
  },
  {
    name: "Community Facilitator",
    description: "Social architects who foster collaboration, resolve conflicts, and build connections.",
    icon: "🤝",
    activeCount: 18,
    rarity: "epic" as const
  }
] as const;

const FAQ_ITEMS = [
  {
    question: "Is Village-One a real project?",
    answer: "Yes, Village-One is a serious initiative to build a sustainable community. We're currently in the planning and funding phases, with active members contributing to design, location scouting, and resource planning."
  },
  {
    question: "Is this a cult or commune?",
    answer: "No, Village-One is neither. We're building a modern intentional community with individual property ownership, democratic governance, and open participation. Members maintain personal autonomy while collaborating on shared resources and infrastructure."
  },
  {
    question: "How much does it cost to join?",
    answer: "Membership tiers range from $500 (Settler) to $25,000 (Founder). These contributions fund land acquisition, infrastructure, and initial development. Members receive proportional benefits and decision-making power based on their investment level."
  },
  {
    question: "What happens to my investment?",
    answer: "Contributions go into a transparent fund managed by the community. You receive equity in shared assets, priority housing access, and ongoing revenue shares from village enterprises like vacation rentals and workshops."
  },
  {
    question: "Where will Village-One be located?",
    answer: "We're evaluating sites in the Pacific Northwest, focusing on areas with favorable zoning, natural resources, and proximity to urban centers. The community will vote on the final location based on comprehensive research and site visits."
  },
  {
    question: "How is Village-One governed?",
    answer: "We use a hybrid model combining cooperative democracy with expertise-based decision making. Major decisions require community votes, while specialized decisions (technical, financial) involve relevant archetype groups."
  },
  {
    question: "Can I visit before committing?",
    answer: "Absolutely. We'll host site visits, community gatherings, and trial stays once land is acquired. Many decisions happen transparently in our forums, so you can observe our culture and governance style before joining."
  },
  {
    question: "What if Village-One fails?",
    answer: "While we're confident in our model, we have contingency plans. Assets would be liquidated and distributed proportionally to members. However, our phased approach and proven models reduce this risk significantly."
  },
  {
    question: "How is this different from other intentional communities?",
    answer: "Village-One combines modern business practices with traditional community values. We focus on economic sustainability through multiple revenue streams, professional governance, and transparent technology platforms."
  },
  {
    question: "When will construction begin?",
    answer: "Construction begins once we reach our funding goals and complete land acquisition. Current projections suggest groundbreaking in late 2025, with the first phase completing by 2027."
  }
];

// Removed duplicate interfaces - already defined above

interface TopPost {
  id: string;
  title: string;
  content: string;
  forumSection: string;
  upvotes: number;
  downvotes: number;
  author?: {
    username: string;
    archetype: string;
  };
  createdAt: string;
}

function TopContributorsSection() {
  const { data: users } = useQuery<any[]>({
    queryKey: ['/api/users'],
  });

  // Sort users by contributions and take top 6
  const topContributors = users
    ?.sort((a, b) => (b.contributions || 0) - (a.contributions || 0))
    .slice(0, 6) || [];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topContributors.map((user, index) => (
        <VillageCard 
          key={user.id}
          user={{
            id: user.id,
            username: user.username,
            archetype: user.archetype,
            level: user.level || 1,
            contributions: user.contributions || 0,
            profileImage: user.profileImageUrl,
            bio: user.bio,
            skills: user.skills
          }}
          onClick={() => window.location.href = `/profile/${user.id}`}
        />
      ))}
    </div>
  );
}

function TopDiscussionsSection() {
  const { data: topPosts } = useQuery<TopPost[]>({
    queryKey: ['/api/top-discussions'],
  });

  const sectionIcons = {
    land: Mountain,
    resources: Sprout,
    people: Users,
    buildings: Building,
    operations: ServerCog,
    ownership: Leaf,
  };

  const sectionColors = {
    land: "holo-gold",
    resources: "electric-green",
    people: "neon-cyan",
    buildings: "holo-gold",
    operations: "electric-green",
    ownership: "neon-cyan",
  };

  return (
    <section className="py-20 bg-gradient-to-b from-void to-space texture-organic">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-cyber font-bold text-electric-green mb-6" data-testid="text-top-discussions-title">
            Top Community Discussions
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Most engaging conversations shaping Village-One's development
          </p>
        </div>

        <div className="space-y-6">
          {topPosts?.map((post) => {
            const IconComponent = sectionIcons[post.forumSection as keyof typeof sectionIcons] || Building;
            const color = sectionColors[post.forumSection as keyof typeof sectionColors] || "neon-cyan";
            
            return (
              <Link key={post.id} href={`/forum/${post.forumSection}`}>
                <div className="card-rare bg-gradient-to-r from-void to-purple-deep rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-purple-deep/50 hover:border-electric-green/50" data-testid={`discussion-${post.id}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${color} to-neon-cyan rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="text-space" size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-cyber font-bold text-white line-clamp-1" data-testid={`title-${post.id}`}>
                          {post.title}
                        </h3>
                        <span className={`text-xs bg-${color}/20 text-${color} px-2 py-1 rounded-full capitalize`}>
                          {post.forumSection}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2" data-testid={`content-${post.id}`}>
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>by {post.author?.username || 'Anonymous'}</span>
                          <span className={`text-${color}`}>
                            {post.author?.archetype || 'Village Builder'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <ArrowUp size={12} className="text-electric-green" />
                            <span className="text-electric-green">{post.upvotes}</span>
                          </span>
                          {post.downvotes > 0 && (
                            <span className="flex items-center space-x-1">
                              <ArrowDown size={12} className="text-red-400" />
                              <span className="text-red-400">{post.downvotes}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/forum/land">
            <Button className="bg-gradient-to-r from-electric-green to-neon-cyan text-space font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform duration-300" data-testid="button-view-all-discussions">
              View All Discussions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: villageState } = useQuery<VillageState>({
    queryKey: ['/api/village-state'],
  });

  const { data: sentiments } = useQuery<SentimentData[]>({
    queryKey: ['/api/sentiments'],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden texture-organic"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-space/80 via-space/60 to-space/90"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-cyber font-black mb-8 leading-tight" data-testid="hero-title">
            <span className="text-neon-cyan animate-glow">Earth didn't end.</span><br/>
            <span className="text-electric-green">But something did.</span>
          </h1>
          
          <div className="text-xl leading-relaxed mb-8 space-y-4">
            <p className="text-gray-300">What we lost was… <span className="text-holo-gold font-semibold">Rhythm. Relationship. Reverence.</span></p>
            <p className="text-gray-300">So a small collective—<span className="text-neon-cyan font-semibold">Village Collective</span>—launched the <span className="text-electric-green font-semibold">Village‑1 Protocol</span>:</p>
            <p className="text-gray-300">A decentralized blueprint for rebuilding, one village at a time.</p>
          </div>
          
          <div className="text-lg text-gray-400 mb-12">
            <p>The location is Earth. But the mindset is <span className="text-holo-gold font-semibold">New World</span>.</p>
            <p className="text-2xl mt-4 font-semibold text-neon-cyan">You are not a tourist. You are a <span className="text-electric-green">settler</span>.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/questionnaire">
              <Button 
                className="bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold py-4 px-8 rounded-lg hover:scale-[1.02] transition-transform duration-300 animate-glow"
                data-testid="button-questionnaire"
              >
                Find Your Place in the Village
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-2 border-holo-gold text-holo-gold font-bold py-4 px-8 rounded-lg hover:bg-holo-gold hover:text-space transition-all duration-300"
              onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
      {/* Village Collective Mission */}
      <section className="py-20 bg-gradient-to-b from-space to-void texture-organic" id="mission">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-cyber font-bold text-neon-cyan mb-6" data-testid="text-mission-title">Village Collective Mission</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-electric-green mx-auto"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-gray-300 text-[16px]">
                Village Collective was founded on the belief that <span className="text-holo-gold font-semibold">hospitality</span>—through vacation rentals and home sharing—can fund and sustain local creative and productive communities.
              </p>
              <p className="text-gray-300 text-[16px]">
                More than a management company, Village Collective is a <span className="text-neon-cyan font-semibold">decentralized experiment</span> in community-building, where each stay supports local food, art, and innovation.
              </p>
              <p className="text-gray-300 text-[16px]">
                Every booking contributes to the construction of <span className="text-electric-green font-semibold">"Village‑One"</span>: a self-funded prototype village made possible by our growing network of managed properties and through the support of our growing online community.
              </p>
            </div>
            
            {/* State of the Village AI Summary */}
            <div className="card-epic rounded-xl p-6 bg-gradient-to-br from-void to-purple-deep">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-electric-green to-neon-cyan rounded-lg flex items-center justify-center animate-pulse">
                  <Brain className="text-space" size={20} />
                </div>
                <h3 className="text-xl font-cyber font-bold text-electric-green" data-testid="text-village-state-title">State of the Village</h3>
                <span className="text-xs bg-electric-green text-space px-2 py-1 rounded-full">AI Generated</span>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Community Sentiment</span>
                  <span className="text-electric-green font-semibold" data-testid="text-sentiment">Optimistic</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Contributors</span>
                  <span className="text-neon-cyan font-semibold" data-testid="text-contributors">
                    {villageState?.stats.activeContributors || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Users</span>
                  <span className="text-holo-gold font-semibold" data-testid="text-total-users">
                    {villageState?.stats.totalUsers || 0}
                  </span>
                </div>
                
                <div className="pt-4 border-t border-purple-deep">
                  <p className="text-gray-300 text-xs leading-relaxed" data-testid="text-ai-summary">
                    {villageState?.summary || "Community discussions are active and engaged across all development areas."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Forum Sections Overview */}
      <section className="py-20 bg-void texture-organic">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-cyber font-bold text-neon-cyan mb-6" data-testid="text-forum-title">Build the Future Together</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              These six essential areas of discussion form the structural foundation of Village-One. Each archetype brings specialized knowledge to these conversations—from Horticulturists shaping our land use to Village Engineers designing infrastructure, and Community Facilitators fostering collaborative ownership models.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FORUM_SECTIONS.map((section) => {
              const sentiment = sentiments?.find(s => s.section.id === section.id);
              return (
                <ForumSectionCard 
                  key={section.id}
                  {...section}
                  sentiment={sentiment?.sentiment || 'neutral'}
                  threadCount={sentiment?.activeThreads || 0}
                />
              );
            })}
          </div>
        </div>
      </section>
      {/* Top Discussions Section */}
      <TopDiscussionsSection />
      {/* Community Showcase */}
      <section className="py-20 bg-gradient-to-b from-void to-space texture-organic">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-cyber font-bold text-neon-cyan mb-6" data-testid="text-archetypes-title">Meet the Village Builders</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
              Together, these diverse archetypes form the foundation for a successful village community. 
              Each brings unique skills, perspectives, and expertise that complement the others, creating a 
              balanced ecosystem where innovation, sustainability, and human connection thrive.
            </p>
            <p className="text-lg text-electric-green">
              Find your place among the builders shaping tomorrow's communities.
            </p>
          </div>
          
          {/* Archetype Overview Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
            {ARCHETYPES.map((archetype, index) => (
              <Link key={index} href={`/people?archetype=${encodeURIComponent(archetype.name)}`}>
                <div 
                  className={`card-${archetype.rarity} rounded-xl p-4 bg-gradient-to-br from-void to-purple-deep hover:scale-[1.02] transition-transform duration-300 text-center border border-purple-deep/50 hover:border-electric-green/50 cursor-pointer h-64 flex flex-col overflow-hidden`}
                  data-testid={`archetype-card-${archetype.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex flex-col flex-shrink-0">
                    <div className="text-4xl mb-2">{archetype.icon}</div>
                    <h3 className="text-lg font-cyber font-bold text-white mb-1 line-clamp-2">{archetype.name}</h3>
                    <div className="text-sm text-electric-green mb-3">
                      {archetype.activeCount} Active Members
                    </div>
                  </div>
                  <div className="flex-1 flex items-end">
                    <p className="text-xs text-gray-400 leading-tight line-clamp-3 w-full">
                      {archetype.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Top Contributing Members */}
          <div>
            <h3 className="text-2xl font-cyber font-bold text-holo-gold mb-8 text-center">
              Top Contributing Members
            </h3>
            <TopContributorsSection />
          </div>
          
          <div className="text-center mt-12">
            <Link href="/questionnaire">
              <Button 
                className="bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold py-3 px-8 rounded-lg hover:scale-[1.02] transition-transform duration-300"
                data-testid="button-archetype-quiz"
              >
                Take the Archetype Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 bg-void texture-organic">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-cyber font-bold text-neon-cyan mb-6" data-testid="text-faq-title">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-electric-green mx-auto"></div>
          </div>
          
          <div className="space-y-6">
            {FAQ_ITEMS.map((faq, index) => (
              <div key={index} className="border border-purple-deep rounded-lg p-6 hover:border-neon-cyan transition-colors duration-300">
                <details className="group">
                  <summary className="flex justify-between items-center w-full text-left cursor-pointer list-none" data-testid={`faq-question-${index}`}>
                    <h3 className="text-lg font-semibold text-holo-gold">{faq.question}</h3>
                    <div className="text-neon-cyan group-open:rotate-180 transition-transform duration-300">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </summary>
                  <div className="mt-4 text-gray-300" data-testid={`faq-answer-${index}`}>
                    <p>{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-space to-void texture-organic">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-cyber font-bold text-neon-cyan mb-6" data-testid="text-cta-title">Ready to Build the Future?</h2>
          <p className="text-xl text-gray-300 mb-12">Join thousands of visionaries creating a sustainable tomorrow</p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card-epic rounded-xl p-8 bg-gradient-to-br from-void to-purple-deep">
              <h3 className="text-2xl font-cyber font-bold text-electric-green mb-4">Start Contributing</h3>
              <p className="text-gray-300 mb-6">Share your skills, ideas, and expertise with the community</p>
              <Link href="/people" className="block">
                <Button className="w-full bg-gradient-to-r from-electric-green to-neon-cyan text-space font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300" data-testid="button-join-community">
                  Join the Community
                </Button>
              </Link>
            </div>
            
            <div className="card-legendary rounded-xl p-8 bg-gradient-to-br from-void to-purple-deep">
              <h3 className="text-2xl font-cyber font-bold text-holo-gold mb-4">Fund the Vision</h3>
              <p className="text-gray-300 mb-6">Support village development through strategic investment</p>
              <Link href="/crowdfunding" className="block">
                <Button className="w-full bg-gradient-to-r from-holo-gold to-electric-green text-space font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300" data-testid="button-become-funder">
                  Become a Funder
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            <p>Be part of something bigger. The future is decentralized, sustainable, and collaborative.</p>
          </div>
        </div>
      </section>
      <ChatWidget />
    </div>
  );
}

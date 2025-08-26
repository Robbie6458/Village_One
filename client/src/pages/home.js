import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ForumSectionCard from "@/components/ui/forum-section-card";
import ChatWidget from "@/components/ui/chat-widget";
import VillageCard from "@/components/ui/village-card";
import { Mountain, Sprout, Users, Building, ServerCog, Brain, Leaf, ArrowUp, ArrowDown } from "lucide-react";
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
        rarity: "rare"
    },
    {
        name: "Horticulturist",
        description: "Food system designers who create sustainable growing practices and permaculture solutions.",
        icon: "🌱",
        activeCount: 34,
        rarity: "epic"
    },
    {
        name: "Village Engineer",
        description: "Systems architects who design infrastructure, power grids, and technological integrations.",
        icon: "⚡",
        activeCount: 23,
        rarity: "legendary"
    },
    {
        name: "Designer",
        description: "Creative visionaries who shape the aesthetic and functional aspects of village spaces.",
        icon: "🎨",
        activeCount: 41,
        rarity: "epic"
    },
    {
        name: "Funder",
        description: "Financial catalysts who provide capital and strategic investment for village development.",
        icon: "💰",
        activeCount: 12,
        rarity: "legendary"
    },
    {
        name: "Storyteller",
        description: "Community communicators who share our vision and connect people through narrative.",
        icon: "📖",
        activeCount: 28,
        rarity: "rare"
    },
    {
        name: "Artist",
        description: "Creative spirits who bring beauty and cultural expression to village life.",
        icon: "🎭",
        activeCount: 31,
        rarity: "epic"
    },
    {
        name: "Craftsperson",
        description: "Skilled artisans who create functional beauty using traditional and modern techniques.",
        icon: "🔨",
        activeCount: 45,
        rarity: "rare"
    },
    {
        name: "Permaculture Specialist",
        description: "Regenerative agriculture experts who design self-sustaining ecological systems.",
        icon: "🌿",
        activeCount: 22,
        rarity: "legendary"
    },
    {
        name: "Community Facilitator",
        description: "Social architects who foster collaboration, resolve conflicts, and build connections.",
        icon: "🤝",
        activeCount: 18,
        rarity: "epic"
    }
];
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
function TopContributorsSection() {
    const { data: users } = useQuery({
        queryKey: ['/api/users'],
    });
    // Sort users by contributions and take top 6
    const topContributors = users
        ?.sort((a, b) => (b.contributions || 0) - (a.contributions || 0))
        .slice(0, 6) || [];
    return (_jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: topContributors.map((user, index) => (_jsx(VillageCard, { user: {
                id: user.id,
                username: user.username,
                archetype: user.archetype,
                level: user.level || 1,
                contributions: user.contributions || 0,
                profileImage: user.profileImageUrl,
                bio: user.bio,
                skills: user.skills
            }, onClick: () => window.location.href = `/profile/${user.id}` }, user.id))) }));
}
function TopDiscussionsSection() {
    const { data: topPosts } = useQuery({
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
    return (_jsx("section", { className: "py-20 bg-gradient-to-b from-void to-space texture-organic", children: _jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-cyber font-bold text-electric-green mb-6", "data-testid": "text-top-discussions-title", children: "Top Community Discussions" }), _jsx("p", { className: "text-xl text-gray-400 max-w-3xl mx-auto", children: "Most engaging conversations shaping Village-One's development" })] }), _jsx("div", { className: "space-y-6", children: topPosts?.map((post) => {
                        const IconComponent = sectionIcons[post.forumSection] || Building;
                        const color = sectionColors[post.forumSection] || "neon-cyan";
                        return (_jsx(Link, { href: `/forum/${post.forumSection}`, children: _jsx("div", { className: "card-rare bg-gradient-to-r from-void to-purple-deep rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-purple-deep/50 hover:border-electric-green/50", "data-testid": `discussion-${post.id}`, children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: `w-12 h-12 bg-gradient-to-br from-${color} to-neon-cyan rounded-lg flex items-center justify-center flex-shrink-0`, children: _jsx(IconComponent, { className: "text-space", size: 20 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-2", children: [_jsx("h3", { className: "text-lg font-cyber font-bold text-white line-clamp-1", "data-testid": `title-${post.id}`, children: post.title }), _jsx("span", { className: `text-xs bg-${color}/20 text-${color} px-2 py-1 rounded-full capitalize`, children: post.forumSection })] }), _jsx("p", { className: "text-gray-400 text-sm mb-3 line-clamp-2", "data-testid": `content-${post.id}`, children: post.content }), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("span", { children: ["by ", post.author?.username || 'Anonymous'] }), _jsx("span", { className: `text-${color}`, children: post.author?.archetype || 'Village Builder' })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("span", { className: "flex items-center space-x-1", children: [_jsx(ArrowUp, { size: 12, className: "text-electric-green" }), _jsx("span", { className: "text-electric-green", children: post.upvotes })] }), post.downvotes > 0 && (_jsxs("span", { className: "flex items-center space-x-1", children: [_jsx(ArrowDown, { size: 12, className: "text-red-400" }), _jsx("span", { className: "text-red-400", children: post.downvotes })] }))] })] })] })] }) }) }, post.id));
                    }) }), _jsx("div", { className: "text-center mt-12", children: _jsx(Link, { href: "/forum/land", children: _jsx(Button, { className: "bg-gradient-to-r from-electric-green to-neon-cyan text-space font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform duration-300", "data-testid": "button-view-all-discussions", children: "View All Discussions" }) }) })] }) }));
}
export default function Home() {
    const { data: villageState } = useQuery({
        queryKey: ['/api/village-state'],
    });
    const { data: sentiments } = useQuery({
        queryKey: ['/api/sentiments'],
    });
    return (_jsxs("div", { className: "min-h-screen", children: [_jsxs("section", { className: "relative h-screen flex items-center justify-center overflow-hidden texture-organic", style: {
                    backgroundImage: "url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-space/80 via-space/60 to-space/90" }), _jsxs("div", { className: "relative z-10 text-center max-w-4xl mx-auto px-6", children: [_jsxs("h1", { className: "text-6xl font-cyber font-black mb-8 leading-tight", "data-testid": "hero-title", children: [_jsx("span", { className: "text-neon-cyan animate-glow", children: "Earth didn't end." }), _jsx("br", {}), _jsx("span", { className: "text-electric-green", children: "But something did." })] }), _jsxs("div", { className: "text-xl leading-relaxed mb-8 space-y-4", children: [_jsxs("p", { className: "text-gray-300", children: ["What we lost was\u2026 ", _jsx("span", { className: "text-holo-gold font-semibold", children: "Rhythm. Relationship. Reverence." })] }), _jsxs("p", { className: "text-gray-300", children: ["So a small collective\u2014", _jsx("span", { className: "text-neon-cyan font-semibold", children: "Village Collective" }), "\u2014launched the ", _jsx("span", { className: "text-electric-green font-semibold", children: "Village\u20111 Protocol" }), ":"] }), _jsx("p", { className: "text-gray-300", children: "A decentralized blueprint for rebuilding, one village at a time." })] }), _jsxs("div", { className: "text-lg text-gray-400 mb-12", children: [_jsxs("p", { children: ["The location is Earth. But the mindset is ", _jsx("span", { className: "text-holo-gold font-semibold", children: "New World" }), "."] }), _jsxs("p", { className: "text-2xl mt-4 font-semibold text-neon-cyan", children: ["You are not a tourist. You are a ", _jsx("span", { className: "text-electric-green", children: "settler" }), "."] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx(Link, { href: "/questionnaire", children: _jsx(Button, { className: "bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold py-4 px-8 rounded-lg hover:scale-[1.02] transition-transform duration-300 animate-glow", "data-testid": "button-questionnaire", children: "Find Your Place in the Village" }) }), _jsx(Button, { variant: "outline", className: "border-2 border-holo-gold text-holo-gold font-bold py-4 px-8 rounded-lg hover:bg-holo-gold hover:text-space transition-all duration-300", onClick: () => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' }), "data-testid": "button-learn-more", children: "Learn More" })] })] })] }), _jsx("section", { className: "py-20 bg-gradient-to-b from-space to-void texture-organic", id: "mission", children: _jsxs("div", { className: "max-w-6xl mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-cyber font-bold text-neon-cyan mb-6", "data-testid": "text-mission-title", children: "Village Collective Mission" }), _jsx("div", { className: "w-24 h-1 bg-gradient-to-r from-neon-cyan to-electric-green mx-auto" })] }), _jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("p", { className: "text-gray-300 text-[16px]", children: ["Village Collective was founded on the belief that ", _jsx("span", { className: "text-holo-gold font-semibold", children: "hospitality" }), "\u2014through vacation rentals and home sharing\u2014can fund and sustain local creative and productive communities."] }), _jsxs("p", { className: "text-gray-300 text-[16px]", children: ["More than a management company, Village Collective is a ", _jsx("span", { className: "text-neon-cyan font-semibold", children: "decentralized experiment" }), " in community-building, where each stay supports local food, art, and innovation."] }), _jsxs("p", { className: "text-gray-300 text-[16px]", children: ["Every booking contributes to the construction of ", _jsx("span", { className: "text-electric-green font-semibold", children: "\"Village\u2011One\"" }), ": a self-funded prototype village made possible by our growing network of managed properties and through the support of our growing online community."] })] }), _jsxs("div", { className: "card-epic rounded-xl p-6 bg-gradient-to-br from-void to-purple-deep", children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-electric-green to-neon-cyan rounded-lg flex items-center justify-center animate-pulse", children: _jsx(Brain, { className: "text-space", size: 20 }) }), _jsx("h3", { className: "text-xl font-cyber font-bold text-electric-green", "data-testid": "text-village-state-title", children: "State of the Village" }), _jsx("span", { className: "text-xs bg-electric-green text-space px-2 py-1 rounded-full", children: "AI Generated" })] }), _jsxs("div", { className: "space-y-4 text-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-400", children: "Community Sentiment" }), _jsx("span", { className: "text-electric-green font-semibold", "data-testid": "text-sentiment", children: "Optimistic" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-400", children: "Active Contributors" }), _jsx("span", { className: "text-neon-cyan font-semibold", "data-testid": "text-contributors", children: villageState?.stats.activeContributors || 0 })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-400", children: "Total Users" }), _jsx("span", { className: "text-holo-gold font-semibold", "data-testid": "text-total-users", children: villageState?.stats.totalUsers || 0 })] }), _jsx("div", { className: "pt-4 border-t border-purple-deep", children: _jsx("p", { className: "text-gray-300 text-xs leading-relaxed", "data-testid": "text-ai-summary", children: villageState?.summary || "Community discussions are active and engaged across all development areas." }) })] })] })] })] }) }), _jsx("section", { className: "py-20 bg-void texture-organic", children: _jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-cyber font-bold text-neon-cyan mb-6", "data-testid": "text-forum-title", children: "Build the Future Together" }), _jsx("p", { className: "text-xl text-gray-400 max-w-3xl mx-auto", children: "These six essential areas of discussion form the structural foundation of Village-One. Each archetype brings specialized knowledge to these conversations\u2014from Horticulturists shaping our land use to Village Engineers designing infrastructure, and Community Facilitators fostering collaborative ownership models." })] }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: FORUM_SECTIONS.map((section) => {
                                const sentiment = sentiments?.find(s => s.section.id === section.id);
                                return (_jsx(ForumSectionCard, { ...section, sentiment: sentiment?.sentiment || 'neutral', threadCount: sentiment?.activeThreads || 0 }, section.id));
                            }) })] }) }), _jsx(TopDiscussionsSection, {}), _jsx("section", { className: "py-20 bg-gradient-to-b from-void to-space texture-organic", children: _jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-cyber font-bold text-neon-cyan mb-6", "data-testid": "text-archetypes-title", children: "Meet the Village Builders" }), _jsx("p", { className: "text-xl text-gray-400 max-w-3xl mx-auto mb-6", children: "Together, these diverse archetypes form the foundation for a successful village community. Each brings unique skills, perspectives, and expertise that complement the others, creating a balanced ecosystem where innovation, sustainability, and human connection thrive." }), _jsx("p", { className: "text-lg text-electric-green", children: "Find your place among the builders shaping tomorrow's communities." })] }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16", children: ARCHETYPES.map((archetype, index) => (_jsx(Link, { href: `/people?archetype=${encodeURIComponent(archetype.name)}`, children: _jsxs("div", { className: `card-${archetype.rarity} rounded-xl p-4 bg-gradient-to-br from-void to-purple-deep hover:scale-[1.02] transition-transform duration-300 text-center border border-purple-deep/50 hover:border-electric-green/50 cursor-pointer h-64 flex flex-col overflow-hidden`, "data-testid": `archetype-card-${archetype.name.toLowerCase().replace(' ', '-')}`, children: [_jsxs("div", { className: "flex flex-col flex-shrink-0", children: [_jsx("div", { className: "text-4xl mb-2", children: archetype.icon }), _jsx("h3", { className: "text-lg font-cyber font-bold text-white mb-1 line-clamp-2", children: archetype.name }), _jsxs("div", { className: "text-sm text-electric-green mb-3", children: [archetype.activeCount, " Active Members"] })] }), _jsx("div", { className: "flex-1 flex items-end", children: _jsx("p", { className: "text-xs text-gray-400 leading-tight line-clamp-3 w-full", children: archetype.description }) })] }) }, index))) }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-cyber font-bold text-holo-gold mb-8 text-center", children: "Top Contributing Members" }), _jsx(TopContributorsSection, {})] }), _jsx("div", { className: "text-center mt-12", children: _jsx(Link, { href: "/questionnaire", children: _jsx(Button, { className: "bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold py-3 px-8 rounded-lg hover:scale-[1.02] transition-transform duration-300", "data-testid": "button-archetype-quiz", children: "Take the Archetype Quiz" }) }) })] }) }), _jsx("section", { className: "py-20 bg-void texture-organic", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-cyber font-bold text-neon-cyan mb-6", "data-testid": "text-faq-title", children: "Frequently Asked Questions" }), _jsx("div", { className: "w-24 h-1 bg-gradient-to-r from-neon-cyan to-electric-green mx-auto" })] }), _jsx("div", { className: "space-y-6", children: FAQ_ITEMS.map((faq, index) => (_jsx("div", { className: "border border-purple-deep rounded-lg p-6 hover:border-neon-cyan transition-colors duration-300", children: _jsxs("details", { className: "group", children: [_jsxs("summary", { className: "flex justify-between items-center w-full text-left cursor-pointer list-none", "data-testid": `faq-question-${index}`, children: [_jsx("h3", { className: "text-lg font-semibold text-holo-gold", children: faq.question }), _jsx("div", { className: "text-neon-cyan group-open:rotate-180 transition-transform duration-300", children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) }) })] }), _jsx("div", { className: "mt-4 text-gray-300", "data-testid": `faq-answer-${index}`, children: _jsx("p", { children: faq.answer }) })] }) }, index))) })] }) }), _jsx("section", { className: "py-20 bg-gradient-to-b from-space to-void texture-organic", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 text-center", children: [_jsx("h2", { className: "text-4xl font-cyber font-bold text-neon-cyan mb-6", "data-testid": "text-cta-title", children: "Ready to Build the Future?" }), _jsx("p", { className: "text-xl text-gray-300 mb-12", children: "Join thousands of visionaries creating a sustainable tomorrow" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-8 mb-12", children: [_jsxs("div", { className: "card-epic rounded-xl p-8 bg-gradient-to-br from-void to-purple-deep", children: [_jsx("h3", { className: "text-2xl font-cyber font-bold text-electric-green mb-4", children: "Start Contributing" }), _jsx("p", { className: "text-gray-300 mb-6", children: "Share your skills, ideas, and expertise with the community" }), _jsx(Link, { href: "/people", className: "block", children: _jsx(Button, { className: "w-full bg-gradient-to-r from-electric-green to-neon-cyan text-space font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300", "data-testid": "button-join-community", children: "Join the Community" }) })] }), _jsxs("div", { className: "card-legendary rounded-xl p-8 bg-gradient-to-br from-void to-purple-deep", children: [_jsx("h3", { className: "text-2xl font-cyber font-bold text-holo-gold mb-4", children: "Fund the Vision" }), _jsx("p", { className: "text-gray-300 mb-6", children: "Support village development through strategic investment" }), _jsx(Link, { href: "/crowdfunding", className: "block", children: _jsx(Button, { className: "w-full bg-gradient-to-r from-holo-gold to-electric-green text-space font-bold py-3 px-6 rounded-lg hover:scale-105 transition-transform duration-300", "data-testid": "button-become-funder", children: "Become a Funder" }) })] })] }), _jsx("div", { className: "text-sm text-gray-400", children: _jsx("p", { children: "Be part of something bigger. The future is decentralized, sustainable, and collaborative." }) })] }) }), _jsx(ChatWidget, {})] }));
}

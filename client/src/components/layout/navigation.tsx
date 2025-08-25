import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Mountain, 
  Sprout, 
  Users, 
  Building, 
  ServerCog, 
  ChartLine,
  MessageCircle,
  Leaf,
  Settings,
  LogOut,
  LogIn,
  Edit3,
  User,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const MAIN_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: ChartLine, count: null },
  { href: "/people", label: "Village Community", icon: Users, count: null },
  { href: "/crowdfunding", label: "Fund Village-One", icon: ChartLine, count: null },
];

const FORUM_SECTIONS = [
  { href: "/forum/land", label: "Land", icon: Mountain, count: 0 },
  { href: "/forum/resources", label: "Resources", icon: Sprout, count: 0 },
  { href: "/forum/people", label: "People", icon: Users, count: 0 },
  { href: "/forum/facilities", label: "Facilities", icon: Building, count: 0 },
  { href: "/forum/operations", label: "Operations", icon: ServerCog, count: 0 },
  { href: "/forum/ownership", label: "Ownership", icon: Leaf, count: 0 },
];

export default function Navigation() {
  const [location] = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const { user, profile, isAuthenticated, signOut } = useAuth();

  const currentUser = isAuthenticated && user ? {
    name: profile?.displayName || user.email?.split("@")[0] || "User",
    archetype: "Village Builder",
    level: 1,
    contributions: 0,
    avatar:
      profile?.avatarUrl ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&h=80",
  } : null;

  return (
    <nav className="fixed top-0 left-0 w-64 h-full bg-void border-r border-purple-deep z-50 texture-organic">
      <div className="p-6 h-full overflow-y-auto">
        <Link href="/">
          <div className="flex items-center space-x-3 mb-8 cursor-pointer" data-testid="nav-logo">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-electric-green rounded-lg flex items-center justify-center">
              <Leaf className="text-space" size={20} />
            </div>
            <h1 className="text-xl font-cyber font-bold text-neon-cyan">Village-One</h1>
          </div>
        </Link>
        
        {/* User Profile Card */}
        <div className="card-rare rounded-lg p-4 mb-6 bg-gradient-to-br from-void to-purple-deep">
          {currentUser ? (
            <>
              <Link href={`/profile/${user?.id || 'me'}`}>
                <div className="cursor-pointer hover:scale-105 transition-transform duration-300" data-testid="nav-profile-card">
                  <div className="flex items-center space-x-3 mb-2">
                    <img 
                      src={currentUser?.avatar} 
                      alt="User Avatar" 
                      className="w-12 h-12 rounded-full border-2 border-holo-gold"
                      data-testid="img-avatar"
                    />
                    <div>
                      <h3 className="font-semibold text-holo-gold" data-testid="text-username">{currentUser?.name}</h3>
                      <p className="text-xs text-neon-cyan" data-testid="text-archetype">{currentUser?.archetype}</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Level</span>
                      <span className="text-electric-green" data-testid="text-level">{currentUser?.level}</span>
                    </div>
                    <div className="w-full bg-void rounded-full h-1">
                      <div className="contribution-bar w-3/4"></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Contributions</span>
                      <span className="text-holo-gold" data-testid="text-contributions">{currentUser?.contributions?.toLocaleString?.() ?? 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
              {/* Profile Actions */}
              <div className="flex justify-between mt-3 pt-3 border-t border-purple-deep/50">
                <Link href={`/profile/${user?.id || 'me'}/edit`}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-electric-green p-1 h-auto"
                    data-testid="button-edit-profile"
                  >
                    <Edit3 size={14} />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-electric-green p-1 h-auto"
                  data-testid="button-settings"
                >
                  <Settings size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-red-400 p-1 h-auto"
                  onClick={signOut}
                  data-testid="button-logout"
                >
                  <LogOut size={14} />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-electric-green rounded-full mx-auto mb-3 flex items-center justify-center">
                <User className="text-space" size={20} />
              </div>
              <h3 className="font-semibold text-white mb-2">Join Village-One</h3>
              <p className="text-xs text-gray-400 mb-3">Connect with builders creating a sustainable future</p>
              <Link href="/login">
                <Button
                  className="w-full bg-gradient-to-r from-holo-gold to-electric-green text-space font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform duration-300 text-sm"
                  data-testid="button-join-community"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Main Navigation */}
        <div className="space-y-2 mb-6">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={cn(
                    "nav-item flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 cursor-pointer",
                    isActive && "bg-gradient-to-r from-neon-cyan/10 to-electric-green/10 border-l-3 border-neon-cyan"
                  )}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="text-neon-cyan" size={20} />
                  <span className="text-white">{item.label}</span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="ml-auto text-xs bg-electric-green text-space px-2 py-1 rounded-full" data-testid={`nav-count-${item.label.toLowerCase()}`}>
                      {item.count}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Community Forum Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 px-3">Community Forum</h3>
          <div className="space-y-2">
            {FORUM_SECTIONS.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    className={cn(
                      "nav-item flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 cursor-pointer",
                      isActive && "bg-gradient-to-r from-neon-cyan/10 to-electric-green/10 border-l-3 border-neon-cyan"
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="text-neon-cyan" size={20} />
                    <span className="text-white">{item.label}</span>
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="ml-auto text-xs bg-electric-green text-space px-2 py-1 rounded-full" data-testid={`nav-count-${item.label.toLowerCase()}`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Authentication & Chat Toggle */}
        <div className="mt-8 pt-6 border-t border-purple-deep space-y-3">
          {/* Login/Logout Button */}
          {isAuthenticated ? (
            <Button
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold py-3 rounded-lg hover:scale-105 transition-transform duration-300"
              onClick={signOut}
              data-testid="button-logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          ) : (
            <Link href="/login">
              <Button
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-holo-gold to-electric-green text-space font-semibold py-3 rounded-lg hover:scale-105 transition-transform duration-300"
                data-testid="button-login"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Button>
            </Link>
          )}
          
          <Button 
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-neon-cyan to-electric-green text-space font-semibold py-3 rounded-lg hover:scale-105 transition-transform duration-300"
            onClick={() => setChatOpen(!chatOpen)}
            data-testid="button-chat-toggle"
          >
            <MessageCircle size={20} />
            <span>Live Chat</span>
            <div className="w-2 h-2 bg-electric-green rounded-full animate-pulse"></div>
          </Button>
        </div>
      </div>
    </nav>
  );
}

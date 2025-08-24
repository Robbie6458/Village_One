import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageSquare, 
  DollarSign, 
  TrendingUp,
  Brain,
  Target
} from "lucide-react";

export default function Dashboard() {
  const { data: villageState } = useQuery({
    queryKey: ['/api/village-state'],
    retry: 1,
    staleTime: 30000
  });

  const { data: forumSentimentAnalysis } = useQuery({
    queryKey: ['/api/forum-sentiment-analysis'],
    retry: 1,
    staleTime: 30000
  });

  const { data: nextSteps } = useQuery({
    queryKey: ['/api/next-steps'],
    retry: 1,
    staleTime: 30000
  });

  const { data: totalFunding } = useQuery({
    queryKey: ['/api/contributions/total'],
    retry: 1,
    staleTime: 30000
  });

  // Ensure stats are always valid numbers
  const stats = {
    totalUsers: Number((villageState as any)?.stats?.totalUsers) || 0,
    totalPosts: Number((villageState as any)?.stats?.totalPosts) || 0,
    totalFunding: Number((villageState as any)?.stats?.totalFunding) || 0,
    totalVotes: Number((villageState as any)?.stats?.totalVotes) || 0,
    activeContributors: Number((villageState as any)?.stats?.activeContributors) || 0
  };

  const progressData = [
    { name: "Land Acquisition", progress: 45, color: "holo-gold" },
    { name: "Resource Planning", progress: 78, color: "electric-green" },
    { name: "Community Building", progress: 92, color: "neon-cyan" },
    { name: "Infrastructure Design", progress: 34, color: "electric-green" },
    { name: "Funding Goal", progress: 67, color: "holo-gold" },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-space to-void texture-organic">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-cyber font-bold text-neon-cyan mb-4" data-testid="text-dashboard-title">
            Village-One Dashboard
          </h1>
          <p className="text-xl text-gray-400">
            Real-time insights into community progress and development
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="card-rare bg-gradient-to-br from-void to-purple-deep border-holo-gold">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Members</CardTitle>
              <Users className="text-neon-cyan" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-holo-gold" data-testid="text-total-members">
                {stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="card-epic bg-gradient-to-br from-void to-purple-deep border-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Forum Posts</CardTitle>
              <MessageSquare className="text-electric-green" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-electric-green" data-testid="text-total-posts">
                {stats.totalPosts.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="card-legendary bg-gradient-to-br from-void to-purple-deep border-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Funding</CardTitle>
              <DollarSign className="text-holo-gold" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-holo-gold" data-testid="text-total-funding">
                ${((totalFunding as any)?.total ?? stats.totalFunding).toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">
                67% of goal reached
              </p>
            </CardContent>
          </Card>

          <Card className="card-rare bg-gradient-to-br from-void to-purple-deep border-neon-cyan">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Contributors</CardTitle>
              <TrendingUp className="text-neon-cyan" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-cyan" data-testid="text-active-contributors">
                {stats.activeContributors.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">
                Active this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Summary */}
        <Card className="card-epic bg-gradient-to-br from-void to-purple-deep mb-12 border-electric-green">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Brain className="text-electric-green" size={24} />
              <span className="text-electric-green font-cyber">AI Village State Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed" data-testid="text-ai-village-summary">
              {(villageState as any)?.summary ?? "Generating village state analysis..."}
            </p>
          </CardContent>
        </Card>

        {/* Progress Tracking */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-void to-space border-purple-deep">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Target className="text-neon-cyan" size={20} />
                <span className="text-neon-cyan font-cyber">Development Milestones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressData.map((item, index) => (
                <div key={index} className="space-y-2" data-testid={`milestone-${item.name.toLowerCase().replace(' ', '-')}`}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.name}</span>
                    <span className={`text-${item.color} font-semibold`}>{item.progress}%</span>
                  </div>
                  <Progress 
                    value={item.progress} 
                    className="h-2 bg-space"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-void to-space border-purple-deep">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Brain className="text-holo-gold" size={20} />
                <span className="text-holo-gold font-cyber">Forum Sentiment Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.isArray(forumSentimentAnalysis) && forumSentimentAnalysis.length > 0 ? forumSentimentAnalysis.map((analysis: any, index: number) => (
                <div key={index} className="p-3 bg-void rounded-lg border border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-gray-300 font-medium capitalize">{analysis.section}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs capitalize font-semibold ${
                          analysis.priority === 'high' ? 'text-red-400' : 
                          analysis.priority === 'medium' ? 'text-yellow-400' : 
                          'text-green-400'
                        }`}>
                          {analysis.priority} priority
                        </span>
                        <span className="text-xs text-gray-500">
                          {analysis.activeThreads} threads • {analysis.engagement} interactions
                        </span>
                      </div>
                    </div>
                    <span className="text-electric-green capitalize font-semibold">
                      {analysis.sentiment}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{analysis.summary}</p>
                </div>
              )) : (
                <div className="text-center py-6 text-gray-400">
                  Loading AI sentiment analysis...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI-Generated Next Steps & Priorities */}
        <Card className="card-legendary bg-gradient-to-br from-void to-purple-deep border-orange-500">
          <CardHeader>
            <CardTitle className="text-holo-gold font-cyber flex items-center gap-2">
              <Target className="w-5 h-5" />
              AI-Generated Next Steps & Priorities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(nextSteps) && nextSteps.length > 0 ? nextSteps.map((step: any, index: number) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  step.priority === 'high' ? 'bg-red-950/30 border-red-500/50' : 
                  step.priority === 'medium' ? 'bg-yellow-950/30 border-yellow-500/50' : 
                  'bg-green-950/30 border-green-500/50'
                }`} data-testid={`next-step-${index}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${
                      step.priority === 'high' ? 'text-red-400' : 
                      step.priority === 'medium' ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {step.title}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${
                      step.priority === 'high' ? 'bg-red-500/20 text-red-300' : 
                      step.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {step.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{step.description}</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Category: <span className="text-gray-300">{step.category}</span></div>
                    <div>Impact: <span className="text-gray-300">{step.estimatedImpact}</span></div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-400">Generating AI-powered next steps...</div>
                  <div className="text-sm text-gray-500 mt-2">Analyzing community activity and priorities</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

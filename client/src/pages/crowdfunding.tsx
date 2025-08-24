import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import ContributionTracker from "@/components/ui/contribution-tracker";
import { 
  DollarSign, 
  Crown, 
  Hammer, 
  Home, 
  Star,
  Users,
  Target,
  TrendingUp,
  Gift
} from "lucide-react";

const CONTRIBUTION_TIERS = [
  {
    id: "settler",
    name: "Village Settler",
    amount: 100,
    icon: Home,
    color: "earth-green",
    description: "Join the founding community and help establish Village-One",
    perks: [
      "Digital Village Member Certificate",
      "Access to exclusive community updates",
      "Village-One founding member badge",
      "Early access to village events"
    ]
  },
  {
    id: "builder",
    name: "Village Builder", 
    amount: 500,
    icon: Hammer,
    color: "electric-green",
    description: "Contribute to the physical construction and development",
    perks: [
      "All Settler perks",
      "Your name on the Village-One founders wall",
      "Invitation to groundbreaking ceremony",
      "Quarterly progress reports with exclusive insights",
      "10% discount on future village stays"
    ]
  },
  {
    id: "founder",
    name: "Village Founder",
    amount: 2500,
    icon: Crown,
    color: "holo-gold",
    description: "Foundational leadership role in shaping Village-One's future",
    perks: [
      "All Builder perks", 
      "Lifetime honorary Village-One citizenship",
      "Annual founder's retreat invitation",
      "Input on major village decisions",
      "Free annual week stay at Village-One",
      "Custom archetype assessment and role assignment"
    ]
  }
];

const contributionFormSchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1"),
  tier: z.string().min(1, "Please select a contribution tier"),
});

export default function Crowdfunding() {
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: totalFunding } = useQuery({
    queryKey: ['/api/contributions/total'],
  });

  const { data: recentContributions = [] } = useQuery({
    queryKey: ['/api/contributions/recent'], // This endpoint would need to be implemented
    enabled: false, // Disable for now since endpoint doesn't exist
  });

  const form = useForm<z.infer<typeof contributionFormSchema>>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      amount: 0,
      tier: "",
    },
  });

  const contributeMutation = useMutation({
    mutationFn: (data: z.infer<typeof contributionFormSchema>) =>
      apiRequest('POST', '/api/contributions', {
        ...data,
        userId: 'current-user-id', // In a real app, get from auth context
        perks: CONTRIBUTION_TIERS.find(t => t.id === data.tier)?.perks || [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contributions/total'] });
      form.reset();
      setDialogOpen(false);
      setSelectedTier("");
      setCustomAmount(0);
    },
  });

  const handleTierSelect = (tier: any) => {
    setSelectedTier(tier.id);
    setCustomAmount(tier.amount);
    form.setValue('tier', tier.id);
    form.setValue('amount', tier.amount);
  };

  const handleCustomAmount = (amount: number) => {
    setCustomAmount(amount);
    form.setValue('amount', amount);
    
    // Determine tier based on amount
    const appropriateTier = CONTRIBUTION_TIERS
      .slice()
      .reverse()
      .find(tier => amount >= tier.amount);
    
    if (appropriateTier) {
      setSelectedTier(appropriateTier.id);
      form.setValue('tier', appropriateTier.id);
    }
  };

  const onSubmit = (data: z.infer<typeof contributionFormSchema>) => {
    contributeMutation.mutate(data);
  };

  const fundingGoal = 1000000; // $1M goal
  const currentFunding = totalFunding?.total || 0;
  const fundingProgress = (currentFunding / fundingGoal) * 100;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-space to-void texture-organic">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-cyber font-bold text-neon-cyan mb-4" data-testid="text-crowdfunding-title">
            Fund Village-One
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Support the creation of a sustainable, self-sufficient community that serves as a blueprint for the future
          </p>
        </div>

        {/* Funding Progress */}
        <Card className="card-legendary bg-gradient-to-br from-void to-purple-deep border-holo-gold mb-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Target className="text-holo-gold" size={24} />
              <span className="text-holo-gold font-cyber">Funding Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContributionTracker 
              current={currentFunding}
              goal={fundingGoal}
              progress={fundingProgress}
            />
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-electric-green" data-testid="text-current-funding">
                  ${currentFunding.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Raised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-holo-gold" data-testid="text-funding-goal">
                  ${fundingGoal.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Goal</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neon-cyan" data-testid="text-funding-progress">
                  {Math.round(fundingProgress)}%
                </div>
                <div className="text-sm text-gray-400">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contribution Tiers */}
        <div className="mb-12">
          <h2 className="text-3xl font-cyber font-bold text-electric-green mb-8 text-center">
            Choose Your Impact Level
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {CONTRIBUTION_TIERS.map((tier) => {
              const Icon = tier.icon;
              const isPopular = tier.id === "builder";
              
              return (
                <Card 
                  key={tier.id}
                  className={`relative bg-gradient-to-br from-void to-purple-deep hover:scale-105 transition-transform duration-300 cursor-pointer ${
                    tier.id === "settler" ? "card-rare" :
                    tier.id === "builder" ? "card-epic" : "card-legendary"
                  }`}
                  onClick={() => handleTierSelect(tier)}
                  data-testid={`card-tier-${tier.id}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-electric-green text-space px-4 py-1 rounded-full text-sm font-bold flex items-center">
                        <Star size={16} className="mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br from-${tier.color} to-electric-green rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="text-space" size={32} />
                    </div>
                    <CardTitle className={`text-2xl font-cyber text-${tier.color}`}>
                      {tier.name}
                    </CardTitle>
                    <div className="text-4xl font-bold text-white">
                      ${tier.amount.toLocaleString()}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-center">
                      {tier.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-neon-cyan flex items-center">
                        <Gift size={16} className="mr-2" />
                        Perks & Benefits
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        {tier.perks.map((perk, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-electric-green rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Contribution Form */}
        <Card className="card-epic bg-gradient-to-br from-void to-purple-deep border-electric-green max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-electric-green font-cyber text-2xl">
              Make Your Contribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Tier Selection */}
                <div className="grid grid-cols-3 gap-3">
                  {CONTRIBUTION_TIERS.map((tier) => (
                    <Button
                      key={tier.id}
                      type="button"
                      variant={selectedTier === tier.id ? "default" : "outline"}
                      onClick={() => handleTierSelect(tier)}
                      className={`h-auto py-3 ${
                        selectedTier === tier.id 
                          ? "bg-gradient-to-r from-neon-cyan to-electric-green text-space" 
                          : "border-purple-deep text-gray-300"
                      }`}
                      data-testid={`button-select-tier-${tier.id}`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{tier.name}</div>
                        <div className="text-sm">${tier.amount}</div>
                      </div>
                    </Button>
                  ))}
                </div>

                {/* Custom Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Custom Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter custom amount..."
                          className="bg-space border-purple-deep text-white"
                          value={customAmount || ""}
                          onChange={(e) => handleCustomAmount(Number(e.target.value))}
                          data-testid="input-custom-amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Selected Tier Info */}
                {selectedTier && (
                  <div className="p-4 rounded-lg bg-space/50 border border-purple-deep">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-lg font-semibold text-electric-green">
                        {CONTRIBUTION_TIERS.find(t => t.id === selectedTier)?.name}
                      </div>
                      <div className="text-lg font-bold text-white">
                        ${customAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      You'll receive all perks for this tier and become a foundational member of Village-One.
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!selectedTier || customAmount < 1 || contributeMutation.isPending}
                  className="w-full bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold py-3 text-lg"
                  data-testid="button-contribute"
                >
                  {contributeMutation.isPending ? 'Processing...' : `Contribute $${customAmount.toLocaleString()}`}
                </Button>

                <div className="text-center text-sm text-gray-400">
                  <p>Secure payment processing • 100% of funds go to Village-One development</p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Impact Statement */}
        <Card className="bg-gradient-to-br from-void to-space border-purple-deep mt-12">
          <CardHeader>
            <CardTitle className="text-center text-neon-cyan font-cyber">Your Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-earth-green to-electric-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Home className="text-space" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-earth-green mb-2">Sustainable Living</h3>
                <p className="text-gray-300 text-sm">
                  Help create eco-friendly homes and buildings that minimize environmental impact while maximizing comfort and functionality.
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-electric-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="text-space" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-neon-cyan mb-2">Community Building</h3>
                <p className="text-gray-300 text-sm">
                  Foster connections and collaboration among diverse individuals working toward a shared vision of sustainable community.
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-holo-gold to-electric-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-space" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-holo-gold mb-2">Future Blueprint</h3>
                <p className="text-gray-300 text-sm">
                  Establish a replicable model that can inspire and guide the creation of sustainable communities worldwide.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContributionTrackerProps {
  current: number;
  goal: number;
  progress: number;
  showMilestones?: boolean;
  className?: string;
}

const MILESTONES = [
  { amount: 100000, label: "Land Survey", icon: Target, color: "earth-green" },
  { amount: 250000, label: "Infrastructure Design", icon: TrendingUp, color: "neon-cyan" },
  { amount: 500000, label: "Construction Begin", icon: Award, color: "electric-green" },
  { amount: 750000, label: "First Buildings", icon: Award, color: "holo-gold" },
  { amount: 1000000, label: "Village Complete", icon: Award, color: "holo-gold" },
];

export default function ContributionTracker({ 
  current, 
  goal, 
  progress, 
  showMilestones = true,
  className 
}: ContributionTrackerProps) {
  const nextMilestone = MILESTONES.find(milestone => current < milestone.amount);
  const completedMilestones = MILESTONES.filter(milestone => current >= milestone.amount);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progress to Goal</span>
          <span className="text-neon-cyan font-semibold">{Math.round(progress)}%</span>
        </div>
        
        <div className="relative">
          <Progress 
            value={progress} 
            className="h-4 bg-space"
            data-testid="progress-funding"
          />
          
          {/* Milestone markers */}
          {showMilestones && MILESTONES.map((milestone, index) => {
            const position = (milestone.amount / goal) * 100;
            const isCompleted = current >= milestone.amount;
            const Icon = milestone.icon;
            
            return (
              <div
                key={index}
                className="absolute top-0 transform -translate-x-1/2 -translate-y-2"
                style={{ left: `${Math.min(position, 95)}%` }}
                data-testid={`milestone-${index}`}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border-2 bg-space transition-colors duration-300",
                  isCompleted 
                    ? `border-${milestone.color} bg-${milestone.color}/20` 
                    : "border-gray-600"
                )}>
                  <Icon 
                    size={12} 
                    className={cn(
                      isCompleted ? `text-${milestone.color}` : "text-gray-600"
                    )} 
                  />
                </div>
                
                {/* Tooltip */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-void border border-purple-deep rounded px-2 py-1 text-xs whitespace-nowrap">
                    <div className={cn("font-semibold", isCompleted ? `text-${milestone.color}` : "text-gray-400")}>
                      {milestone.label}
                    </div>
                    <div className="text-gray-400">
                      ${milestone.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <Card className="bg-gradient-to-r from-space/50 to-void/50 border-purple-deep">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  `bg-${nextMilestone.color}/20`
                )}>
                  <nextMilestone.icon className={`text-${nextMilestone.color}`} size={20} />
                </div>
                <div>
                  <div className="font-semibold text-white">Next Milestone</div>
                  <div className={`text-sm text-${nextMilestone.color}`}>
                    {nextMilestone.label}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  ${nextMilestone.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  ${(nextMilestone.amount - current).toLocaleString()} to go
                </div>
              </div>
            </div>
            
            {/* Progress to next milestone */}
            <div className="mt-3">
              <Progress 
                value={((current % nextMilestone.amount) / nextMilestone.amount) * 100} 
                className="h-2 bg-space"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Milestones */}
      {showMilestones && completedMilestones.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-electric-green flex items-center">
            <Award size={16} className="mr-2" />
            Completed Milestones
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {completedMilestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center space-x-2 p-3 rounded-lg",
                    `bg-${milestone.color}/10 border border-${milestone.color}/30`
                  )}
                  data-testid={`completed-milestone-${index}`}
                >
                  <Icon className={`text-${milestone.color}`} size={16} />
                  <div>
                    <div className={`text-sm font-semibold text-${milestone.color}`}>
                      {milestone.label}
                    </div>
                    <div className="text-xs text-gray-400">
                      ${milestone.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

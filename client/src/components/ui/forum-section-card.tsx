import { Link } from "wouter";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ForumSectionCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  rarity: string;
  tags: string[];
  sentiment?: string;
  threadCount?: number;
}

export default function ForumSectionCard({
  id,
  title,
  subtitle,
  description,
  icon: Icon,
  color,
  rarity,
  tags,
  sentiment = "neutral",
  threadCount = 0
}: ForumSectionCardProps) {
  const colorClasses = {
    "holo-gold": "from-holo-gold to-earth-green",
    "electric-green": "from-electric-green to-earth-green",
    "neon-cyan": "from-neon-cyan to-electric-green"
  };

  const sentimentColors = {
    optimistic: "text-electric-green",
    focused: "text-neon-cyan", 
    innovative: "text-electric-green",
    collaborative: "text-holo-gold",
    technical: "text-neon-cyan",
    creative: "text-electric-green",
    neutral: "text-gray-400",
    concerned: "text-orange-400"
  };

  return (
    <Link href={`/forum/${id}`}>
      <div 
        className={cn(
          "rounded-xl p-6 bg-gradient-to-br from-void to-space hover:scale-105 transition-transform duration-300 cursor-pointer h-80 flex flex-col",
          `card-${rarity}`
        )}
        data-testid={`card-forum-${id}`}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className={cn(
            "w-12 h-12 bg-gradient-to-br rounded-lg flex items-center justify-center",
            colorClasses[color as keyof typeof colorClasses] || "from-gray-500 to-gray-600"
          )}>
            <Icon className="text-space" size={20} />
          </div>
          <div>
            <h3 className={cn("text-xl font-cyber font-bold", `text-${color}`)}>{title}</h3>
            <p className={cn("text-sm", `text-${color}`)}>{subtitle}</p>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 flex-grow">{description}</p>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Active Threads</span>
            <span className="text-electric-green font-semibold" data-testid={`text-thread-count-${id}`}>
              {threadCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">AI Sentiment</span>
            <span 
              className={cn("font-semibold capitalize", sentimentColors[sentiment as keyof typeof sentimentColors])}
              data-testid={`text-sentiment-${id}`}
            >
              {sentiment}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className={cn(
                  "px-2 py-1 rounded text-xs",
                  color === "holo-gold" && "bg-holo-gold/20 text-holo-gold",
                  color === "electric-green" && "bg-electric-green/20 text-electric-green", 
                  color === "neon-cyan" && "bg-neon-cyan/20 text-neon-cyan"
                )}
                data-testid={`tag-${tag.toLowerCase()}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

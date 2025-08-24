import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function analyzeSentiment(texts: string[]): Promise<{
  sentiment: string,
  confidence: number,
  summary: string
}> {
  try {
    const combinedText = texts.join('\n\n');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert for a community building platform. Analyze the overall sentiment and provide a one-word sentiment (optimistic, focused, innovative, collaborative, technical, creative, neutral, concerned), confidence score 0-100, and brief summary. Respond with JSON in this format: { 'sentiment': string, 'confidence': number, 'summary': string }"
        },
        {
          role: "user",
          content: `Analyze the sentiment of these community forum posts: ${combinedText}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      sentiment: result.sentiment || 'neutral',
      confidence: Math.max(0, Math.min(100, result.confidence || 75)),
      summary: result.summary || 'Community discussions are active.'
    };
  } catch (error: any) {
    console.error('Failed to analyze sentiment:', error);
    
    // Enhanced fallback handling for API limits
    let fallbackSentiment = 'optimistic';
    let fallbackSummary = 'Community discussions remain active and engaged.';
    
    if (error.status === 429) {
      fallbackSentiment = 'collaborative';
      fallbackSummary = 'AI analysis temporarily limited, but community engagement continues strong.';
    }
    
    return {
      sentiment: fallbackSentiment,
      confidence: 65,
      summary: fallbackSummary
    };
  }
}

export async function generateVillageStateSummary(
  posts: any[],
  users: any[],
  totalContributions: number,
  votes: any[] = []
): Promise<string> {
  const totalVotes = votes.length;
  const upvotes = votes.filter(v => v.voteType === 'upvote').length;
  const downvotes = votes.filter(v => v.voteType === 'downvote').length;
  
  const sectionActivity = posts.reduce((acc: any, post) => {
    acc[post.forumSection] = (acc[post.forumSection] || 0) + 1;
    return acc;
  }, {});

  const prompt = `Village-One is a decentralized experiment in community-building where users collaborate through a forum system towards the eventual construction of Village-One, a sustainable intentional community. Please analyze all current forum posts and create a 500 character summary of the site activity and progress towards this goal.

Current Community Data:
- Total registered users: ${users.length}
- Total forum posts: ${posts.length} 
- Total voting activity: ${totalVotes} votes (${upvotes} upvotes, ${downvotes} downvotes)
- Total contributions: $${totalContributions}
- Forum activity by section: ${Object.entries(sectionActivity).map(([section, count]) => `${section}: ${count} posts`).join(', ')}
- Recent post titles: ${posts.slice(0, 8).map(p => `"${p.title}"`).join(', ')}

Generate a concise summary focusing on community engagement, collaborative progress, and momentum toward building Village-One. Keep it inspiring and factual, max 500 characters.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    return response.choices[0].message.content?.trim() || "Village-One is gaining momentum with active community participation in planning our sustainable future.";
  } catch (error: any) {
    console.error('Failed to generate village state summary:', error);
    
    // Enhanced fallback message based on error type
    if (error.status === 429) {
      return 'Village-One is gaining momentum with strong community engagement across all development areas. AI insights are temporarily paused while authentic collaboration continues in real-time.';
    }
    
    return 'Village-One is gaining momentum with active community participation in planning our sustainable future.';
  }
}

export async function determineArchetype(responses: Record<string, string>): Promise<string> {
  try {
    const responseText = Object.entries(responses)
      .map(([question, answer]) => `${question}: ${answer}`)
      .join('\n');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an archetype assessment expert. Based on questionnaire responses, determine which Village-One archetype best fits the person. Available archetypes: Builder, Horticulturist, Village Engineer, Designer, Funder, Storyteller, Artist, Craftsperson, Permaculture Specialist, Community Facilitator. Respond with JSON in this format: { "archetype": string, "reasoning": string }`
        },
        {
          role: "user",
          content: `Determine the best archetype for someone with these responses: ${responseText}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.archetype || 'Builder';
  } catch (error) {
    console.error('Failed to determine archetype:', error);
    return 'Builder';
  }
}

export async function answerVillageQuestion(question: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for Village-One, a sustainable community-building project. You help answer visitor questions about the project, community, ownership models, and participation. Be knowledgeable, friendly, and encouraging. Focus on:

- Village-One's mission to build sustainable communities
- Collective ownership models (CLTs, cooperatives, ESOPs)
- Revenue streams (vacation rentals, workshops, agriculture)
- Community archetypes and how people can contribute
- Addressing concerns about legitimacy, cults, or financial risk
- Timeline, locations, and practical next steps

Keep responses under 200 words and direct people to relevant forum sections when appropriate.`
        },
        {
          role: "user",
          content: question
        }
      ],
    });

    return response.choices[0].message.content || 'Thanks for your interest in Village-One! I recommend exploring our forums to learn more about the community and how you can get involved.';
  } catch (error: any) {
    console.error('Failed to answer village question:', error);
    
    // Provide helpful fallbacks based on common question patterns
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('cost') || lowerQuestion.includes('money') || lowerQuestion.includes('price')) {
      return 'Village-One membership tiers range from $500 (Settler) to $25,000 (Founder). These contributions fund land acquisition and infrastructure. Visit our Crowdfunding section for detailed information about investment options and returns.';
    }
    
    if (lowerQuestion.includes('cult') || lowerQuestion.includes('scam') || lowerQuestion.includes('real')) {
      return 'Village-One is a legitimate community-building project with transparent governance, individual property rights, and democratic decision-making. We\'re not a cult or commune - members maintain full autonomy while collaborating on shared resources.';
    }
    
    if (lowerQuestion.includes('location') || lowerQuestion.includes('where')) {
      return 'We\'re evaluating sites in the Pacific Northwest, focusing on areas with favorable zoning, natural resources, and proximity to urban centers. The community will vote on the final location. Check our Land forum for current research.';
    }
    
    if (lowerQuestion.includes('archetype') || lowerQuestion.includes('role') || lowerQuestion.includes('contribute')) {
      return 'Village-One has 10 archetypes: Builder, Designer, Horticulturist, Village Engineer, Funder, Storyteller, Artist, Craftsperson, Permaculture Specialist, and Community Facilitator. Take our archetype quiz to find your best fit!';
    }
    
    return 'Thanks for your interest in Village-One! Explore our forums to learn more about sustainable community building, ownership models, and how to get involved. Feel free to ask specific questions about the project.';
  }
}

// Generate forum-specific sentiment analysis with priorities
export async function generateForumSentimentAnalysis(
  posts: any[],
  votes: any[] = []
): Promise<Array<{
  section: string;
  sentiment: string;
  summary: string;
  priority: 'high' | 'medium' | 'low';
  activeThreads: number;
  engagement: number;
}>> {
  const sections = ['land', 'resources', 'people', 'facilities', 'operations', 'ownership'];
  const results = [];

  for (const section of sections) {
    const sectionPosts = posts.filter(p => p.forumSection === section);
    const sectionVotes = votes.filter(v => 
      sectionPosts.some(post => post.id === v.postId)
    );

    if (sectionPosts.length === 0) {
      results.push({
        section,
        sentiment: 'neutral',
        summary: 'No recent activity in this section.',
        priority: 'low' as const,
        activeThreads: 0,
        engagement: 0
      });
      continue;
    }

    const postTexts = sectionPosts.map(p => `${p.title}: ${p.content}`);
    const engagement = sectionVotes.length + sectionPosts.length;
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are analyzing forum discussions for Village-One's community building project. Analyze sentiment, summarize key themes, and assess priority level. Respond with JSON: { 'sentiment': string, 'summary': string, 'priority': 'high'|'medium'|'low' }"
          },
          {
            role: "user",
            content: `Analyze the ${section} forum section with ${sectionPosts.length} posts and ${sectionVotes.length} votes. Key discussions: ${postTexts.slice(0, 3).join('; ')}`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 150
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      results.push({
        section,
        sentiment: analysis.sentiment || 'neutral',
        summary: analysis.summary || `${sectionPosts.length} active discussions`,
        priority: analysis.priority || 'medium',
        activeThreads: sectionPosts.length,
        engagement
      });
    } catch (error) {
      console.error(`Failed to analyze ${section} sentiment:`, error);
      results.push({
        section,
        sentiment: 'optimistic',
        summary: `${sectionPosts.length} active discussions with community engagement`,
        priority: engagement > 5 ? 'high' : engagement > 2 ? 'medium' : 'low',
        activeThreads: sectionPosts.length,
        engagement
      });
    }
  }

  return results;
}

// Generate next steps and priorities based on community activity
export async function generateNextStepsAndPriorities(
  posts: any[],
  users: any[],
  votes: any[] = [],
  forumAnalysis: any[] = []
): Promise<Array<{
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  estimatedImpact: string;
}>> {
  const highPrioritySections = forumAnalysis.filter(f => f.priority === 'high');
  const mostEngagedSections = forumAnalysis.sort((a, b) => b.engagement - a.engagement).slice(0, 3);
  
  const prompt = `Based on Village-One community analysis, generate 4-6 actionable next steps and priorities:

Community Stats:
- ${users.length} members, ${posts.length} posts, ${votes.length} votes
- High priority sections: ${highPrioritySections.map(s => s.section).join(', ')}
- Most engaged sections: ${mostEngagedSections.map(s => `${s.section} (${s.engagement} interactions)`).join(', ')}
- Recent topics: ${posts.slice(0, 5).map(p => p.title).join(', ')}

Generate JSON array with format: { "title": string, "description": string, "priority": "high"|"medium"|"low", "category": string, "estimatedImpact": string }

Focus on concrete actions the community can take to advance Village-One development.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 400
    });

    const result = JSON.parse(response.choices[0].message.content || '{"steps": []}');
    return result.steps || result.priorities || [];
  } catch (error) {
    console.error('Failed to generate next steps:', error);
    
    // Provide smart fallbacks based on actual data
    const fallbackSteps = [];
    
    if (highPrioritySections.length > 0) {
      fallbackSteps.push({
        title: `Advance ${highPrioritySections[0].section} discussions`,
        description: `Build on current momentum in ${highPrioritySections[0].section} planning`,
        priority: 'high' as const,
        category: highPrioritySections[0].section,
        estimatedImpact: 'High - addresses community priority'
      });
    }
    
    if (users.length < 50) {
      fallbackSteps.push({
        title: 'Expand community membership',
        description: 'Grow active membership to build diverse expertise',
        priority: 'medium' as const,
        category: 'community',
        estimatedImpact: 'Medium - increases collaborative capacity'
      });
    }
    
    fallbackSteps.push({
      title: 'Increase forum engagement',
      description: 'Encourage more community members to participate in discussions',
      priority: 'medium' as const,
      category: 'engagement',
      estimatedImpact: 'Medium - strengthens community bonds'
    });

    return fallbackSteps.slice(0, 4);
  }
}

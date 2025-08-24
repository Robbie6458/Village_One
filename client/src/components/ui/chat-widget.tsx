import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  message: string;
  userId: string;
  createdAt: string;
  user?: {
    username: string;
    archetype?: string;
  };
}

export default function ChatWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket();

  // Load initial messages
  const { data: initialMessages } = useQuery({
    queryKey: ['/api/chat/messages'],
    enabled: isExpanded,
  });

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Handle new WebSocket messages
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'chat') {
      setMessages(prev => [...prev, lastMessage]);
    }
  }, [lastMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // AI Chat mutation
  const aiChatMutation = useMutation({
    mutationFn: (question: string) => apiRequest('POST', '/api/chat/ai', { question }),
    onSuccess: (data) => {
      // Add AI response as a system message
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        message: data.answer,
        userId: 'village-ai',
        createdAt: new Date().toISOString(),
        user: {
          username: 'Village AI',
          archetype: 'Assistant'
        }
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Check if it's an AI query (starts with @ai or is a question)
    const isAIQuery = message.startsWith('@ai') || message.includes('?') || 
                      message.toLowerCase().includes('village') || 
                      message.toLowerCase().includes('how') || 
                      message.toLowerCase().includes('what');
    
    if (isAIQuery) {
      // Send to AI
      const cleanQuestion = message.replace(/^@ai\s*/i, '');
      
      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        message,
        userId: 'visitor',
        createdAt: new Date().toISOString(),
        user: {
          username: 'You',
          archetype: 'Visitor'
        }
      };
      setMessages(prev => [...prev, userMessage]);
      
      aiChatMutation.mutate(cleanQuestion);
    } else {
      // Send to regular chat
      sendMessage({
        type: 'chat',
        userId: 'current-user-id', // In a real app, get from auth context
        content: message
      });
    }
    
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-neon-cyan to-electric-green text-space p-4 rounded-full shadow-lg hover:scale-[1.05] transition-transform duration-200 animate-glow relative"
          data-testid="button-chat-expand"
        >
          <MessageCircle size={24} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-electric-green rounded-full animate-pulse"></div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-h-screen">
      <div className="bg-void border border-purple-deep rounded-lg shadow-2xl w-80 flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }} data-testid="chat-widget">
        <div className="bg-gradient-to-r from-neon-cyan to-electric-green p-4 rounded-t-lg flex justify-between items-center">
          <h3 className="font-bold text-space">Village Chat</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-space hover:text-gray-300 p-1"
            data-testid="button-chat-close"
          >
            <X size={16} />
          </Button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto bg-void" style={{ minHeight: '200px', maxHeight: 'calc(100vh - 12rem)' }} data-testid="chat-messages">
          <div className="space-y-3 text-sm">
            {messages.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                <div className="flex items-center justify-center mb-3">
                  <Bot className="text-electric-green mr-2" size={20} />
                  <span className="text-electric-green font-semibold">Village AI Available</span>
                </div>
                <p>Welcome to Village Chat!</p>
                <p className="text-xs mt-2 text-neon-cyan">
                  Ask questions about Village-One or chat with the community
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex space-x-2" data-testid={`chat-message-${msg.id}`}>
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.userId === 'village-ai' ? 'bg-gradient-to-br from-electric-green to-neon-cyan' : 'bg-electric-green'
                  }`}>
                    {msg.userId === 'village-ai' ? <Bot size={12} className="text-space" /> : 
                     (msg.user?.username?.charAt(0)?.toUpperCase() || 'U')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold text-xs ${
                        msg.userId === 'village-ai' ? 'text-electric-green' : 'text-electric-green'
                      }`} data-testid={`chat-username-${msg.id}`}>
                        {msg.user?.username || 'Anonymous'}
                      </span>
                      {msg.user?.archetype && (
                        <span className={`text-xs ${
                          msg.userId === 'village-ai' ? 'text-holo-gold' : 'text-neon-cyan'
                        }`} data-testid={`chat-archetype-${msg.id}`}>
                          {msg.user.archetype}
                        </span>
                      )}
                    </div>
                    <div className={`text-gray-300 mt-1 ${
                      msg.userId === 'village-ai' ? 'bg-purple-deep/30 p-2 rounded text-xs border-l-2 border-electric-green' : ''
                    }`} data-testid={`chat-content-${msg.id}`}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="p-4 border-t border-purple-deep">
          <div className="text-xs text-gray-400 mb-2">
            💡 Tip: Ask questions about Village-One, or type @ai for direct AI assistance
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Ask about Village-One or chat..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-space border-purple-deep text-white placeholder-gray-400 focus:border-neon-cyan"
              data-testid="input-chat-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || aiChatMutation.isPending}
              className="bg-gradient-to-r from-neon-cyan to-electric-green text-space px-4 py-2 rounded hover:scale-[1.02] transition-transform duration-200"
              data-testid="button-send-message"
            >
              {aiChatMutation.isPending ? <div className="animate-spin w-4 h-4 border border-space rounded-full border-t-transparent" /> : <Send size={16} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

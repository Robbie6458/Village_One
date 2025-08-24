interface PostContentProps {
  content: string;
  className?: string;
}

export default function PostContent({ content, className = "" }: PostContentProps) {
  const renderContent = (text: string) => {
    // Split content by markdown elements and render appropriately
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-2xl font-cyber font-bold text-electric-green mb-4 mt-6">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-xl font-cyber font-bold text-neon-cyan mb-3 mt-4">
            {line.substring(3)}
          </h2>
        );
      } else if (line === '---') {
        elements.push(
          <hr key={i} className="border-purple-deep my-6" />
        );
      } else if (line.trim() === '') {
        elements.push(<br key={i} />);
      } else {
        // Process inline markdown
        let processedLine = line;
        
        // Bold text
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-holo-gold">$1</strong>');
        
        // Italic text
        processedLine = processedLine.replace(/_(.*?)_/g, '<em class="italic text-electric-green">$1</em>');
        
        // Images
        processedLine = processedLine.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, 
          '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 border border-purple-deep" />'
        );
        
        // Links
        processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-neon-cyan hover:text-electric-green underline transition-colors">$1</a>'
        );
        
        elements.push(
          <p 
            key={i} 
            className="mb-3 leading-relaxed text-gray-300"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      }
    }
    
    return elements;
  };

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      {renderContent(content)}
    </div>
  );
}
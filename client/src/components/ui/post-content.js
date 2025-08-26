import { jsx as _jsx } from "react/jsx-runtime";
export default function PostContent({ content, className = "" }) {
    const renderContent = (text) => {
        // Split content by markdown elements and render appropriately
        const lines = text.split('\n');
        const elements = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('# ')) {
                elements.push(_jsx("h1", { className: "text-2xl font-cyber font-bold text-electric-green mb-4 mt-6", children: line.substring(2) }, i));
            }
            else if (line.startsWith('## ')) {
                elements.push(_jsx("h2", { className: "text-xl font-cyber font-bold text-neon-cyan mb-3 mt-4", children: line.substring(3) }, i));
            }
            else if (line === '---') {
                elements.push(_jsx("hr", { className: "border-purple-deep my-6" }, i));
            }
            else if (line.trim() === '') {
                elements.push(_jsx("br", {}, i));
            }
            else {
                // Process inline markdown
                let processedLine = line;
                // Bold text
                processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-holo-gold">$1</strong>');
                // Italic text
                processedLine = processedLine.replace(/_(.*?)_/g, '<em class="italic text-electric-green">$1</em>');
                // Images
                processedLine = processedLine.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 border border-purple-deep" />');
                // Links
                processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-neon-cyan hover:text-electric-green underline transition-colors">$1</a>');
                elements.push(_jsx("p", { className: "mb-3 leading-relaxed text-gray-300", dangerouslySetInnerHTML: { __html: processedLine } }, i));
            }
        }
        return elements;
    };
    return (_jsx("div", { className: `prose prose-invert max-w-none ${className}`, children: renderContent(content) }));
}

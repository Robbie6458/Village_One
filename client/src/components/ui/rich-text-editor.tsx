import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Image, Minus, Heading1, Heading2, Link as LinkIcon } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 });

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleSelection = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelection({
      start: e.target.selectionStart,
      end: e.target.selectionEnd
    });
  };

  const insertText = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const formatText = (type: string) => {
    switch (type) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('_', '_');
        break;
      case 'h1':
        insertText('\n# ', '\n');
        break;
      case 'h2':
        insertText('\n## ', '\n');
        break;
      case 'divider':
        insertText('\n---\n');
        break;
      case 'image':
        insertText('![Image description](image-url)');
        break;
      case 'link':
        insertText('[Link text](url)');
        break;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 p-2 bg-space border border-purple-deep rounded-lg">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          className="text-gray-400 hover:text-white hover:bg-purple-deep"
          data-testid="button-bold"
        >
          <Bold size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          className="text-gray-400 hover:text-white hover:bg-purple-deep"
          data-testid="button-italic"
        >
          <Italic size={16} />
        </Button>
        <div className="h-6 w-px bg-purple-deep" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('h1')}
          className="text-gray-400 hover:text-white hover:bg-purple-deep"
          data-testid="button-h1"
        >
          <Heading1 size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('h2')}
          className="text-gray-400 hover:text-white hover:bg-purple-deep"
          data-testid="button-h2"
        >
          <Heading2 size={16} />
        </Button>
        <div className="h-6 w-px bg-purple-deep" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('image')}
          className="text-gray-400 hover:text-white hover:bg-purple-deep"
          data-testid="button-image"
        >
          <Image size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('link')}
          className="text-gray-400 hover:text-white hover:bg-purple-deep"
          data-testid="button-link"
        >
          <LinkIcon size={16} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText('divider')}
          className="text-gray-400 hover:text-white hover:bg-purple-deep"
          data-testid="button-divider"
        >
          <Minus size={16} />
        </Button>
      </div>
      
      <Textarea
        value={value}
        onChange={handleTextareaChange}
        onSelect={handleSelection}
        placeholder={placeholder || "Write your post content here..."}
        className="min-h-[200px] bg-void border-purple-deep text-white placeholder:text-gray-500 focus:border-electric-green resize-none"
        data-testid="textarea-content"
      />
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Use **bold** and _italic_ for emphasis</p>
        <p>• Add # Heading 1 or ## Heading 2 for structure</p>
        <p>• Insert horizontal dividers with ---</p>
        <p>• Add images with ![description](url) and links with [text](url)</p>
      </div>
    </div>
  );
}
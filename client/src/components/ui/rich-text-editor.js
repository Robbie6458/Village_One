import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Image, Minus, Heading1, Heading2, Link as LinkIcon } from "lucide-react";
export default function RichTextEditor({ value, onChange, placeholder }) {
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const handleTextareaChange = (e) => {
        onChange(e.target.value);
    };
    const handleSelection = (e) => {
        setSelection({
            start: e.target.selectionStart,
            end: e.target.selectionEnd
        });
    };
    const insertText = (before, after = "") => {
        const textarea = document.querySelector('textarea');
        if (!textarea)
            return;
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
    const formatText = (type) => {
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
    return (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center space-x-2 p-2 bg-space border border-purple-deep rounded-lg", children: [_jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => formatText('bold'), className: "text-gray-400 hover:text-white hover:bg-purple-deep", "data-testid": "button-bold", children: _jsx(Bold, { size: 16 }) }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => formatText('italic'), className: "text-gray-400 hover:text-white hover:bg-purple-deep", "data-testid": "button-italic", children: _jsx(Italic, { size: 16 }) }), _jsx("div", { className: "h-6 w-px bg-purple-deep" }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => formatText('h1'), className: "text-gray-400 hover:text-white hover:bg-purple-deep", "data-testid": "button-h1", children: _jsx(Heading1, { size: 16 }) }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => formatText('h2'), className: "text-gray-400 hover:text-white hover:bg-purple-deep", "data-testid": "button-h2", children: _jsx(Heading2, { size: 16 }) }), _jsx("div", { className: "h-6 w-px bg-purple-deep" }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => formatText('image'), className: "text-gray-400 hover:text-white hover:bg-purple-deep", "data-testid": "button-image", children: _jsx(Image, { size: 16 }) }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => formatText('link'), className: "text-gray-400 hover:text-white hover:bg-purple-deep", "data-testid": "button-link", children: _jsx(LinkIcon, { size: 16 }) }), _jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => formatText('divider'), className: "text-gray-400 hover:text-white hover:bg-purple-deep", "data-testid": "button-divider", children: _jsx(Minus, { size: 16 }) })] }), _jsx(Textarea, { value: value, onChange: handleTextareaChange, onSelect: handleSelection, placeholder: placeholder || "Write your post content here...", className: "min-h-[200px] bg-void border-purple-deep text-white placeholder:text-gray-500 focus:border-electric-green resize-none", "data-testid": "textarea-content" }), _jsxs("div", { className: "text-xs text-gray-500 space-y-1", children: [_jsx("p", { children: "\u2022 Use **bold** and _italic_ for emphasis" }), _jsx("p", { children: "\u2022 Add # Heading 1 or ## Heading 2 for structure" }), _jsx("p", { children: "\u2022 Insert horizontal dividers with ---" }), _jsx("p", { children: "\u2022 Add images with ![description](url) and links with [text](url)" })] })] }));
}

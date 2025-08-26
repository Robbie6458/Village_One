import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useLocation } from "wouter";
// import { PostForm } from "@/components/forms/post-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function PostCreate() {
    const params = useParams();
    const [, setLocation] = useLocation();
    const userId = params.id;
    return (_jsx("div", { className: "container mx-auto p-6 max-w-4xl", children: _jsxs("div", { className: "mb-6", children: [_jsxs(Button, { variant: "ghost", onClick: () => setLocation(`/profile/${userId}`), className: "text-neon-cyan hover:text-electric-green mb-4", "data-testid": "button-back-to-profile", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), "Back to Profile"] }), _jsxs(Card, { className: "bg-void border-purple-deep", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-2xl text-holo-gold", children: "Create New Post" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "text-center p-8", children: [_jsx("p", { className: "text-gray-400", children: "Post creation form will be implemented here." }), _jsx(Button, { onClick: () => setLocation(`/profile/${userId}`), className: "mt-4", children: "Return to Profile" })] }) })] })] }) }));
}

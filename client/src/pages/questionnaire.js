import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useArchetype } from "@/hooks/use-archetype";
import { ArrowLeft, ArrowRight, CheckCircle, Brain } from "lucide-react";
const QUESTIONS = [
    {
        id: "motivation",
        question: "What drives you most when thinking about Village-One?",
        options: [
            { value: "building", label: "Creating something tangible with my hands" },
            { value: "growing", label: "Nurturing sustainable food systems" },
            { value: "connecting", label: "Building relationships and community" },
            { value: "designing", label: "Envisioning and creating beautiful spaces" },
            { value: "engineering", label: "Solving complex technical challenges" },
            { value: "funding", label: "Enabling others through strategic investment" },
            { value: "organizing", label: "Coordinating people and resources effectively" }
        ]
    },
    {
        id: "skills",
        question: "Which skills do you naturally excel at?",
        options: [
            { value: "craftsmanship", label: "Working with tools and materials" },
            { value: "agriculture", label: "Plants, soil, and growing systems" },
            { value: "communication", label: "Facilitating discussions and connections" },
            { value: "creativity", label: "Visual design and aesthetic vision" },
            { value: "technology", label: "Systems architecture and infrastructure" },
            { value: "finance", label: "Financial analysis and investment strategy" },
            { value: "logistics", label: "Project management and coordination" }
        ]
    },
    {
        id: "environment",
        question: "Where do you feel most energized and productive?",
        options: [
            { value: "workshop", label: "In a workshop or construction site" },
            { value: "garden", label: "In gardens, farms, or natural settings" },
            { value: "social", label: "In meetings, events, or social gatherings" },
            { value: "studio", label: "In a design studio or creative space" },
            { value: "lab", label: "In a lab, server room, or technical environment" },
            { value: "office", label: "In boardrooms or financial districts" },
            { value: "field", label: "On-site coordinating multiple moving parts" }
        ]
    },
    {
        id: "contribution",
        question: "How do you prefer to contribute to long-term projects?",
        options: [
            { value: "hands-on", label: "Direct physical work and construction" },
            { value: "cultivation", label: "Long-term stewardship and cultivation" },
            { value: "facilitation", label: "Bringing people together and mediating" },
            { value: "vision", label: "Creating compelling visions and designs" },
            { value: "infrastructure", label: "Building robust systems and frameworks" },
            { value: "investment", label: "Providing capital and strategic guidance" },
            { value: "coordination", label: "Managing timelines and deliverables" }
        ]
    },
    {
        id: "problem_solving",
        question: "When facing a complex challenge, your first instinct is to:",
        options: [
            { value: "prototype", label: "Build a prototype or test solution" },
            { value: "research", label: "Study natural patterns and cycles" },
            { value: "collaborate", label: "Gather diverse perspectives and input" },
            { value: "visualize", label: "Sketch out ideas and possibilities" },
            { value: "analyze", label: "Break down into technical components" },
            { value: "strategize", label: "Assess risks, costs, and opportunities" },
            { value: "plan", label: "Create detailed action plans and timelines" }
        ]
    },
    {
        id: "legacy",
        question: "What kind of legacy do you want to leave through Village-One?",
        options: [
            { value: "structures", label: "Beautiful, durable structures that last generations" },
            { value: "abundance", label: "Regenerative systems that feed the community" },
            { value: "connections", label: "Strong relationships and social cohesion" },
            { value: "inspiration", label: "Spaces and designs that inspire others" },
            { value: "innovation", label: "Technological solutions that can be replicated" },
            { value: "sustainability", label: "A financially sustainable community model" },
            { value: "efficiency", label: "Well-organized systems that work seamlessly" }
        ]
    }
];
export default function Questionnaire() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState({});
    const [isComplete, setIsComplete] = useState(false);
    const [, setLocation] = useLocation();
    const { determineArchetype } = useArchetype();
    const archetypeMutation = useMutation({
        mutationFn: (responses) => apiRequest('/api/archetype', 'POST', { responses }),
        onSuccess: (data) => {
            setIsComplete(true);
            // Update the user's profile with their determined archetype
            queryClient.invalidateQueries({ queryKey: ['/api/users'] });
            console.log('Determined archetype:', data.archetype);
        },
    });
    const handleAnswer = (value) => {
        setResponses(prev => ({
            ...prev,
            [QUESTIONS[currentQuestion].id]: value
        }));
    };
    const handleNext = () => {
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
        else {
            // Submit responses
            archetypeMutation.mutate(responses);
        }
    };
    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };
    const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
    const currentAnswer = responses[QUESTIONS[currentQuestion]?.id];
    if (isComplete) {
        return (_jsx("div", { className: "min-h-screen p-8 bg-gradient-to-b from-space to-void texture-organic flex items-center justify-center", children: _jsxs(Card, { className: "card-legendary bg-gradient-to-br from-void to-purple-deep border-holo-gold max-w-2xl w-full", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-electric-green to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(CheckCircle, { className: "text-space", size: 32 }) }), _jsx(CardTitle, { className: "text-3xl font-cyber text-holo-gold mb-2", children: "Welcome to Village-One!" })] }), _jsxs(CardContent, { className: "text-center space-y-6", children: [_jsx("p", { className: "text-lg text-gray-300", children: "Your archetype assessment is complete. You've been identified as a:" }), _jsxs("div", { className: "p-6 rounded-lg bg-gradient-to-r from-electric-green/20 to-neon-cyan/20 border border-electric-green", children: [_jsx("h3", { className: "text-2xl font-bold text-electric-green mb-2", "data-testid": "text-determined-archetype", children: archetypeMutation.data?.archetype || 'Builder' }), _jsx("p", { className: "text-gray-300", children: "This archetype represents your natural strengths and preferred ways of contributing to the village community." })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(Button, { onClick: () => setLocation('/people'), className: "w-full bg-gradient-to-r from-neon-cyan to-electric-green text-space font-bold py-3 rounded-lg", "data-testid": "button-explore-community", children: "Explore the Community" }), _jsx(Button, { onClick: () => setLocation('/crowdfunding'), variant: "outline", className: "w-full border-holo-gold text-holo-gold hover:bg-holo-gold hover:text-space", "data-testid": "button-contribute", children: "Start Contributing" })] })] })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen p-8 bg-gradient-to-b from-space to-void texture-organic", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl font-cyber font-bold text-neon-cyan mb-4", "data-testid": "text-questionnaire-title", children: "Discover Your Village Archetype" }), _jsx("p", { className: "text-xl text-gray-400", children: "Answer these questions to find your ideal role in Village-One" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-400 mb-2", children: [_jsxs("span", { children: ["Question ", currentQuestion + 1, " of ", QUESTIONS.length] }), _jsxs("span", { children: [Math.round(progress), "% Complete"] })] }), _jsx(Progress, { value: progress, className: "h-2 bg-space" })] }), _jsxs(Card, { className: "card-epic bg-gradient-to-br from-void to-purple-deep border-electric-green mb-8", children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-electric-green to-neon-cyan rounded-lg flex items-center justify-center", children: _jsx(Brain, { className: "text-space", size: 20 }) }), _jsx(CardTitle, { className: "text-2xl font-cyber text-electric-green", children: "Archetype Assessment" })] }), _jsx("h2", { className: "text-xl text-white leading-relaxed", "data-testid": `text-question-${currentQuestion}`, children: QUESTIONS[currentQuestion]?.question })] }), _jsx(CardContent, { className: "space-y-4", children: _jsx(RadioGroup, { value: currentAnswer || "", onValueChange: handleAnswer, className: "space-y-3", children: QUESTIONS[currentQuestion]?.options.map((option, index) => (_jsxs("div", { className: "flex items-center space-x-3 p-4 rounded-lg border border-purple-deep hover:border-neon-cyan transition-colors cursor-pointer", children: [_jsx(RadioGroupItem, { value: option.value, id: option.value, className: "text-neon-cyan", "data-testid": `radio-option-${index}` }), _jsx(Label, { htmlFor: option.value, className: "text-gray-300 cursor-pointer flex-1", "data-testid": `label-option-${index}`, children: option.label })] }, option.value))) }) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsxs(Button, { onClick: handlePrevious, disabled: currentQuestion === 0, variant: "outline", className: "border-purple-deep text-gray-300 disabled:opacity-50", "data-testid": "button-previous", children: [_jsx(ArrowLeft, { size: 16, className: "mr-2" }), "Previous"] }), _jsxs(Button, { onClick: handleNext, disabled: !currentAnswer || archetypeMutation.isPending, className: "bg-gradient-to-r from-neon-cyan to-electric-green text-space font-semibold", "data-testid": "button-next", children: [currentQuestion === QUESTIONS.length - 1
                                    ? (archetypeMutation.isPending ? 'Analyzing...' : 'Complete Assessment')
                                    : 'Next', currentQuestion < QUESTIONS.length - 1 && (_jsx(ArrowRight, { size: 16, className: "ml-2" }))] })] })] }) }));
}

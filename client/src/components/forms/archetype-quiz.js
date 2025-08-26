import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: "What type of work energizes you most?",
        options: [
            { id: "a", text: "Building and creating physical structures", archetype: "Builder" },
            { id: "b", text: "Growing and nurturing plants and ecosystems", archetype: "Horticulturist" },
            { id: "c", text: "Designing and planning technical systems", archetype: "Village Engineer" },
            { id: "d", text: "Creating visual designs and artistic works", archetype: "Designer" },
            { id: "e", text: "Managing finances and investment opportunities", archetype: "Funder" },
            { id: "f", text: "Sharing stories and knowledge with others", archetype: "Storyteller" }
        ]
    },
    {
        id: 2,
        question: "In a community project, you naturally take on the role of:",
        options: [
            { id: "a", text: "The hands-on implementer who makes things happen", archetype: "Builder" },
            { id: "b", text: "The sustainability advisor ensuring environmental health", archetype: "Horticulturist" },
            { id: "c", text: "The technical coordinator managing infrastructure", archetype: "Village Engineer" },
            { id: "d", text: "The creative visionary shaping the aesthetic", archetype: "Designer" },
            { id: "e", text: "The resource planner ensuring financial viability", archetype: "Funder" },
            { id: "f", text: "The communicator keeping everyone informed", archetype: "Storyteller" }
        ]
    },
    {
        id: 3,
        question: "Your ideal workspace would be:",
        options: [
            { id: "a", text: "A workshop with tools and materials", archetype: "Builder" },
            { id: "b", text: "A greenhouse or garden area", archetype: "Horticulturist" },
            { id: "c", text: "A tech lab with computers and equipment", archetype: "Village Engineer" },
            { id: "d", text: "A studio with art supplies and inspiration", archetype: "Designer" },
            { id: "e", text: "An office with financial tools and market data", archetype: "Funder" },
            { id: "f", text: "A library or media center for research and writing", archetype: "Storyteller" }
        ]
    },
    {
        id: 4,
        question: "When solving problems, you prefer to:",
        options: [
            { id: "a", text: "Get your hands dirty and learn by doing", archetype: "Builder" },
            { id: "b", text: "Consider long-term environmental impacts", archetype: "Horticulturist" },
            { id: "c", text: "Analyze systems and optimize for efficiency", archetype: "Village Engineer" },
            { id: "d", text: "Visualize creative solutions and possibilities", archetype: "Designer" },
            { id: "e", text: "Calculate costs, benefits, and ROI", archetype: "Funder" },
            { id: "f", text: "Research thoroughly and share findings", archetype: "Storyteller" }
        ]
    },
    {
        id: 5,
        question: "Your main motivation for joining a village community is:",
        options: [
            { id: "a", text: "Building something tangible and lasting", archetype: "Builder" },
            { id: "b", text: "Living in harmony with nature", archetype: "Horticulturist" },
            { id: "c", text: "Creating efficient, sustainable systems", archetype: "Village Engineer" },
            { id: "d", text: "Contributing to a beautiful, inspiring environment", archetype: "Designer" },
            { id: "e", text: "Ensuring financial sustainability and growth", archetype: "Funder" },
            { id: "f", text: "Preserving and sharing community knowledge", archetype: "Storyteller" }
        ]
    }
];
export function ArchetypeQuiz({ onClose }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState({});
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const saveAssessmentMutation = useMutation({
        mutationFn: (data) => apiRequest('/api/users/me/archetype', 'POST', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/users'] });
            queryClient.invalidateQueries({ queryKey: ['/api/users', 'me', 'archetype-assessment'] });
            toast({
                title: "Assessment Complete",
                description: "Your archetype assessment has been saved successfully.",
            });
            onClose();
        },
        onError: (error) => {
            console.error("Assessment save error:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to save assessment",
                variant: "destructive",
            });
        },
    });
    const handleAnswerSelect = (questionId, optionId) => {
        setAnswers({ ...answers, [questionId]: optionId });
    };
    const handleNext = () => {
        if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
        else {
            calculateResults();
        }
    };
    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };
    const calculateResults = () => {
        const scores = {};
        // Initialize scores
        const archetypes = ["Builder", "Horticulturist", "Village Engineer", "Designer", "Funder", "Storyteller"];
        archetypes.forEach(archetype => {
            scores[archetype] = 0;
        });
        // Calculate scores based on answers
        QUIZ_QUESTIONS.forEach(question => {
            const answerId = answers[question.id];
            if (answerId) {
                const selectedOption = question.options.find(opt => opt.id === answerId);
                if (selectedOption) {
                    scores[selectedOption.archetype] += 1;
                }
            }
        });
        setResults(scores);
        setShowResults(true);
    };
    const getPrimaryArchetype = () => {
        return Object.entries(results).reduce((a, b) => results[a[0]] > results[b[0]] ? a : b)[0];
    };
    const handleSaveResults = () => {
        const primaryArchetype = getPrimaryArchetype();
        const assessmentData = {
            primaryArchetype,
            scores: results,
            answers: answers,
            description: `Primary archetype determined through interactive assessment on ${new Date().toLocaleDateString()}`
        };
        saveAssessmentMutation.mutate(assessmentData);
    };
    const currentQ = QUIZ_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
    if (showResults) {
        const primaryArchetype = getPrimaryArchetype();
        const sortedResults = Object.entries(results).sort(([, a], [, b]) => b - a);
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-holo-gold mb-2", children: "Your Village Archetype" }), _jsx("div", { className: "text-4xl font-bold text-electric-green mb-4", children: primaryArchetype }), _jsx("p", { className: "text-gray-300", children: "Based on your responses, this archetype best matches your skills and interests for village life." })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Detailed Results" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: sortedResults.map(([archetype, score]) => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-white", children: archetype }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-32 bg-space-800 rounded-full h-2", children: _jsx("div", { className: "bg-electric-green h-2 rounded-full", style: { width: `${(score / QUIZ_QUESTIONS.length) * 100}%` } }) }), _jsxs("span", { className: "text-neon-cyan w-12 text-right", children: [score, "/", QUIZ_QUESTIONS.length] })] })] }, archetype))) }) })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { variant: "outline", onClick: onClose, "data-testid": "button-discard-results", children: "Take Again" }), _jsx(Button, { onClick: handleSaveResults, disabled: saveAssessmentMutation.isPending, "data-testid": "button-save-results", children: saveAssessmentMutation.isPending ? "Saving..." : "Save Results" })] })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-xl font-semibold text-holo-gold", children: "Village Archetype Assessment" }), _jsxs("span", { className: "text-sm text-gray-400", children: ["Question ", currentQuestion + 1, " of ", QUIZ_QUESTIONS.length] })] }), _jsx(Progress, { value: progress, className: "w-full" })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: currentQ.question }) }), _jsx(CardContent, { children: _jsx(RadioGroup, { value: answers[currentQ.id] || "", onValueChange: (value) => handleAnswerSelect(currentQ.id, value), className: "space-y-3", children: currentQ.options.map((option) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(RadioGroupItem, { value: option.id, id: `option-${option.id}`, "data-testid": `radio-option-${option.id}` }), _jsx(Label, { htmlFor: `option-${option.id}`, className: "text-sm leading-relaxed cursor-pointer", children: option.text })] }, option.id))) }) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx(Button, { variant: "outline", onClick: handlePrevious, disabled: currentQuestion === 0, "data-testid": "button-previous", children: "Previous" }), _jsxs("div", { className: "space-x-2", children: [_jsx(Button, { variant: "outline", onClick: onClose, "data-testid": "button-cancel-quiz", children: "Cancel" }), _jsx(Button, { onClick: handleNext, disabled: !answers[currentQ.id], "data-testid": "button-next", children: currentQuestion === QUIZ_QUESTIONS.length - 1 ? "Finish" : "Next" })] })] })] }));
}

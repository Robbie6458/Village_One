import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/lib/error-boundary";
import Navigation from "@/components/layout/navigation";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Forum from "@/pages/forum";
import PostPage from "@/pages/post";
import People from "@/pages/people";
import Questionnaire from "@/pages/questionnaire";
import Crowdfunding from "@/pages/crowdfunding";
import Profile from "@/pages/profile-working";
import ProfileEdit from "@/pages/profile-edit";
import Login from "@/pages/login";
import Operations from "@/pages/operations";
import Ownership from "@/pages/ownership";
import NotFound from "@/pages/not-found";
// 👇 import the test component
import AuthTest from "@/components/AuthTest";
function Router() {
    return (_jsxs(Switch, { children: [_jsx(Route, { path: "/", component: Home }), _jsx(Route, { path: "/dashboard", component: Dashboard }), _jsx(Route, { path: "/forum/:section", component: Forum }), _jsx(Route, { path: "/post/:id", component: PostPage }), _jsx(Route, { path: "/people", component: People }), _jsx(Route, { path: "/questionnaire", component: Questionnaire }), _jsx(Route, { path: "/crowdfunding", component: Crowdfunding }), _jsx(Route, { path: "/forum/operations", component: Operations }), _jsx(Route, { path: "/forum/ownership", component: Ownership }), _jsx(Route, { path: "/profile/:id", component: Profile }), _jsx(Route, { path: "/profile/:id/edit", component: ProfileEdit }), _jsx(Route, { path: "/login", component: Login }), _jsx(Route, { path: "/auth-test", component: AuthTest }), _jsx(Route, { component: NotFound })] }));
}
function App() {
    return (_jsx(ErrorBoundary, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsxs(TooltipProvider, { children: [_jsxs("div", { className: "min-h-screen bg-space text-white", children: [_jsx(Navigation, {}), _jsx("main", { className: "ml-64", children: _jsx(ErrorBoundary, { children: _jsx(Router, {}) }) })] }), _jsx(Toaster, {})] }) }) }) }));
}
export default App;

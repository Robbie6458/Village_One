import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/lib/error-boundary";
import Navigation from "@/components/layout/navigation";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";

// Lazy load components for better code splitting
const Home = lazy(() => import("@/pages/home"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Forum = lazy(() => import("@/pages/forum"));
const PostPage = lazy(() => import("@/pages/post"));
const People = lazy(() => import("@/pages/people"));
const Questionnaire = lazy(() => import("@/pages/questionnaire"));
const Crowdfunding = lazy(() => import("@/pages/crowdfunding"));
const Profile = lazy(() => import("@/pages/profile-working"));
const ProfileEdit = lazy(() => import("@/pages/profile-edit"));
const Login = lazy(() => import("@/pages/login"));
const Operations = lazy(() => import("@/pages/operations"));
const Ownership = lazy(() => import("@/pages/ownership"));
const NotFound = lazy(() => import("@/pages/not-found"));

// 👇 import the test component (keep as regular import since it's small)
import AuthTest from "@/components/AuthTest";

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-space">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-green"></div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/forum/:section" component={Forum} />
        <Route path="/post/:id" component={PostPage} />
        <Route path="/people" component={People} />

        <Route path="/questionnaire" component={Questionnaire} />
        <Route path="/crowdfunding" component={Crowdfunding} />
        <Route path="/forum/operations" component={Operations} />
        <Route path="/forum/ownership" component={Ownership} />
        <Route path="/profile/:id" component={Profile} />
        <Route path="/profile/:id/edit" component={ProfileEdit} />
        <Route path="/login" component={Login} />

        {/* 👇 add a temporary route for testing Supabase */}
        <Route path="/auth-test" component={AuthTest} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-space text-white">
              <Navigation />
              <main className="ml-64">
                <ErrorBoundary>
                  <Router />
                </ErrorBoundary>
              </main>
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

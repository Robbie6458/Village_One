import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/lib/error-boundary";
import Navigation from "@/components/layout/navigation";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Forum from "@/pages/forum";
import PostPage from "@/pages/post";
import People from "@/pages/people";
import Questionnaire from "@/pages/questionnaire";
import Crowdfunding from "@/pages/crowdfunding";
import Profile from "@/pages/profile-working";
import ProfileEdit from "@/pages/profile-edit";


import Operations from "@/pages/operations";
import Ownership from "@/pages/ownership";
import NotFound from "@/pages/not-found";

function Router() {
  return (
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

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

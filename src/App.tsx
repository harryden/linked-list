import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const EventPage = lazy(() => import("./pages/EventPage"));
const EventSuccess = lazy(() => import("./pages/EventSuccess"));
const Demo = lazy(() => import("./pages/Demo"));
const JoinEvent = lazy(() => import("./pages/JoinEvent"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Lightweight fallback components
const PageSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const MinimalFallback = () => (
  <div className="p-4 text-sm text-muted-foreground">Loading...</div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<MinimalFallback />}>
                <Landing />
              </Suspense>
            }
          />
          <Route
            path="/auth"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Auth />
              </Suspense>
            }
          />
          <Route
            path="/auth/callback"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <AuthCallback />
              </Suspense>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/create-event"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <CreateEvent />
              </Suspense>
            }
          />
          <Route
            path="/join-event"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <JoinEvent />
              </Suspense>
            }
          />
          <Route
            path="/event/:slug"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <EventPage />
              </Suspense>
            }
          />
          <Route
            path="/event-success/:slug"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <EventSuccess />
              </Suspense>
            }
          />
          <Route
            path="/demo"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Demo />
              </Suspense>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route
            path="*"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

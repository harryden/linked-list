import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { logger } from "@/lib/logger";

const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const EventPage = lazy(() => import("./pages/EventPage"));
const EventSuccess = lazy(() => import("./pages/EventSuccess"));
const JoinEvent = lazy(() => import("./pages/JoinEvent"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      logger.error(error, {
        category: "QueryCache",
        extra: { queryKey: query.queryKey },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      logger.error(error, {
        category: "MutationCache",
        extra: { mutationKey: mutation.options.mutationKey },
      });
    },
  }),
});

const PageSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-0.5 bg-border-subtle rounded-full overflow-hidden mx-auto mb-4 relative">
        <div className="absolute inset-0 bg-text-primary animate-loader-slide" />
      </div>
      <p className="text-[13px] text-text-secondary">Loading...</p>
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
      <BrowserRouter>
        <ErrorBoundary>
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
          <FeedbackDialog />
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

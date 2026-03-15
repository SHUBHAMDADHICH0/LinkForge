import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AnalyticsPage from "./pages/Analytics";
import Login from "./pages/Login";
import ProfileSettings from "./pages/ProfileSettings";
import ApiDocs from "./pages/ApiDocs";
import CustomDomains from "./pages/CustomDomains";
import RedirectPage from "./pages/RedirectPage";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/analytics/:shortCode" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
    <Route path="/settings/domains" element={<ProtectedRoute><CustomDomains /></ProtectedRoute>} />
    <Route path="/docs" element={<ApiDocs />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/r/:shortCode" element={<RedirectPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

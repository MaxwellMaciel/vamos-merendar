
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import NutricionistaLogin from "./pages/nutricionista/Login";
import ProfessorLogin from "./pages/professor/Login";
import Register from "./pages/Register";
import DietaryRestrictions from "./pages/DietaryRestrictions";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AlunoDashboard from "./pages/aluno/Dashboard";
import ProfessorDashboard from "./pages/professor/Dashboard";
import NutricionistaDashboard from "./pages/nutricionista/Dashboard";
import NutricionistaWeeklyMenu from "./pages/nutricionista/WeeklyMenu";
import NutricionistaFeedback from "./pages/nutricionista/Feedback";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/settings/ChangePassword";
import PersonalInfo from "./pages/settings/PersonalInfo";
import DietaryRestrictionsSettings from "./pages/settings/DietaryRestrictionsSettings";
import About from "./pages/About";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import { NotificationProvider } from "./contexts/NotificationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/nutricionista/login" element={<NutricionistaLogin />} />
            <Route path="/professor/login" element={<ProfessorLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dietary-restrictions" element={<DietaryRestrictions />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Dashboard routes */}
            <Route path="/aluno/dashboard" element={<AlunoDashboard />} />
            <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
            <Route path="/nutricionista/dashboard" element={<NutricionistaDashboard />} />
            <Route path="/nutricionista/menu" element={<NutricionistaWeeklyMenu />} />
            <Route path="/nutricionista/feedback" element={<NutricionistaFeedback />} />
            
            {/* Settings routes */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/password" element={<ChangePassword />} />
            <Route path="/settings/personal" element={<PersonalInfo />} />
            <Route path="/settings/restrictions" element={<DietaryRestrictionsSettings />} />
            
            {/* Info routes */}
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/notifications" element={<Notifications />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

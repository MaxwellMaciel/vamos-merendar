
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
import RegistrationSuccess from "./pages/RegistrationSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AlunoDashboard from "./pages/aluno/Dashboard";
import ProfessorDashboard from "./pages/professor/Dashboard";
import NutricionistaDashboard from "./pages/nutricionista/Dashboard";
import NutricionistaWeeklyMenu from "./pages/nutricionista/WeeklyMenu";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/settings/ChangePassword";
import PersonalInfo from "./pages/settings/PersonalInfo";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Dashboard routes */}
          <Route path="/aluno/dashboard" element={<AlunoDashboard />} />
          <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
          <Route path="/nutricionista/dashboard" element={<NutricionistaDashboard />} />
          <Route path="/nutricionista/menu" element={<NutricionistaWeeklyMenu />} />
          
          {/* Settings routes */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/password" element={<ChangePassword />} />
          <Route path="/settings/personal" element={<PersonalInfo />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

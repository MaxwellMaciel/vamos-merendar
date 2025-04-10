import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import NutricionistaLogin from "./pages/nutricionista/Login";
import Register from "./pages/Register";
import DietaryRestrictionsRegistration from "./pages/DietaryRestrictions";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AlunoDashboard from "./pages/aluno/Dashboard";
import NutricionistaDashboard from "./pages/nutricionista/Dashboard";
import NutricionistaWeeklyMenu from "./pages/nutricionista/WeeklyMenu";
import NutricionistaFeedback from "./pages/nutricionista/Feedback";
import NutricionistaAttendanceLog from "./pages/nutricionista/AttendanceLog";
import Settings from "./pages/Settings";
import ChangePassword from "./pages/settings/ChangePassword";
import PersonalInfo from "./pages/settings/PersonalInfo";
import DietaryRestrictions from "./pages/settings/DietaryRestrictions";
import AddDietaryRestrictions from "./pages/settings/AddDietaryRestrictions";
import EditDietaryRestrictions from "./pages/settings/EditDietaryRestrictions";
import Theme from "./pages/settings/Theme";
import About from "./pages/About";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import { NotificationProvider } from "./contexts/NotificationContext";
import NutricionistaNotifications from './pages/nutricionista/Notifications';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
                {/* Auth routes */}
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/nutricionista/login" element={<NutricionistaLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dietary-restrictions" element={<DietaryRestrictionsRegistration />} />
                <Route path="/registration-success" element={<RegistrationSuccess />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Dashboard routes */}
                <Route path="/aluno/dashboard" element={<AlunoDashboard />} />
                <Route path="/aluno/notifications" element={<Notifications />} />
                <Route path="/nutricionista/dashboard" element={<NutricionistaDashboard />} />
                <Route path="/nutricionista/notifications" element={<NutricionistaNotifications />} />
                <Route path="/nutricionista/menu" element={<NutricionistaWeeklyMenu />} />
                <Route path="/nutricionista/feedback" element={<NutricionistaFeedback />} />
                <Route path="/nutricionista/attendance" element={<NutricionistaAttendanceLog />} />
                
                {/* Settings routes */}
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/password" element={<ChangePassword />} />
                <Route path="/settings/personal" element={<PersonalInfo />} />
                <Route path="/settings/theme" element={<Theme />} />
                <Route path="/settings/dietary-restrictions" element={<DietaryRestrictions />} />
                <Route path="/settings/dietary-restrictions/add" element={<AddDietaryRestrictions />} />
                <Route path="/settings/dietary-restrictions/edit" element={<EditDietaryRestrictions />} />
                
                {/* Info routes */}
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
                
                {/* Rota padrão */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;

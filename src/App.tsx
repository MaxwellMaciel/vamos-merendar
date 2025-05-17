import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import NutricionistaNotifications from './pages/nutricionista/Notifications';

const queryClient = new QueryClient();

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Routes>
                {/* Rotas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/help" element={<Help />} />

                {/* Rotas protegidas */}
                <Route
                  path="/aluno/dashboard"
                  element={
                    <ProtectedRoute>
                      <AlunoDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nutricionista/dashboard"
                  element={
                    <ProtectedRoute>
                      <NutricionistaDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nutricionista/menu"
                  element={
                    <ProtectedRoute>
                      <NutricionistaWeeklyMenu />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nutricionista/attendance"
                  element={
                    <ProtectedRoute>
                      <NutricionistaAttendanceLog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nutricionista/feedback"
                  element={
                    <ProtectedRoute>
                      <NutricionistaFeedback />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                {/* Auth routes */}
                <Route path="/nutricionista/login" element={<NutricionistaLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dietary-restrictions" element={<DietaryRestrictionsRegistration />} />
                <Route path="/registration-success" element={<RegistrationSuccess />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/aluno/notifications" element={<Notifications />} />
                <Route path="/nutricionista/notifications" element={<NutricionistaNotifications />} />
                
                {/* Settings routes */}
                <Route path="/settings/password" element={<ChangePassword />} />
                <Route path="/settings/personal" element={<PersonalInfo />} />
                <Route path="/settings/theme" element={<Theme />} />
                <Route path="/settings/dietary-restrictions" element={<DietaryRestrictions />} />
                <Route path="/settings/dietary-restrictions/add" element={<AddDietaryRestrictions />} />
                <Route path="/settings/dietary-restrictions/edit" element={<EditDietaryRestrictions />} />
                
                {/* Info routes */}
                <Route path="/about" element={<About />} />
                
                {/* Redirecionamento padrão */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </TooltipProvider>
          </QueryClientProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

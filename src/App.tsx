import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import UploadPage from '@/pages/UploadPage';
import ContactsPage from '@/pages/ContactsPage';
import BillingPage from '@/pages/BillingPage';
import HowToUsePage from '@/pages/HowToUsePage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import PricingPage from '@/pages/PricingPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import ReferralPage from '@/pages/ReferralPage';
import AppLayout from '@/components/AppLayout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25D366]"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/how-to-use" element={<HowToUsePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      <Route path="/app" element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="referrals" element={<ReferralPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;

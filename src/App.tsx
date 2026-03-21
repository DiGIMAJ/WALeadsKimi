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
import FreeToolPage from '@/pages/FreeToolPage';

// ... (rest of your App.tsx code)
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/free-tool" element={<FreeToolPage />} />
      <Route path="/auth" element={<AuthPage />} />
      {/* ... other routes ... */}
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
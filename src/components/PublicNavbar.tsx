import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Menu, X } from 'lucide-react';

interface PublicNavbarProps {
  showBackButton?: boolean;
}

export default function PublicNavbar({ showBackButton = false }: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (showBackButton) {
    return (
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WALeads</span>
            </Link>
            <Link to="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">WALeads</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/how-to-use" className="text-gray-600 hover:text-[#25D366] transition-colors">
              How It Works
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-[#25D366] transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-[#25D366] transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-[#25D366] transition-colors">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-gray-600 hover:text-[#25D366]">
                Log In
              </Button>
            </Link>
            <Link to="/auth?signup=true">
              <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="px-4 space-y-3">
            <Link to="/how-to-use" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              How It Works
            </Link>
            <Link to="/pricing" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <Link to="/about" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            <div className="pt-4 space-y-2">
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Log In</Button>
              </Link>
              <Link to="/auth?signup=true" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

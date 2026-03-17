import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

interface FooterProps {
  minimal?: boolean;
}

export default function Footer({ minimal = false }: FooterProps) {
  if (minimal) {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} WALeads. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">WALeads</span>
            </div>
            <p className="text-gray-400 text-sm">
              Extract WhatsApp contacts instantly. 100% browser-based and private.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/how-to-use" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/app" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="mailto:contact@waleads.name.ng" className="hover:text-white transition-colors">contact@waleads.name.ng</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} WALeads. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

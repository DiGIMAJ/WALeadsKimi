import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Download,
  Users,
  Shield,
  Zap,
  Globe,
  FileSpreadsheet,
  Smartphone,
  Check,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: '100% Private',
    description: 'All processing happens in your browser. Your WhatsApp chats never leave your device.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Instant Extraction',
    description: 'Extract hundreds of contacts in seconds with our optimized parsing engine.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Global Support',
    description: 'Automatically detects and formats phone numbers from any country worldwide.',
  },
  {
    icon: <FileSpreadsheet className="w-6 h-6" />,
    title: 'Multiple Formats',
    description: 'Export as CSV, VCF (for phone contacts), or Excel. Choose what works for you.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Smart Deduplication',
    description: 'Automatically removes duplicates within uploads and across your saved contacts.',
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: 'Mobile First',
    description: 'Designed for mobile use. Extract contacts on the go, right from your phone.',
  },
];

const faqs = [
  {
    question: 'Is my WhatsApp data secure?',
    answer: 'Absolutely! All processing happens client-side in your browser. Your chat files are never uploaded to our servers. We only store the extracted contact numbers in your account.',
  },
  {
    question: 'How do I export a WhatsApp chat?',
    answer: 'Open WhatsApp, go to the group or chat, tap the three dots menu, select "More" > "Export chat" > "Without media". Save the .zip file and upload it to WALeads.',
  },
  {
    question: 'What export formats are available?',
    answer: 'Free users can export as CSV. Pro users get additional VCF format (for importing to phone contacts) and Excel (.xlsx) format.',
  },
  {
    question: 'Do my exports expire?',
    answer: 'Monthly exports reset every 45 days. Top-up exports never expire and roll over indefinitely until used.',
  },
  {
    question: 'Can I cancel my Pro subscription anytime?',
    answer: 'Yes! You can cancel anytime. You\'ll continue to have Pro access until the end of your current billing period.',
  },
  {
    question: 'How does the top-up system work?',
    answer: 'When you run out of monthly exports, you can purchase top-up credits. These credits never expire and are used only after your monthly allowance is depleted.',
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E8F8EE] to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Extract WhatsApp Contacts{' '}
              <span className="text-[#25D366]">in Seconds</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Turn your WhatsApp group exports into organized contact lists. 
              100% browser-based, private, and instant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?signup=true">
                <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-8 py-6 text-lg">
                  Start Free
                </Button>
              </Link>
              <Link to="/how-to-use">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg border-gray-300">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Demo Card */}
            <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-[#E8F8EE] rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#25D366]" />
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded-full w-3/4 mb-2"></div>
                  <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                </div>
                <div className="text-[#25D366] font-semibold">+247 contacts</div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Upload WhatsApp Export</span>
                <span>Extract Numbers</span>
                <span>Download CSV</span>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-1 bg-[#25D366] rounded-full flex-1"></div>
                <div className="h-1 bg-[#25D366] rounded-full flex-1"></div>
                <div className="h-1 bg-gray-200 rounded-full flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#E8F8EE] rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-[#25D366]" />
              </div>
              <h3 className="font-semibold text-gray-900">100% Browser-Based</h3>
              <p className="text-sm text-gray-500">Your data never leaves your device</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#E8F8EE] rounded-full flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-[#25D366]" />
              </div>
              <h3 className="font-semibold text-gray-900">25 Free Exports</h3>
              <p className="text-sm text-gray-500">Get started with 25 free contacts</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#E8F8EE] rounded-full flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-6 h-6 text-[#25D366]" />
              </div>
              <h3 className="font-semibold text-gray-900">3 Export Formats</h3>
              <p className="text-sm text-gray-500">CSV, VCF, and Excel support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Extract contacts from WhatsApp in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Export from WhatsApp',
                description: 'Open any WhatsApp group or chat, tap the menu, and select "Export chat". Choose to export without media and save the .zip file.',
                icon: <Download className="w-6 h-6" />,
              },
              {
                step: '02',
                title: 'Upload to WALeads',
                description: 'Come to WALeads and upload your .zip file. Our system will instantly scan and extract all phone numbers from the chat.',
                icon: <Upload className="w-6 h-6" />,
              },
              {
                step: '03',
                title: 'Export and Use',
                description: 'Review the extracted contacts, remove any duplicates, and export in your preferred format. Start building your contact list!',
                icon: <FileSpreadsheet className="w-6 h-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-[#F0F2F5] rounded-2xl p-8 h-full">
                  <div className="text-5xl font-bold text-[#25D366]/20 mb-4">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center text-white mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-[#F0F2F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make contact extraction effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#E8F8EE] rounded-xl flex items-center justify-center text-[#25D366] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works for you. Start free, upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#F0F2F5] rounded-2xl p-8">
              <div className="text-sm font-medium text-gray-500 mb-2">Free Plan</div>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                ₦0<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for trying out WALeads</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  '25 exports per month',
                  'CSV export only',
                  'Single file upload',
                  'Last 5 extractions history',
                  'Auto deduplication',
                  'Country detection',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#25D366] mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/auth?signup=true">
                <Button variant="outline" className="w-full rounded-full">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#075E54] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#25D366] text-xs font-medium px-3 py-1 rounded-full">
                Popular
              </div>
              <div className="text-sm font-medium text-gray-300 mb-2">Pro Plan</div>
              <div className="text-4xl font-bold mb-4">
                ₦5,000<span className="text-lg font-normal text-gray-300">/month</span>
              </div>
              <p className="text-gray-300 mb-6">For power users and businesses</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  '7,500 exports per month',
                  'CSV, VCF & Excel exports',
                  'Multiple file uploads',
                  'Full extraction history',
                  'Tags & notes on contacts',
                  'Priority email support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-200">
                    <Check className="w-4 h-4 text-[#25D366] mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/auth?signup=true">
                <Button className="w-full rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>

          {/* Top-up Section */}
          <div className="mt-12 bg-[#E8F8EE] rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Need More Exports?
                </h3>
                <p className="text-gray-600">
                  Purchase top-up credits that never expire. Use them anytime you need extra exports.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#25D366]">₦250</div>
                  <div className="text-sm text-gray-600">for 200 credits</div>
                </div>
                <Link to="/auth?signup=true">
                  <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full">
                    Buy Credits
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#F0F2F5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Extract Your Contacts?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Join thousands of users who trust WALeads for their contact extraction needs.
            </p>
            <Link to="/auth?signup=true">
              <Button size="lg" className="bg-white text-[#25D366] hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                <li><Link to="/how-to-use" className="hover:text-white">How It Works</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/app" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:support@waleads.name.ng" className="hover:text-white">support@waleads.name.ng</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} WALeads. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

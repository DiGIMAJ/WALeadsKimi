import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PublicNavbar from '@/components/PublicNavbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
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
  Gift,
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
    answer: 'All users can export as CSV and VCF. Pro users get additional Excel (.xlsx) format, plus unlimited exports.',
  },
  {
    question: 'Do my credits expire?',
    answer: 'Free users get 50 one-time exports that never expire. Top-up credits also never expire. Pro users get unlimited exports.',
  },
  {
    question: 'Can I cancel my Pro subscription anytime?',
    answer: 'Yes! You can cancel anytime. You\'ll continue to have Pro access until the end of your current billing period.',
  },
  {
    question: 'How does the referral program work?',
    answer: 'Share your unique referral link with friends. When they sign up and make any purchase, you earn 15% airtime commission on every purchase they make. There\'s no limit to how much you can earn!',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const [billingToggle, setBillingToggle] = useState<'monthly' | 'yearly'>('monthly');

  // Store referral code if present
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('waleads_ref', ref);
    }
  }, [searchParams]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'WALeads',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    description: 'Extract WhatsApp contacts instantly. 100% browser-based.',
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: 'NGN', name: 'Free Plan' },
      { '@type': 'Offer', price: '5000', priceCurrency: 'NGN', name: 'Pro Monthly' },
      { '@type': 'Offer', price: '50000', priceCurrency: 'NGN', name: 'Pro Yearly' },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="WALeads - Extract WhatsApp Contacts Instantly | Free Tool"
        description="Extract phone numbers from WhatsApp group exports in seconds. 100% browser-based, private, and instant. Get 50 free exports. Export as CSV, VCF, or Excel."
        path="/"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PublicNavbar />

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
                  Start Free - 50 Exports
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
              <h3 className="font-semibold text-gray-900">50 Free Exports</h3>
              <p className="text-sm text-gray-500">Get started with 50 free contacts</p>
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
                <div className="bg-[#F0F2F5] rounded-2xl p-8 h-full hover:shadow-md transition-shadow">
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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Choose the plan that works for you. Start free, upgrade when you need more.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className={`text-sm font-medium ${billingToggle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingToggle(billingToggle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  billingToggle === 'yearly' ? 'bg-[#25D366]' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  billingToggle === 'yearly' ? 'translate-x-7' : 'translate-x-0.5'
                }`} />
              </button>
              <span className={`text-sm font-medium ${billingToggle === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>
                Yearly
              </span>
              {billingToggle === 'yearly' && (
                <span className="bg-[#E8F8EE] text-[#25D366] text-xs font-medium px-2 py-1 rounded-full">
                  Save 17%
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#F0F2F5] rounded-2xl p-8">
              <div className="text-sm font-medium text-gray-500 mb-2">Free Plan</div>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                N0<span className="text-lg font-normal text-gray-500"> one-time</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for trying out WALeads</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  '50 one-time free exports',
                  'CSV & VCF export',
                  'Single file upload',
                  'Auto deduplication',
                  'Country detection',
                  'Basic support',
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
                N{billingToggle === 'yearly' ? '50,000' : '5,000'}
                <span className="text-lg font-normal text-gray-300">
                  /{billingToggle === 'yearly' ? 'year' : 'month'}
                </span>
              </div>
              <p className="text-gray-300 mb-6">For power users and businesses</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited exports',
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

            {/* Top-up Preview */}
            <div className="bg-[#E8F8EE] rounded-2xl p-8">
              <div className="text-sm font-medium text-gray-500 mb-2">Top-up Credits</div>
              <div className="text-4xl font-bold text-[#25D366] mb-4">
                From N1<span className="text-lg font-normal text-gray-500">/credit</span>
              </div>
              <p className="text-gray-600 mb-6">Credits that never expire</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  '200 credits from N500',
                  '500 credits from N1,000',
                  '1,000 credits from N1,500',
                  'Volume discounts up to 60%',
                  'Credits never expire',
                  'Use anytime',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#25D366] mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/pricing">
                <Button variant="outline" className="w-full rounded-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                  See All Options
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Referral CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-[#E8F8EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-[#25D366] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Earn While You Share
              </h2>
              <p className="text-gray-600 mb-4">
                Share WALeads with your network and earn 15% airtime commission on every purchase your referrals make. No limits on earnings!
              </p>
              <Link to="/auth?signup=true">
                <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-8">
                  Sign Up & Get Your Referral Link
                </Button>
              </Link>
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
                Get Started Free - 50 Exports
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

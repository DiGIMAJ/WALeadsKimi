import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Users,
  Target,
  Shield,
  Zap,
  Globe,
  Heart,
  ArrowRight,
} from 'lucide-react';

const values = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Privacy First',
    description: 'We believe your data belongs to you. That\'s why all processing happens in your browser, and your WhatsApp chats never touch our servers.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Simplicity',
    description: 'Technology should make life easier, not harder. We\'ve designed WALeads to be intuitive and effortless to use.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Accessibility',
    description: 'Everyone should have access to powerful tools. That\'s why we offer a generous free plan and affordable pricing.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Customer Focus',
    description: 'We\'re building WALeads for real people with real needs. Your feedback shapes our product.',
  },
];

const stats = [
  { value: '100%', label: 'Browser-based' },
  { value: '0', label: 'Data breaches' },
  { value: '24/7', label: 'Support' },
  { value: 'Nigeria', label: 'Built for' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
              <Button variant="ghost">← Back to Home</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#E8F8EE] to-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-[#25D366]">WALeads</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We\'re on a mission to make contact extraction simple, secure, and accessible 
            for businesses and individuals in Nigeria and beyond.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center text-white mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  WALeads was born from a simple observation: businesses, marketers, and 
                  community managers in Nigeria were spending hours manually copying phone 
                  numbers from WhatsApp groups.
                </p>
                <p>
                  We believed there had to be a better way. A way that respected privacy, 
                  worked instantly, and didn\'t require technical expertise.
                </p>
                <p>
                  So we built WALeads - a tool that processes everything in your browser, 
                  keeping your data safe while giving you powerful extraction capabilities.
                </p>
              </div>
            </div>
            <div className="bg-[#F0F2F5] rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-[#25D366]">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-[#F0F2F5]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at WALeads
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6">
                <div className="w-12 h-12 bg-[#E8F8EE] rounded-xl flex items-center justify-center text-[#25D366] mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-[#075E54] rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              To empower Nigerian businesses and individuals with simple, secure tools 
              that help them grow their networks and reach their goals. We believe 
              technology should work for you, not against you.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 bg-[#F0F2F5]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built with Care
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            WALeads is built by a small team passionate about creating useful tools 
            for the Nigerian market. We\'re constantly improving based on your feedback.
          </p>
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-[#25D366] rounded-full animate-pulse"></div>
            <span className="text-gray-700">We\'re actively building and improving</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Us on Our Journey
          </h2>
          <p className="text-gray-600 mb-8">
            Be part of the thousands of users who trust WALeads for their contact extraction needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?signup=true">
              <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-8">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} WALeads. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

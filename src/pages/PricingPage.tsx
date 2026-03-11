import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  Check,
  Crown,
  Zap,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for trying out WALeads',
    features: [
      '25 exports per month',
      'CSV export only',
      'Single file upload',
      'Last 5 extractions history',
      'Auto deduplication',
      'Country detection',
      'Basic support',
    ],
    cta: 'Get Started Free',
    ctaLink: '/auth?signup=true',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 5000,
    period: 'month',
    description: 'For power users and businesses',
    features: [
      '7,500 exports per month',
      'CSV, VCF & Excel exports',
      'Multiple file uploads',
      'Full extraction history',
      'Tags & notes on contacts',
      'Priority email support',
      'Never expires credits',
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/auth?signup=true',
    highlighted: true,
  },
];

const topUpOptions = [
  { credits: 200, price: 250, label: 'Starter' },
  { credits: 1000, price: 1250, label: 'Popular', popular: true },
  { credits: 2000, price: 2500, label: 'Business' },
];

const faqs = [
  {
    question: 'What happens when I run out of credits?',
    answer: 'You can purchase top-up credits at any time. Top-up credits never expire and are used after your monthly allowance is depleted.',
  },
  {
    question: 'Can I cancel my Pro subscription?',
    answer: 'Yes, you can cancel anytime. You\'ll continue to have Pro access until the end of your current billing period.',
  },
  {
    question: 'Do credits expire?',
    answer: 'Monthly credits expire after 45 days. Top-up credits never expire.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major Nigerian debit/credit cards and bank transfers via Paystack.',
  },
];

export default function PricingPage() {
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
            Simple, Transparent <span className="text-[#25D366]">Pricing</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works for you. Start free and upgrade when you need more.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden ${
                  plan.highlighted
                    ? 'bg-[#075E54] text-white border-0'
                    : 'bg-white border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-4 right-4 bg-[#25D366] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.highlighted ? 'bg-[#25D366]' : 'bg-[#E8F8EE]'
                    }`}>
                      {plan.highlighted ? (
                        <Crown className="w-5 h-5 text-white" />
                      ) : (
                        <Users className="w-5 h-5 text-[#25D366]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className={`text-sm ${plan.highlighted ? 'text-gray-300' : 'text-gray-500'}`}>
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">₦{plan.price.toLocaleString()}</span>
                    <span className={plan.highlighted ? 'text-gray-300' : 'text-gray-500'}>
                      /{plan.period}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className={`w-5 h-5 mr-3 ${
                          plan.highlighted ? 'text-[#25D366]' : 'text-[#25D366]'
                        }`} />
                        <span className={plan.highlighted ? 'text-gray-200' : 'text-gray-600'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.ctaLink}>
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? 'bg-[#25D366] hover:bg-[#128C7E] text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top-up Section */}
      <section className="py-16 bg-[#F0F2F5]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top-up Credits
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Need more exports? Purchase top-up credits that never expire. 
              Use them anytime you need extra exports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {topUpOptions.map((option, index) => (
              <Card
                key={index}
                className={`relative ${option.popular ? 'border-2 border-[#25D366]' : ''}`}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#25D366] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <div className="text-sm text-gray-500 mb-2">{option.label}</div>
                  <div className="text-4xl font-bold text-[#25D366] mb-1">
                    {option.credits.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">credits</div>
                  <div className="text-2xl font-bold text-gray-900 mb-6">
                    ₦{option.price.toLocaleString()}
                  </div>
                  <Link to="/auth?signup=true">
                    <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                      Purchase
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Top-up credits never expire and can be used anytime after your monthly allowance is depleted.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Feature Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-700">Feature</th>
                  <th className="text-center py-4 px-4 font-medium text-gray-700">Free</th>
                  <th className="text-center py-4 px-4 font-medium text-[#25D366]">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Monthly exports', free: '25', pro: '7,500' },
                  { feature: 'CSV export', free: '✓', pro: '✓' },
                  { feature: 'VCF export', free: '—', pro: '✓' },
                  { feature: 'Excel export', free: '—', pro: '✓' },
                  { feature: 'Single file upload', free: '✓', pro: '✓' },
                  { feature: 'Multiple file uploads', free: '—', pro: '✓' },
                  { feature: 'Extraction history', free: 'Last 5', pro: 'Unlimited' },
                  { feature: 'Tags & notes', free: '—', pro: '✓' },
                  { feature: 'Auto deduplication', free: '✓', pro: '✓' },
                  { feature: 'Country detection', free: '✓', pro: '✓' },
                  { feature: 'Support', free: 'Community', pro: 'Priority email' },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{row.free}</td>
                    <td className="py-4 px-4 text-center text-[#25D366] font-medium">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-[#F0F2F5]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-[#25D366]" />
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#075E54]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-8">
            Sign up now and get 25 free exports to try out WALeads.
          </p>
          <Link to="/auth?signup=true">
            <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-8">
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
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

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicNavbar from '@/components/PublicNavbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import {
  Users,
  Check,
  Crown,
  Zap,
  ArrowRight,
  HelpCircle,
  Gift,
} from 'lucide-react';
import { TOP_UP_TIERS } from '@/types';

const faqs = [
  {
    question: 'What happens when I run out of credits?',
    answer: 'You can purchase top-up credits at any time. Top-up credits never expire and are used after your free exports are depleted.',
  },
  {
    question: 'Can I cancel my Pro subscription?',
    answer: 'Yes, you can cancel anytime. You\'ll continue to have Pro access until the end of your current billing period.',
  },
  {
    question: 'Do credits expire?',
    answer: 'Free users get 50 one-time exports that never expire. Top-up credits also never expire. Pro users get unlimited exports for the duration of their subscription.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major Nigerian debit/credit cards and bank transfers via Paystack.',
  },
  {
    question: 'How does the referral program work?',
    answer: 'Share your unique referral link. When someone signs up and makes any purchase, you earn 15% airtime commission on every purchase they make.',
  },
];

export default function PricingPage() {
  const [billingToggle, setBillingToggle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Pricing - WALeads"
        description="Simple, transparent pricing. Free plan with 50 exports. Pro unlimited from N5,000/month. Volume top-up discounts available."
        path="/pricing"
      />

      <PublicNavbar showBackButton />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#E8F8EE] to-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent <span className="text-[#25D366]">Pricing</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the plan that works for you. Start free and upgrade when you need more.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3">
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
      </section>

      {/* Plans */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#E8F8EE]">
                    <Users className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Free</h3>
                    <p className="text-sm text-gray-500">For trying out WALeads</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">N0</span>
                  <span className="text-gray-500"> one-time</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    '50 one-time free exports',
                    'CSV & VCF export',
                    'Single file upload',
                    'Last 5 extractions history',
                    'Auto deduplication',
                    'Country detection',
                    'Basic support',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-5 h-5 mr-3 text-[#25D366]" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/auth?signup=true">
                  <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="relative overflow-hidden bg-[#075E54] text-white border-0">
              <div className="absolute top-4 right-4 bg-[#25D366] text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#25D366]">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Pro</h3>
                    <p className="text-sm text-gray-300">For power users</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    N{billingToggle === 'yearly' ? '50,000' : '5,000'}
                  </span>
                  <span className="text-gray-300">
                    /{billingToggle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'Unlimited exports',
                    'CSV, VCF & Excel exports',
                    'Multiple file uploads',
                    'Full extraction history',
                    'Tags & notes on contacts',
                    'Priority email support',
                    'All future features',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-5 h-5 mr-3 text-[#25D366]" />
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/auth?signup=true">
                  <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                    Upgrade to Pro
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Yearly highlight */}
            <Card className="bg-gradient-to-br from-[#E8F8EE] to-white border-[#25D366] border-2">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#25D366]">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Top-ups</h3>
                    <p className="text-sm text-gray-500">Pay as you go</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">From N1</span>
                  <span className="text-gray-500">/credit</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'Credits never expire',
                    'Volume discounts up to 60%',
                    'Use with any plan',
                    'Instant activation',
                    'No commitment',
                    'Buy anytime',
                    'Stackable with subscription',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-5 h-5 mr-3 text-[#25D366]" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href="#topup-section">
                  <Button variant="outline" className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                    See Top-up Tiers
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top-up Section */}
      <section id="topup-section" className="py-16 bg-[#F0F2F5]">
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
              Bigger packs = bigger savings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TOP_UP_TIERS.map((tier) => (
              <Card
                key={tier.id}
                className={`relative ${tier.popular ? 'border-2 border-[#25D366] shadow-lg' : ''} ${tier.bestValue ? 'border-2 border-purple-500 shadow-lg' : ''}`}
              >
                {tier.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${
                    tier.popular ? 'bg-[#25D366]' : tier.bestValue ? 'bg-purple-500' : 'bg-gray-700'
                  }`}>
                    {tier.badge}
                  </div>
                )}
                <CardContent className="p-5 text-center">
                  <div className="text-sm text-gray-500 mb-2">{tier.name}</div>
                  <div className="text-3xl font-bold text-[#25D366] mb-1">
                    {tier.credits.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mb-3">credits</div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    N{tier.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    N{tier.perCredit.toFixed(2)}/credit
                  </div>
                  {tier.savings && (
                    <div className="text-xs text-[#25D366] font-medium mb-3">
                      Save {tier.savings}
                    </div>
                  )}
                  {!tier.savings && <div className="mb-3" />}
                  <Link to="/auth?signup=true">
                    <Button size="sm" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
                      Purchase
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Top-up credits never expire and can be used anytime. They work with both Free and Pro plans.
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
                  { feature: 'Exports', free: '50 one-time', pro: 'Unlimited' },
                  { feature: 'CSV export', free: 'Yes', pro: 'Yes' },
                  { feature: 'VCF export', free: 'Yes', pro: 'Yes' },
                  { feature: 'Excel export', free: 'No', pro: 'Yes' },
                  { feature: 'Single file upload', free: 'Yes', pro: 'Yes' },
                  { feature: 'Multiple file uploads', free: 'No', pro: 'Yes' },
                  { feature: 'Extraction history', free: 'Last 5', pro: 'Unlimited' },
                  { feature: 'Tags & notes', free: 'No', pro: 'Yes' },
                  { feature: 'Auto deduplication', free: 'Yes', pro: 'Yes' },
                  { feature: 'Country detection', free: 'Yes', pro: 'Yes' },
                  { feature: 'Top-up credits', free: 'Yes', pro: 'Yes' },
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

      {/* Referral Banner */}
      <section className="py-8 bg-gradient-to-r from-purple-50 to-[#E8F8EE]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Gift className="w-6 h-6 text-[#25D366]" />
            <h3 className="text-xl font-bold text-gray-900">Earn 15% commission on every referral purchase</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Share your referral link and earn airtime on every purchase your friends make.
          </p>
          <Link to="/auth?signup=true">
            <Button variant="outline" className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-full px-6">
              Get Your Referral Link
            </Button>
          </Link>
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
            Sign up now and get 50 free exports to try out WALeads.
          </p>
          <Link to="/auth?signup=true">
            <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-8">
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer minimal />
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PublicNavbar from '@/components/PublicNavbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  Check,
  MessageCircle,
  Users,
  CreditCard,
  Gift,
  Star,
} from 'lucide-react';

const steps = [
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: 'Export from WhatsApp',
    description: 'Open any WhatsApp group or individual chat that contains the contacts you want to extract.',
    details: [
      'Open the WhatsApp group or chat',
      'Tap the three dots menu in the top right',
      'Select "More" from the dropdown',
      'Tap "Export chat"',
      'Choose "Without media" (this creates a smaller file)',
      'Save the .zip file to your device',
    ],
    tip: 'For large groups, the export might take a few moments. Make sure you have enough storage space.',
  },
  {
    icon: <Upload className="w-8 h-8" />,
    title: 'Upload to WALeads',
    description: 'Come to WALeads and upload your exported .zip file.',
    details: [
      'Log in to your WALeads account',
      'Go to the Upload page',
      'Drag and drop your .zip file, or click to browse',
      'Wait for the processing to complete',
      'Review the extracted contacts in the preview',
    ],
    tip: 'All processing happens in your browser. Your chat data never leaves your device!',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Manage Contacts',
    description: 'Organize your extracted contacts with tags, names, and groups.',
    details: [
      'Add custom tags to categorize contacts',
      'Edit contact names for easy identification',
      'Use search and filters to find specific contacts',
      'View contacts by country or source file',
      'Delete duplicates or unwanted contacts',
    ],
    tip: 'Tags help you organize contacts from different groups. Use them to track where contacts came from.',
  },
  {
    icon: <FileSpreadsheet className="w-8 h-8" />,
    title: 'Export Contacts',
    description: 'Save contacts in your preferred format for use anywhere.',
    details: [
      'CSV export - works with all spreadsheet apps (all users)',
      'VCF export - import directly to your phone contacts (all users)',
      'Excel export - formatted spreadsheet with all details (Pro only)',
      'Select specific contacts or export all at once',
      'Import into your CRM, email tool, or phone',
    ],
    tip: 'VCF files can be imported directly into your phone contacts app. CSV works great for CRMs and email tools.',
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: 'Top-up Credits',
    description: 'Need more exports? Purchase credit packs with volume discounts.',
    details: [
      'Free users get 50 one-time exports to start',
      'Purchase top-up credits that never expire',
      'Volume discounts: save up to 60% on larger packs',
      'Credits from N500 (200 credits) to N5,000 (5,000 credits)',
      'Or upgrade to Pro for unlimited exports',
    ],
    tip: 'Top-up credits never expire. Buy in bulk to save more per credit!',
  },
  {
    icon: <Gift className="w-8 h-8" />,
    title: 'Referral Program',
    description: 'Earn 15% airtime commission by sharing WALeads.',
    details: [
      'Find your unique referral link in the Referrals tab',
      'Share it with friends, colleagues, or your network',
      'When they sign up using your link and make a purchase',
      'You earn 15% commission on every purchase they make',
      'No limits on how much you can earn',
    ],
    tip: 'The referral commission applies to all purchases - subscriptions and top-ups alike!',
  },
];

const faqs = [
  {
    question: 'What file format should I upload?',
    answer: 'WALeads accepts .zip files exported directly from WhatsApp. Do not extract the zip file - upload it as-is.',
  },
  {
    question: 'Can I upload multiple files at once?',
    answer: 'Yes, but only on the Pro plan. Free users can upload one file at a time.',
  },
  {
    question: 'What information is extracted?',
    answer: 'WALeads extracts phone numbers in international format (+country code). It also detects the country and assigns a flag emoji to each contact.',
  },
  {
    question: 'How does deduplication work?',
    answer: 'WALeads automatically removes duplicate numbers within each upload. It also checks against your saved contacts to avoid saving the same number twice.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely! All processing happens in your browser using JavaScript. Your WhatsApp chat content is never uploaded to our servers. We only store the extracted phone numbers.',
  },
];

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="How to Use WALeads - Step by Step Guide"
        description="Learn how to extract WhatsApp contacts in simple steps. No technical skills required. Export as CSV, VCF, or Excel."
        path="/how-to-use"
      />

      <PublicNavbar showBackButton />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#E8F8EE] to-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How to Use <span className="text-[#25D366]">WALeads</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extract WhatsApp contacts in simple steps. No technical skills required.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#25D366] rounded-2xl flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                    <div className="text-6xl font-bold text-[#E8F8EE] mt-4">
                      0{index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{step.description}</p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-4">
                      <h3 className="font-medium text-gray-900 mb-4">Step-by-step:</h3>
                      <ol className="space-y-3">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="w-5 h-5 text-[#25D366] mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-[#E8F8EE] rounded-xl p-4 flex items-start">
                      <Star className="w-5 h-5 text-[#25D366] mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Pro Tip:</span> {step.tip}
                      </p>
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-10 top-28 w-px h-24 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Placeholder */}
      <section className="py-16 bg-[#F0F2F5]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Watch How It Works
          </h2>
          <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8" />
              </div>
              <p className="text-lg">Video tutorial coming soon!</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
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

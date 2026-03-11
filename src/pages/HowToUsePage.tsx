import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Upload,
  FileSpreadsheet,
  ArrowRight,
  Users,
  Check,
  Smartphone,
  MessageCircle,
} from 'lucide-react';

const steps = [
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: 'Export from WhatsApp',
    description: 'Open any WhatsApp group or individual chat that contains the contacts you want to extract.',
    details: [
      'Open the WhatsApp group or chat',
      'Tap the three dots menu (⋮) in the top right',
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
    icon: <FileSpreadsheet className="w-8 h-8" />,
    title: 'Export and Use',
    description: 'Save the contacts to your account and export in your preferred format.',
    details: [
      'Review the preview of extracted contacts',
      'Click "Confirm & Save" to save contacts',
      'Go to the Contacts page to view all saved contacts',
      'Export as CSV, VCF (Pro), or Excel (Pro)',
      'Import into your CRM, email tool, or phone contacts',
    ],
    tip: 'CSV exports are free! VCF and Excel exports cost 5 credits each (Pro plan only).',
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
            How to Use <span className="text-[#25D366]">WALeads</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extract WhatsApp contacts in three simple steps. No technical skills required.
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
                      <Smartphone className="w-5 h-5 text-[#25D366] mr-3 flex-shrink-0 mt-0.5" />
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

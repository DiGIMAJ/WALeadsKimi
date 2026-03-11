import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Shield, Lock, Eye, Trash2, Server } from 'lucide-react';

const sections = [
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Information We Collect',
    content: `
      <p className="mb-4">We collect the following information when you use WALeads:</p>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li><strong>Account Information:</strong> Your name, email address, and password when you create an account.</li>
        <li><strong>Contact Data:</strong> Phone numbers extracted from your WhatsApp exports that you choose to save.</li>
        <li><strong>Usage Data:</strong> Information about your extractions, exports, and credit usage.</li>
        <li><strong>Payment Information:</strong> Transaction details processed through Paystack (we do not store your card details).</li>
      </ul>
    `,
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'How We Protect Your Data',
    content: `
      <p className="mb-4">Your privacy and security are our top priorities:</p>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li><strong>Client-Side Processing:</strong> Your WhatsApp chat files are processed entirely in your browser. They are never uploaded to our servers.</li>
        <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using SSL/TLS.</li>
        <li><strong>Secure Storage:</strong> Your contact data is stored in Firebase with industry-standard security measures.</li>
        <li><strong>Access Control:</strong> You can only access your own data. We never share your contacts with third parties.</li>
      </ul>
    `,
  },
  {
    icon: <Server className="w-6 h-6" />,
    title: 'Data We Do NOT Collect',
    content: `
      <p className="mb-4">To protect your privacy, we explicitly do NOT collect:</p>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li>The content of your WhatsApp messages</li>
        <li>Your WhatsApp chat history or conversations</li>
        <li>Media files (photos, videos, voice notes) from your exports</li>
        <li>Your credit card or bank account details (handled by Paystack)</li>
        <li>Your WhatsApp account credentials</li>
      </ul>
    `,
  },
  {
    icon: <Trash2 className="w-6 h-6" />,
    title: 'Your Rights',
    content: `
      <p className="mb-4">You have full control over your data:</p>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li><strong>Access:</strong> You can view all your saved contacts at any time.</li>
        <li><strong>Deletion:</strong> You can delete individual contacts or your entire account.</li>
        <li><strong>Export:</strong> You can export your contacts in multiple formats.</li>
        <li><strong>Account Deletion:</strong> You can permanently delete your account and all associated data from the Billing page.</li>
      </ul>
    `,
  },
];

export default function PrivacyPolicyPage() {
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
          <div className="w-16 h-16 bg-[#25D366] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is our priority. Learn how we protect your data and keep your information secure.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-600">
              At WALeads, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, and protect your personal information when you use our service. By using WALeads, 
              you agree to the practices described in this policy.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center text-white">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cookies</h2>
              <p className="text-gray-600">
                We use essential cookies to maintain your login session and provide core functionality. 
                We do not use tracking cookies or share cookie data with third parties.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-600">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mt-2">
                <li><strong>Firebase:</strong> For authentication and data storage</li>
                <li><strong>Paystack:</strong> For payment processing</li>
              </ul>
              <p className="text-gray-600 mt-4">
                These services have their own privacy policies and security measures in place.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:support@waleads.name.ng" className="text-[#25D366] hover:underline">
                  support@waleads.name.ng
                </a>
              </p>
            </div>
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

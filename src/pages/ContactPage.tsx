import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Users,
  Mail,
  MessageSquare,
  Send,
  Loader2,
  Phone,
  Clock,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

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
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in <span className="text-[#25D366]">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or need help? We\'re here for you. Reach out and we\'ll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#E8F8EE] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-[#25D366]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 text-sm mb-3">
                  For general inquiries and support
                </p>
                <a 
                  href="mailto:support@waleads.name.ng"
                  className="text-[#25D366] hover:underline font-medium"
                >
                  support@waleads.name.ng
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#E8F8EE] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-[#25D366]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 text-sm mb-3">
                  For urgent matters (Pro users)
                </p>
                <a 
                  href="tel:+2348000000000"
                  className="text-[#25D366] hover:underline font-medium"
                >
                  +234 800 000 0000
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-[#E8F8EE] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-[#25D366]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                <p className="text-gray-600 text-sm mb-3">
                  We typically respond within
                </p>
                <span className="text-[#25D366] font-medium">
                  24 hours
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-[#F0F2F5]">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Common Questions
          </h2>
          <p className="text-gray-600 mb-8">
            Find quick answers to frequently asked questions
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <Link to="/how-to-use">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900">How do I export from WhatsApp?</h3>
                  <p className="text-sm text-gray-500 mt-1">Learn the step-by-step process</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/pricing">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900">What are the pricing plans?</h3>
                  <p className="text-sm text-gray-500 mt-1">View our affordable options</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/privacy-policy">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900">Is my data secure?</h3>
                  <p className="text-sm text-gray-500 mt-1">Read our privacy policy</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/app/billing">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900">How do credits work?</h3>
                  <p className="text-sm text-gray-500 mt-1">Understand our credit system</p>
                </CardContent>
              </Card>
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

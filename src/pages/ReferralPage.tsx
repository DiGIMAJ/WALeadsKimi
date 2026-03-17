import { useState } from 'react';
import { useReferral } from '@/hooks/useReferral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Gift,
  Users,
  Copy,
  DollarSign,
  UserPlus,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';

export default function ReferralPage() {
  const {
    referrals,
    earnings,
    loading,
    getReferralLink,
    activeReferrals,
    pendingReferrals,
    totalEarnings,
    referralCode,
    referralCount,
  } = useReferral();
  const [copied, setCopied] = useState(false);

  const referralLink = getReferralLink();

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#25D366]" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-gray-500">Earn 15% commission on every referral purchase</p>
      </div>

      {/* Referral Link Card */}
      <Card className="mb-6 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Share & Earn</h3>
              <p className="text-white/80 text-sm">
                Earn 15% airtime commission on every purchase your referrals make
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <label className="text-sm text-white/70 block mb-2">Your Referral Link</label>
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="bg-white/20 border-white/30 text-white placeholder-white/50"
              />
              <Button
                onClick={copyLink}
                variant="secondary"
                className="bg-white text-[#25D366] hover:bg-gray-100 shrink-0"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-sm text-white/70">Code: </span>
              <button onClick={copyCode} className="font-mono font-bold hover:underline">
                {referralCode}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#E8F8EE] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{referralCount}</p>
                <p className="text-xs text-gray-500">Total Referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeReferrals.length}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingReferrals.length}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  N{(totalEarnings / 100).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals List */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-[#25D366]" />
            Your Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No referrals yet</p>
              <p className="text-sm">Share your referral link to start earning</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Earnings</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {referrals.map((referral) => (
                    <tr key={referral.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {referral.referredUserName}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          referral.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {referral.status === 'active' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#25D366] font-medium">
                        N{(referral.totalEarnings / 100).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {referral.createdAt?.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Earnings History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-[#25D366]" />
            Earnings History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No earnings yet</p>
              <p className="text-sm">Earnings appear when your referrals make a purchase</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Purchase</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Commission</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {earnings.map((earning) => (
                    <tr key={earning.id}>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {earning.createdAt?.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm capitalize">
                        {earning.type}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        N{(earning.purchaseAmount / 100).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#25D366] font-medium">
                        N{(earning.commission / 100).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          earning.status === 'credited'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How Referrals Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#E8F8EE] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-[#25D366] font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Share Your Link</h4>
              <p className="text-sm text-gray-500">
                Share your unique referral link with friends and contacts
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#E8F8EE] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-[#25D366] font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">They Sign Up & Buy</h4>
              <p className="text-sm text-gray-500">
                When they create an account and make any purchase
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#E8F8EE] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-[#25D366] font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">You Earn 15%</h4>
              <p className="text-sm text-gray-500">
                You get 15% airtime commission on every purchase they make
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

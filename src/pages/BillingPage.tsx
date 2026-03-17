import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePaystack } from '@/hooks/usePaystack';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, doc, updateDoc, increment, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Crown,
  CreditCard,
  Zap,
  Check,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import type { Transaction, TopUpTier } from '@/types';
import { TOP_UP_TIERS } from '@/types';

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const { purchaseTopUp, subscribeToPro, loading: paystackLoading } = usePaystack();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'users', user.uid, 'transactions'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const fetchedTransactions: Transaction[] = [];
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedTransactions.push({
          id: docSnap.id,
          type: data.type,
          amount: data.amount,
          description: data.description,
          exportsAdded: data.exportsAdded,
          paystackRef: data.paystackRef,
          status: data.status,
          createdAt: data.createdAt?.toDate(),
        } as Transaction);
      });
      
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleTopUp = async (tier: TopUpTier) => {
    purchaseTopUp(
      tier,
      async (reference) => {
        if (!user) return;
        
        try {
          await addDoc(collection(db, 'users', user.uid, 'transactions'), {
            type: 'topup',
            amount: tier.price,
            description: `Top-up: ${tier.credits} credits (${tier.name})`,
            exportsAdded: tier.credits,
            paystackRef: reference,
            status: 'success',
            createdAt: new Date(),
          });
          
          await updateDoc(doc(db, 'users', user.uid), {
            topupExports: increment(tier.credits),
          });
          
          await refreshUser();
          fetchTransactions();
          toast.success(`Added ${tier.credits} credits to your account!`);
        } catch {
          toast.error('Failed to update credits');
        }
      },
      () => {
        toast.info('Payment cancelled');
      }
    );
  };

  const handleSubscribe = () => {
    subscribeToPro(
      billingCycle,
      async (reference) => {
        if (!user) return;
        
        try {
          const amount = billingCycle === 'yearly' ? 50000 : 5000;
          
          await addDoc(collection(db, 'users', user.uid, 'transactions'), {
            type: 'subscription',
            amount,
            description: `Pro Plan Subscription (${billingCycle})`,
            exportsAdded: 0,
            paystackRef: reference,
            status: 'success',
            createdAt: new Date(),
          });
          
          await updateDoc(doc(db, 'users', user.uid), {
            plan: 'pro',
            billingCycle,
            monthlyExports: 999999,
            exportsUsed: 0,
          });
          
          await refreshUser();
          fetchTransactions();
          toast.success('Welcome to Pro!');
        } catch {
          toast.error('Failed to activate subscription');
        }
      },
      () => {
        toast.info('Subscription cancelled');
      }
    );
  };

  const monthlyProgress = user && user.plan !== 'pro'
    ? Math.round((user.exportsUsed / user.monthlyExports) * 100) 
    : 0;

  const daysUntilReset = user?.nextReset
    ? Math.ceil((user.nextReset.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Billing & Account</h1>
        <p className="text-gray-500">Manage your plan and credits</p>
      </div>

      {/* Current Plan */}
      <Card className={`mb-6 ${user?.plan === 'pro' ? 'bg-[#075E54] text-white' : ''}`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                user?.plan === 'pro' ? 'bg-[#25D366]' : 'bg-[#E8F8EE]'
              }`}>
                <Crown className={`w-7 h-7 ${user?.plan === 'pro' ? 'text-white' : 'text-[#25D366]'}`} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-semibold">
                    {user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                  </h3>
                  {user?.plan === 'pro' && (
                    <span className="bg-[#25D366] text-white text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className={user?.plan === 'pro' ? 'text-gray-300' : 'text-gray-500'}>
                  {user?.plan === 'pro'
                    ? `Unlimited exports + all premium features (${user?.billingCycle || 'monthly'})`
                    : '50 one-time exports, CSV & VCF export'}
                </p>
                {user?.plan === 'pro' && (
                  <p className="text-sm text-gray-300 mt-1">
                    Resets in {daysUntilReset} days
                  </p>
                )}
              </div>
            </div>
            
            {user?.plan === 'free' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      billingCycle === 'monthly'
                        ? 'bg-[#25D366] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Monthly N5,000
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      billingCycle === 'yearly'
                        ? 'bg-[#25D366] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Yearly N50,000
                  </button>
                </div>
                <Button
                  onClick={handleSubscribe}
                  disabled={paystackLoading}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white"
                >
                  {paystackLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Crown className="w-4 h-4 mr-2" />
                  )}
                  Upgrade to Pro
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credit Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {user?.plan === 'pro' ? 'Plan Status' : 'Free Credits'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user?.plan === 'pro' ? (
              <div>
                <div className="text-3xl font-bold text-[#25D366] mb-2">Unlimited</div>
                <p className="text-sm text-gray-500">
                  Unlimited exports with your Pro plan. Resets in {daysUntilReset} days.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Used</span>
                    <span className="font-medium">{user?.freeExportsUsed || user?.exportsUsed || 0} / {user?.freeExportsTotal || 50}</span>
                  </div>
                  <Progress value={monthlyProgress} className="h-3" />
                </div>
                <p className="text-sm text-gray-500">
                  One-time free credits. Purchase top-ups or upgrade to Pro for more.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top-up Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#25D366] mb-2">
              {user?.topupExports || 0}
            </div>
            <p className="text-sm text-gray-500">
              These credits never expire and are used after your {user?.plan === 'pro' ? 'subscription' : 'free'} credits.
            </p>
            {(user?.topupExports || 0) < 10 && user?.plan === 'free' && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">Running low on credits! Top up below.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top-up Options */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Zap className="w-5 h-5 mr-2 text-[#25D366]" />
            Purchase Top-up Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Credits never expire. Bigger packs have bigger discounts!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TOP_UP_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative border-2 rounded-xl p-4 hover:border-[#25D366] transition-colors ${
                  tier.popular ? 'border-[#25D366] bg-[#E8F8EE]/30' : tier.bestValue ? 'border-purple-300 bg-purple-50/30' : 'border-gray-100'
                }`}
              >
                {tier.badge && (
                  <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                    tier.popular ? 'bg-[#25D366]' : tier.bestValue ? 'bg-purple-500' : 'bg-gray-700'
                  }`}>
                    {tier.badge}
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{tier.credits.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mb-1">credits</div>
                  <div className="text-lg font-semibold text-[#25D366]">
                    N{tier.price.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    N{tier.perCredit.toFixed(2)}/credit
                  </div>
                  {tier.savings && (
                    <div className="text-[10px] text-[#25D366] font-medium mt-0.5">
                      Save {tier.savings}
                    </div>
                  )}
                  <Button
                    onClick={() => handleTopUp(tier)}
                    disabled={paystackLoading}
                    size="sm"
                    className="w-full mt-3 bg-[#25D366] hover:bg-[#128C7E] text-white"
                  >
                    {paystackLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Buy Now'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-[#25D366]" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {tx.createdAt?.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {tx.description}
                        {tx.exportsAdded > 0 && (
                          <span className="text-[#25D366] ml-2">
                            (+{tx.exportsAdded} credits)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        N{tx.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          tx.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : tx.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {tx.status === 'success' && <Check className="w-3 h-3 mr-1" />}
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
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

      {/* Credit Info Notice */}
      <div className="mt-6 bg-[#E8F8EE] border border-[#25D366]/20 rounded-xl p-4 flex items-start space-x-3">
        <Zap className="w-5 h-5 text-[#25D366] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-gray-900">Credits Info</h4>
          <p className="text-sm text-gray-600 mt-1">
            {user?.plan === 'pro' 
              ? 'Pro users get unlimited exports. Top-up credits are preserved and can be used if you downgrade.'
              : 'Free users get 50 one-time exports. Top-up credits never expire and stack with your free credits. Upgrade to Pro for unlimited exports.'}
          </p>
        </div>
      </div>
    </div>
  );
}

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
import type { Transaction } from '@/types';

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const { purchaseTopUp, subscribeToPro, loading: paystackLoading } = usePaystack();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'users', user.uid, 'transactions'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const fetchedTransactions: Transaction[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedTransactions.push({
          id: doc.id,
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

  const handleTopUp = async (batchCount: number) => {
    purchaseTopUp(
      batchCount,
      async (reference) => {
        // On success
        if (!user) return;
        
        try {
          const exports = batchCount * 200;
          
          // Add transaction record
          await addDoc(collection(db, 'users', user.uid, 'transactions'), {
            type: 'topup',
            amount: batchCount * 250,
            description: `${batchCount} batch${batchCount > 1 ? 'es' : ''} of 200 credits`,
            exportsAdded: exports,
            paystackRef: reference,
            status: 'success',
            createdAt: new Date(),
          });
          
          // Update user credits
          await updateDoc(doc(db, 'users', user.uid), {
            topupExports: increment(exports),
          });
          
          await refreshUser();
          fetchTransactions();
          toast.success(`Added ${exports} credits to your account!`);
        } catch (error) {
          toast.error('Failed to update credits');
        }
      },
      () => {
        // On cancel
        toast.info('Payment cancelled');
      }
    );
  };

  const handleSubscribe = () => {
    subscribeToPro(
      async (reference) => {
        if (!user) return;
        
        try {
          // Add transaction record
          await addDoc(collection(db, 'users', user.uid, 'transactions'), {
            type: 'subscription',
            amount: 5000,
            description: 'Pro Plan Subscription',
            exportsAdded: 7500,
            paystackRef: reference,
            status: 'success',
            createdAt: new Date(),
          });
          
          // Update user to pro
          await updateDoc(doc(db, 'users', user.uid), {
            plan: 'pro',
            monthlyExports: 7500,
            exportsUsed: 0,
          });
          
          await refreshUser();
          fetchTransactions();
          toast.success('Welcome to Pro!');
        } catch (error) {
          toast.error('Failed to activate subscription');
        }
      },
      () => {
        toast.info('Subscription cancelled');
      }
    );
  };

  const monthlyProgress = user 
    ? Math.round((user.exportsUsed / user.monthlyExports) * 100) 
    : 0;

  const daysUntilReset = user?.nextReset
    ? Math.ceil((user.nextReset.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
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
                    ? '7,500 exports per month + all premium features'
                    : '25 exports per month, CSV export only'}
                </p>
                {user?.plan === 'pro' && (
                  <p className="text-sm text-gray-300 mt-1">
                    Resets in {daysUntilReset} days
                  </p>
                )}
              </div>
            </div>
            
            {user?.plan === 'free' && (
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* Credit Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Used</span>
                <span className="font-medium">{user?.exportsUsed || 0} / {user?.monthlyExports || 25}</span>
              </div>
              <Progress value={monthlyProgress} className="h-3" />
            </div>
            <p className="text-sm text-gray-500">
              Resets every 45 days. Next reset in {daysUntilReset} days.
            </p>
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
              These credits never expire and are used after your monthly allowance is depleted.
            </p>
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
            Need more credits? Purchase top-ups that never expire. ₦250 for 200 credits.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { batches: 1, credits: 200, price: 250 },
              { batches: 5, credits: 1000, price: 1250 },
              { batches: 10, credits: 2000, price: 2500 },
            ].map((option) => (
              <div
                key={option.batches}
                className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#25D366] transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{option.credits}</div>
                  <div className="text-sm text-gray-500">credits</div>
                  <div className="text-lg font-semibold text-[#25D366] mt-2">
                    ₦{option.price.toLocaleString()}
                  </div>
                  <Button
                    onClick={() => handleTopUp(option.batches)}
                    disabled={paystackLoading}
                    className="w-full mt-4 bg-[#25D366] hover:bg-[#128C7E] text-white"
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
                        ₦{tx.amount.toLocaleString()}
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

      {/* Credit Expiry Notice */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-amber-900">Credit Expiry Notice</h4>
          <p className="text-sm text-amber-700 mt-1">
            Monthly credits expire after 45 days from your plan start date. 
            Top-up credits never expire. Make sure to use your monthly credits before they reset!
          </p>
        </div>
      </div>
    </div>
  );
}

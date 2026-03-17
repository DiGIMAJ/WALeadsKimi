import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import type { Referral, ReferralEarning } from '@/types';

export function useReferral() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<ReferralEarning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferrals();
      fetchEarnings();
    }
  }, [user]);

  const fetchReferrals = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'users', user.uid, 'referrals'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const fetched: Referral[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        fetched.push({
          id: doc.id,
          referrerId: data.referrerId,
          referredUserId: data.referredUserId,
          referredUserName: data.referredUserName,
          status: data.status,
          totalEarnings: data.totalEarnings || 0,
          createdAt: data.createdAt?.toDate(),
        } as Referral);
      });

      setReferrals(fetched);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEarnings = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'users', user.uid, 'referralEarnings'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const fetched: ReferralEarning[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        fetched.push({
          id: doc.id,
          referralId: data.referralId,
          transactionId: data.transactionId,
          purchaseAmount: data.purchaseAmount,
          commission: data.commission,
          type: data.type,
          status: data.status,
          createdAt: data.createdAt?.toDate(),
        } as ReferralEarning);
      });

      setEarnings(fetched);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const getReferralLink = () => {
    if (!user?.referralCode) return '';
    return `https://waleads.name.ng/?ref=${user.referralCode}`;
  };

  const activeReferrals = referrals.filter((r) => r.status === 'active');
  const pendingReferrals = referrals.filter((r) => r.status === 'pending');
  const totalEarnings = user?.referralEarnings || 0;

  return {
    referrals,
    earnings,
    loading,
    getReferralLink,
    activeReferrals,
    pendingReferrals,
    totalEarnings,
    referralCode: user?.referralCode || '',
    referralCount: user?.referralCount || 0,
    refresh: () => {
      fetchReferrals();
      fetchEarnings();
    },
  };
}

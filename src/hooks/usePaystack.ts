import { useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import { useAuth } from './useAuth';
import type { TopUpTier } from '@/types';

const PAYSTACK_PUBLIC_KEY = 'pk_live_b0bfb74586cc0bb41f357e2cbb88ce67b4cac719';
const PAYSTACK_MONTHLY_PLAN_CODE = 'PLN_ipza7t5sg17rkl2';
const PAYSTACK_YEARLY_PLAN_CODE = 'PLN_yearly_placeholder';

interface PaystackConfig {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, unknown>;
  onSuccess?: (reference: string) => void;
  onCancel?: () => void;
}

export function usePaystack() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const initializePayment = (config: PaystackConfig) => {
    setLoading(true);
    
    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: config.email,
      amount: config.amount * 100, // Convert to kobo
      ref: config.reference,
      metadata: config.metadata,
      onClose: () => {
        setLoading(false);
        config.onCancel?.();
      },
      callback: (response: { reference: string }) => {
        setLoading(false);
        config.onSuccess?.(response.reference);
      },
    });

    handler.openIframe();
  };

  const subscribeToPro = (
    billingCycle: 'monthly' | 'yearly' = 'monthly',
    onSuccess?: (reference: string) => void,
    onCancel?: () => void
  ) => {
    if (!user) return;
    
    const amount = billingCycle === 'yearly' ? 50000 : 5000;
    const reference = `sub_${user.uid}_${billingCycle}_${Date.now()}`;
    
    initializePayment({
      email: user.email,
      amount,
      reference,
      metadata: {
        userId: user.uid,
        plan: 'pro',
        type: 'subscription',
        billingCycle,
      },
      onSuccess,
      onCancel,
    });
  };

  const purchaseTopUp = (
    tier: TopUpTier,
    onSuccess?: (reference: string) => void,
    onCancel?: () => void
  ) => {
    if (!user) return;
    
    const reference = `topup_${user.uid}_${tier.id}_${Date.now()}`;
    
    initializePayment({
      email: user.email,
      amount: tier.price,
      reference,
      metadata: {
        userId: user.uid,
        type: 'topup',
        tierId: tier.id,
        tierName: tier.name,
        exportsAdded: tier.credits,
        description: `Top-up: ${tier.credits} credits (${tier.name})`,
      },
      onSuccess,
      onCancel,
    });
  };

  return {
    initializePayment,
    subscribeToPro,
    purchaseTopUp,
    loading,
    PAYSTACK_MONTHLY_PLAN_CODE,
    PAYSTACK_YEARLY_PLAN_CODE,
  };
}

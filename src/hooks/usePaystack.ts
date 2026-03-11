import { useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import { useAuth } from './useAuth';

const PAYSTACK_PUBLIC_KEY = 'pk_live_b0bfb74586cc0bb41f357e2cbb88ce67b4cac719';
const PAYSTACK_PLAN_CODE = 'PLN_ipza7t5sg17rkl2';

interface PaystackConfig {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, any>;
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
      callback: (response: any) => {
        setLoading(false);
        config.onSuccess?.(response.reference);
      },
    });

    handler.openIframe();
  };

  const subscribeToPro = (onSuccess?: (reference: string) => void, onCancel?: () => void) => {
    if (!user) return;
    
    const reference = `sub_${user.uid}_${Date.now()}`;
    
    initializePayment({
      email: user.email,
      amount: 5000,
      reference,
      metadata: {
        userId: user.uid,
        plan: 'pro',
        type: 'subscription',
      },
      onSuccess,
      onCancel,
    });
  };

  const purchaseTopUp = (
    batchCount: number,
    onSuccess?: (reference: string) => void,
    onCancel?: () => void
  ) => {
    if (!user) return;
    
    // Updated pricing: ₦250 for 200 credits
    const amount = batchCount * 250;
    const exports = batchCount * 200;
    const reference = `topup_${user.uid}_${Date.now()}`;
    
    initializePayment({
      email: user.email,
      amount,
      reference,
      metadata: {
        userId: user.uid,
        type: 'topup',
        batchCount,
        exportsAdded: exports,
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
    PAYSTACK_PLAN_CODE,
  };
}

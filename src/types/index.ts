export interface User {
  uid: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  billingCycle?: 'monthly' | 'yearly';
  monthlyExports: number;
  exportsUsed: number;
  topupExports: number;
  freeExportsTotal: number;
  freeExportsUsed: number;
  planStartDate: Date;
  nextReset: Date;
  paystackCustomerId?: string;
  referralCode: string;
  referredBy?: string;
  referralEarnings: number;
  referralCount: number;
  createdAt: Date;
}

export interface Contact {
  id: string;
  number: string;
  country: string;
  flag: string;
  tag: string;
  notes: string;
  name?: string;
  isFavorite: boolean;
  group?: string;
  sourceFile: string;
  extractionId: string;
  createdAt: Date;
}

export interface Extraction {
  id: string;
  filename: string;
  totalFound: number;
  duplicatesRemoved: number;
  newContacts: number;
  exportsConsumed: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  type: 'subscription' | 'topup';
  amount: number;
  description: string;
  exportsAdded: number;
  paystackRef: string;
  status: 'success' | 'pending' | 'failed';
  createdAt: Date;
}

export interface ExtractedNumber {
  number: string;
  country: string;
  flag: string;
  isDuplicate: boolean;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredUserName: string;
  status: 'pending' | 'active';
  totalEarnings: number;
  createdAt: Date;
}

export interface ReferralEarning {
  id: string;
  referralId: string;
  transactionId: string;
  purchaseAmount: number;
  commission: number;
  type: 'topup' | 'subscription';
  status: 'pending' | 'credited';
  createdAt: Date;
}

export interface TopUpTier {
  id: string;
  name: string;
  credits: number;
  price: number;
  perCredit: number;
  savings?: string;
  badge?: string;
  popular?: boolean;
  bestValue?: boolean;
}

export const TOP_UP_TIERS: TopUpTier[] = [
  { id: 'starter', name: 'Starter', credits: 200, price: 500, perCredit: 2.50 },
  { id: 'popular', name: 'Popular', credits: 500, price: 1000, perCredit: 2.00, savings: '20%', badge: 'Most Popular', popular: true },
  { id: 'growth', name: 'Growth', credits: 1000, price: 1500, perCredit: 1.50, savings: '40%', badge: 'Best Value', bestValue: true },
  { id: 'business', name: 'Business', credits: 2500, price: 3000, perCredit: 1.20, savings: '52%', badge: 'Max Savings' },
  { id: 'enterprise', name: 'Enterprise', credits: 5000, price: 5000, perCredit: 1.00, savings: '60%', badge: 'Mega Deal' },
];

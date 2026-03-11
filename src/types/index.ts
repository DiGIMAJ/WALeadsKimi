export interface User {
  uid: string;
  name: string;
  email: string;
  plan: 'free' | 'pro';
  monthlyExports: number;
  exportsUsed: number;
  topupExports: number;
  planStartDate: Date;
  nextReset: Date;
  paystackCustomerId?: string;
  createdAt: Date;
}

export interface Contact {
  id: string;
  number: string;
  country: string;
  flag: string;
  tag: string;
  notes: string;
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

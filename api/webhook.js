/**
 * WALeads Paystack Webhook Handler
 * Vercel Serverless Function
 * 
 * Handles Paystack webhook events for payments and subscriptions
 */

const crypto = require('crypto');

// Firebase Admin SDK - initialized without credentials for Vercel
// You'll need to add FIREBASE_SERVICE_ACCOUNT env var
let admin;
let db;

function initFirebase() {
  if (!admin) {
    admin = require('firebase-admin');
    
    if (!admin.apps.length) {
      // Check if we have service account credentials
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : null;
      
      if (serviceAccount) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
        // Try to use application default credentials
        admin.initializeApp();
      }
    }
    
    db = admin.firestore();
  }
  return { admin, db };
}

/**
 * Verify Paystack webhook signature
 */
function verifyWebhookSignature(body, signature, secret) {
  const hash = crypto
    .createHmac('sha512', secret)
    .update(JSON.stringify(body))
    .digest('hex');
  return hash === signature;
}

/**
 * Calculate next reset date (45 days from now)
 */
function getNextResetDate(admin) {
  const date = new Date();
  date.setDate(date.getDate() + 45);
  return admin.firestore.Timestamp.fromDate(date);
}

/**
 * Handle successful charge (one-time payments for top-ups)
 */
async function handleChargeSuccess(data, db, admin) {
  const metadata = data.metadata || {};
  const userId = metadata.userId;
  
  if (!userId) {
    console.error('No userId in metadata');
    return { error: 'No userId' };
  }

  const userRef = db.collection('users').doc(userId);
  
  // Check if transaction already processed (idempotency)
  const existingTx = await userRef
    .collection('transactions')
    .where('paystackRef', '==', data.reference)
    .get();
    
  if (!existingTx.empty) {
    console.log('Transaction already processed:', data.reference);
    return { alreadyProcessed: true };
  }

  if (metadata.type === 'topup') {
    const exportsAdded = metadata.exportsAdded || 0;
    
    // Update user topup credits
    await userRef.update({
      topupExports: admin.firestore.FieldValue.increment(exportsAdded)
    });
    
    // Record transaction
    await userRef.collection('transactions').add({
      type: 'topup',
      amount: data.amount / 100,
      description: metadata.description || `Top-up: ${exportsAdded} credits`,
      exportsAdded: exportsAdded,
      paystackRef: data.reference,
      status: 'success',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Top-up successful: ${exportsAdded} credits added to user ${userId}`);
    return { success: true, type: 'topup', exportsAdded };
  }
  
  if (metadata.type === 'subscription') {
    // Update user to Pro plan
    await userRef.update({
      plan: 'pro',
      monthlyExports: 7500,
      exportsUsed: 0,
      paystackCustomerId: data.customer?.id?.toString(),
      planStartDate: admin.firestore.FieldValue.serverTimestamp(),
      nextReset: getNextResetDate(admin)
    });
    
    // Record transaction
    await userRef.collection('transactions').add({
      type: 'subscription',
      amount: data.amount / 100,
      description: 'Pro Plan Subscription',
      exportsAdded: 7500,
      paystackRef: data.reference,
      status: 'success',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Subscription successful: User ${userId} upgraded to Pro`);
    return { success: true, type: 'subscription' };
  }
  
  return { success: false, reason: 'Unknown type' };
}

/**
 * Handle new subscription creation
 */
async function handleSubscriptionCreate(data, db, admin) {
  const customer = data.customer;
  
  if (!customer || !customer.email) {
    console.error('No customer email in subscription data');
    return { error: 'No customer email' };
  }

  // Find user by email
  const usersSnapshot = await db
    .collection('users')
    .where('email', '==', customer.email)
    .limit(1)
    .get();
    
  if (usersSnapshot.empty) {
    console.error('No user found with email:', customer.email);
    return { error: 'User not found' };
  }

  const userDoc = usersSnapshot.docs[0];
  
  await userDoc.ref.update({
    plan: 'pro',
    paystackCustomerId: customer.customer_code,
    paystackSubscriptionCode: data.subscription_code,
    paystackSubscriptionId: data.id?.toString(),
    planStartDate: admin.firestore.FieldValue.serverTimestamp(),
    nextReset: getNextResetDate(admin)
  });
  
  console.log(`Subscription created for user: ${userDoc.id}`);
  return { success: true, userId: userDoc.id };
}

/**
 * Handle successful invoice payment (recurring subscriptions)
 */
async function handleInvoicePaymentSucceeded(data, db, admin) {
  const customer = data.customer;
  
  if (!customer || !customer.email) {
    console.error('No customer email in invoice data');
    return { error: 'No customer email' };
  }

  // Find user by email
  const usersSnapshot = await db
    .collection('users')
    .where('email', '==', customer.email)
    .limit(1)
    .get();
    
  if (usersSnapshot.empty) {
    console.error('No user found with email:', customer.email);
    return { error: 'User not found' };
  }

  const userDoc = usersSnapshot.docs[0];
  
  // Reset monthly exports
  await userDoc.ref.update({
    exportsUsed: 0,
    nextReset: getNextResetDate(admin)
  });
  
  // Record transaction
  await userDoc.ref.collection('transactions').add({
    type: 'subscription',
    amount: data.amount / 100,
    description: 'Pro Plan Subscription - Renewal',
    exportsAdded: 7500,
    paystackRef: data.transaction?.reference || data.reference,
    status: 'success',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  console.log(`Subscription renewed for user: ${userDoc.id}`);
  return { success: true, userId: userDoc.id };
}

/**
 * Handle subscription cancellation/disable
 */
async function handleSubscriptionDisable(data, db) {
  const customer = data.customer;
  
  if (!customer || !customer.email) {
    console.error('No customer email in subscription data');
    return { error: 'No customer email' };
  }

  // Find user by email
  const usersSnapshot = await db
    .collection('users')
    .where('email', '==', customer.email)
    .limit(1)
    .get();
    
  if (usersSnapshot.empty) {
    console.error('No user found with email:', customer.email);
    return { error: 'User not found' };
  }

  const userDoc = usersSnapshot.docs[0];
  
  // Downgrade to free plan
  await userDoc.ref.update({
    plan: 'free',
    monthlyExports: 25,
    paystackSubscriptionCode: null,
    paystackSubscriptionId: null
  });
  
  console.log(`Subscription disabled for user: ${userDoc.id}`);
  return { success: true, userId: userDoc.id };
}

// Main handler
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-paystack-signature');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  
  if (!paystackSecret) {
    console.error('PAYSTACK_SECRET_KEY not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  // Verify webhook signature
  const signature = req.headers['x-paystack-signature'];
  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  if (!verifyWebhookSignature(req.body, signature, paystackSecret)) {
    console.error('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;
  console.log('Received Paystack event:', event.event);

  try {
    const { admin, db } = initFirebase();
    let result;

    switch (event.event) {
      case 'charge.success':
        result = await handleChargeSuccess(event.data, db, admin);
        break;
        
      case 'subscription.create':
        result = await handleSubscriptionCreate(event.data, db, admin);
        break;
        
      case 'invoice.payment_succeeded':
        result = await handleInvoicePaymentSucceeded(event.data, db, admin);
        break;
        
      case 'subscription.disable':
        result = await handleSubscriptionDisable(event.data, db);
        break;
        
      default:
        console.log('Unhandled event type:', event.event);
        result = { unhandled: true, event: event.event };
    }

    return res.status(200).json({ received: true, result });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

/**
 * WALeads Paystack Webhook Handler
 * Vercel Serverless Function
 * 
 * Handles Paystack webhook events for payments and subscriptions
 * Includes referral commission calculation (15% airtime)
 */

const crypto = require('crypto');

// Firebase Admin SDK
let admin;
let db;

function initFirebase() {
  if (!admin) {
    admin = require('firebase-admin');
    
    if (!admin.apps.length) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : null;
      
      if (serviceAccount) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
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
 * Process referral commission (15% of payment amount)
 */
async function processReferralCommission(userId, paymentAmount, transactionType, transactionId, db, admin) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return null;

    const userData = userDoc.data();
    const referrerId = userData.referredBy;

    if (!referrerId) return null;

    const commission = Math.round(paymentAmount * 0.15); // 15% commission

    // Update referrer's earnings
    await db.collection('users').doc(referrerId).update({
      referralEarnings: admin.firestore.FieldValue.increment(commission),
    });

    // Find the referral doc and update its earnings + status
    const referralsQuery = await db.collection('users').doc(referrerId)
      .collection('referrals')
      .where('referredUserId', '==', userId)
      .limit(1)
      .get();

    let referralId = null;
    if (!referralsQuery.empty) {
      const referralDoc = referralsQuery.docs[0];
      referralId = referralDoc.id;
      await referralDoc.ref.update({
        status: 'active',
        totalEarnings: admin.firestore.FieldValue.increment(commission),
      });
    }

    // Create ReferralEarning document
    await db.collection('users').doc(referrerId).collection('referralEarnings').add({
      referralId: referralId,
      transactionId: transactionId,
      purchaseAmount: paymentAmount,
      commission: commission,
      type: transactionType,
      status: 'credited',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Referral commission: ${commission} kobo credited to ${referrerId} from user ${userId}`);
    return { referrerId, commission };
  } catch (error) {
    console.error('Error processing referral commission:', error);
    return null;
  }
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
    const tierName = metadata.tierName || 'Top-up';
    const description = metadata.description || `Top-up: ${exportsAdded} credits (${tierName})`;
    
    // Update user topup credits
    await userRef.update({
      topupExports: admin.firestore.FieldValue.increment(exportsAdded)
    });
    
    // Record transaction
    const txRef = await userRef.collection('transactions').add({
      type: 'topup',
      amount: data.amount / 100,
      description: description,
      exportsAdded: exportsAdded,
      paystackRef: data.reference,
      status: 'success',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Process referral commission
    await processReferralCommission(userId, data.amount, 'topup', txRef.id, db, admin);
    
    console.log(`Top-up successful: ${exportsAdded} credits added to user ${userId}`);
    return { success: true, type: 'topup', exportsAdded };
  }
  
  if (metadata.type === 'subscription') {
    const billingCycle = metadata.billingCycle || 'monthly';
    
    // Update user to Pro plan with unlimited exports
    await userRef.update({
      plan: 'pro',
      billingCycle: billingCycle,
      monthlyExports: 999999, // Unlimited
      exportsUsed: 0,
      paystackCustomerId: data.customer?.id?.toString(),
      planStartDate: admin.firestore.FieldValue.serverTimestamp(),
      nextReset: getNextResetDate(admin)
    });
    
    // Record transaction
    const txRef = await userRef.collection('transactions').add({
      type: 'subscription',
      amount: data.amount / 100,
      description: `Pro Plan Subscription (${billingCycle})`,
      exportsAdded: 0,
      paystackRef: data.reference,
      status: 'success',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Process referral commission
    await processReferralCommission(userId, data.amount, 'subscription', txRef.id, db, admin);
    
    console.log(`Subscription successful: User ${userId} upgraded to Pro (${billingCycle})`);
    return { success: true, type: 'subscription', billingCycle };
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
    monthlyExports: 999999, // Unlimited
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
  
  // Reset exports for unlimited
  await userDoc.ref.update({
    exportsUsed: 0,
    nextReset: getNextResetDate(admin)
  });
  
  // Record transaction
  const txRef = await userDoc.ref.collection('transactions').add({
    type: 'subscription',
    amount: data.amount / 100,
    description: 'Pro Plan Subscription - Renewal',
    exportsAdded: 0,
    paystackRef: data.transaction?.reference || data.reference,
    status: 'success',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Process referral commission for renewal
  await processReferralCommission(userDoc.id, data.amount, 'subscription', txRef.id, db, admin);
  
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
    billingCycle: null,
    monthlyExports: 50,
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

// pages/api/webhooks/stripe-with-dashboard.ts
import { buffer } from 'micro';
import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next';
import { webhookService, DonationWebhookPayload } from '@/lib/webhook';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook signature verification failed`);
  }

  console.log('Received webhook event:', event.type);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(paymentIntent);
        break;
      }
      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        await handleDispute(dispute);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing successful payment:', paymentIntent.id);
  
  const { metadata } = paymentIntent;
  
  // Build webhook payload from Stripe metadata
  const webhookPayload: DonationWebhookPayload = {
    organizationId: metadata.organizationId,
    widgetId: metadata.widgetId || 'default',
    donationId: metadata.donationId,
    amount: parseInt(metadata.originalAmount || '0'),
    currency: paymentIntent.currency.toUpperCase(),
    frequency: metadata.monthly === 'true' ? 'monthly' : 'one-time',
    cause: {
      name: metadata.cause || 'General Support',
      id: metadata.causeId
    },
    donor: {
      email: metadata.donorEmail,
      name: metadata.donorName
    },
    paymentMethod: metadata.paymentMethod as 'card' | 'bank' || 'card',
    coversFees: metadata.coversFees === 'true',
    feeAmount: parseInt(metadata.feeAmount || '0'),
    stripePaymentIntentId: paymentIntent.id,
    status: 'succeeded',
    createdAt: new Date(paymentIntent.created * 1000).toISOString()
  };

  // Send webhook to dashboard
  try {
    await webhookService.sendDonationWebhook(webhookPayload);
    console.log('Successfully sent donation webhook to dashboard');
  } catch (error) {
    console.error('Failed to send donation webhook:', error);
    // Could implement retry logic here
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing failed payment:', paymentIntent.id);
  
  const { metadata } = paymentIntent;
  
  const webhookPayload: DonationWebhookPayload = {
    organizationId: metadata.organizationId,
    widgetId: metadata.widgetId || 'default',
    donationId: metadata.donationId,
    amount: parseInt(metadata.originalAmount || '0'),
    currency: paymentIntent.currency.toUpperCase(),
    frequency: metadata.monthly === 'true' ? 'monthly' : 'one-time',
    cause: {
      name: metadata.cause || 'General Support',
      id: metadata.causeId
    },
    donor: {
      email: metadata.donorEmail,
      name: metadata.donorName
    },
    paymentMethod: metadata.paymentMethod as 'card' | 'bank' || 'card',
    coversFees: metadata.coversFees === 'true',
    feeAmount: parseInt(metadata.feeAmount || '0'),
    stripePaymentIntentId: paymentIntent.id,
    status: 'failed',
    createdAt: new Date(paymentIntent.created * 1000).toISOString(),
    failureReason: paymentIntent.last_payment_error?.message
  };

  // Send failure webhook to dashboard
  try {
    await webhookService.sendDonationWebhook(webhookPayload);
    console.log('Successfully sent failure webhook to dashboard');
  } catch (error) {
    console.error('Failed to send failure webhook:', error);
  }
}

async function handleDispute(dispute: Stripe.Dispute) {
  console.log('Processing dispute:', dispute.id);
  
  // Could send dispute notification to dashboard
  // This would be a separate webhook endpoint for disputes
  try {
    const disputePayload = {
      type: 'dispute_created',
      disputeId: dispute.id,
      amount: dispute.amount,
      currency: dispute.currency.toUpperCase(),
      reason: dispute.reason,
      status: dispute.status,
      createdAt: new Date(dispute.created * 1000).toISOString()
    };
    
    // Send dispute webhook (would need separate endpoint)
    console.log('Dispute payload prepared:', disputePayload);
  } catch (error) {
    console.error('Failed to process dispute:', error);
  }
}
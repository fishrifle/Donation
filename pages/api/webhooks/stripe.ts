// /api/webhooks/stripe.ts
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("🔥 WEBHOOK RECEIVED:", req.method);
   console.log("🔍 Headers:", Object.keys(req.headers));
  console.log("🔍 Stripe-Signature header:", req.headers['stripe-signature']);

  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      // Get raw body buffer
      const rawBody = await buffer(req);

      console.log("📝 Webhook signature present:", !!sig);
      console.log("🔑 Webhook secret configured:", !!endpointSecret);

      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
      console.log("✅ Webhook event verified:", event.type);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      return res.status(400).send(`Webhook Error: ${err}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          "💰 Payment succeeded:",
          paymentIntent.id,
          "$" + paymentIntent.amount / 100
        );
        break;
      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        console.log("🔄 Monthly payment succeeded:", invoice.id);
        break;
      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log("❌ Monthly payment failed:", failedInvoice.id);
        break;
      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription;
        console.log("🚫 Subscription cancelled:", subscription.id);
        break;
      default:
        console.log(`📋 Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// pages/api/confirm-subscription.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

type RequestBody = {
  subscriptionId: string;
};

type ErrorResponse = { error: string };
type SuccessResponse = { 
  success: boolean;
  subscription: Stripe.Subscription;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subscriptionId } = req.body as RequestBody;

  try {
    // Retrieve the subscription to check its status
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (subscription.status === 'active' || subscription.status === 'trialing') {
      return res.status(200).json({ success: true, subscription });
    } else {
      return res.status(400).json({ error: 'Subscription not active' });
    }
  } catch (error: unknown) {
    console.error('Subscription confirmation error:', error);
    const message =
      error instanceof Error ? error.message : "Failed to confirm subscription";
    return res.status(500).json({ error: message });
  }
}
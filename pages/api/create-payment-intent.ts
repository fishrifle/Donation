// pages/api/create-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

type RequestBody = {
  amount: number;
  isMonthly: boolean;
  paymentMethod: "card" | "bank";
  cause: string;
};

type ErrorResponse = { error: string };
type SuccessResponse = { clientSecret: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, isMonthly, paymentMethod, cause } = req.body as RequestBody;

  try {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types:
        paymentMethod === "bank" ? ["us_bank_account"] : ["card"],
      metadata: { cause, monthly: isMonthly.toString() },
      ...(isMonthly && { setup_future_usage: "off_session" }), // Allow card reuse
    });

    return res.status(200).json({ clientSecret: intent.client_secret! });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ error: message });
  }
}

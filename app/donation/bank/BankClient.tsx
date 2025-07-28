// app/donation/bank/BankClient.tsx
"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSearchParams, useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHeightMonitor } from "@/hooks/useHeightMonitor";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function BankClient() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isSubscription, setIsSubscription] = useState(false);
  const params = useSearchParams();
  // const router = useRouter()

  const amt = parseInt(params?.get("amt") ?? "0", 10) || 0;
  const monthly = params?.get("monthly") === "true";
  const cause = params?.get("cause") ?? "";

  // build queryString for BackButton
  const entries = params ? Array.from(params.entries()) : [];
  const queryString =
    entries.length > 0
      ? "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")
      : "";

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amt * 100,
        isMonthly: monthly,
        paymentMethod: "bank",
        cause,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setSubscriptionId(data.subscriptionId);
        setIsSubscription(data.isSubscription);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to initialize bank payment.");
      });
  }, [amt, monthly, cause]);

  if (!clientSecret) {
    return <div className="p-6 text-center">Loading bank payment form…</div>;
  }

  return (
    <>
      <ToastContainer position="top-center" />
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <BankForm 
          queryString={queryString} 
          amt={amt}
          subscriptionId={subscriptionId}
          isSubscription={isSubscription}
          monthly={monthly}
        />
      </Elements>
    </>
  );
}

function BankForm({ 
  queryString, 
  amt,
  subscriptionId, 
  isSubscription,
  monthly 
}: { 
  queryString: string;
  amt: number;
  subscriptionId: string | null;
  isSubscription: boolean;
  monthly: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  // Monitor height changes and notify parent window
  const containerRef = useHeightMonitor<HTMLFormElement>([stripe, elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.warn("Stripe is still loading…");
      return;
    }

    if (isSubscription && subscriptionId) {
      // Handle subscription confirmation
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Subscription setup failed.");
      } else {
        // Confirm the subscription after successful payment
        try {
          const response = await fetch("/api/confirm-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscriptionId }),
          });

          if (response.ok) {
            toast.success("Monthly subscription set up successfully!");
            setTimeout(() => router.push("/donation"), 1500);
          } else {
            toast.error("Failed to confirm subscription.");
          }
        } catch {
          toast.error("Failed to confirm subscription.");
        }
      }
    } else {
      // Handle one-time payment
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Bank payment failed.");
      } else {
        toast.success("Bank payment successful!");
        setTimeout(() => router.push(`/donation/success?amt=${amt}&monthly=${monthly}`), 1500);;
      }
    }
  };

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow space-y-4"
    >
      <h2 className="text-xl font-bold">
        {monthly ? "Monthly " : "One-time "}Bank (ACH) Payment
      </h2>
      <PaymentElement className="border p-2 rounded" />
      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
      >
        {monthly ? "Set up Monthly Payment" : "Pay with Bank"}
      </button>
      <BackButton href={`/donation${queryString}`}>Back</BackButton>
    </form>
  );
}
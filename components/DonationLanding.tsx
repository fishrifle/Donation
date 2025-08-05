"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHeightMonitor } from "@/hooks/useHeightMonitor";

export default function DonationLanding() {
  const [frequency, setFrequency] = useState<"one-time" | "monthly" | "yearly">(
    "one-time"
  );
  const [preset, setPreset] = useState<number | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherAmount, setOtherAmount] = useState("");
  const [giftDesignation, setGiftDesignation] = useState("General Persevere Support");
  const [addNote, setAddNote] = useState(false);
  const [giveInHonor, setGiveInHonor] = useState(false);
  const [coverFee, setCoverFee] = useState(false);
  const router = useRouter();
  
  // Monitor height changes and notify parent window
  const containerRef = useHeightMonitor([frequency, preset, showOtherInput, giftDesignation, addNote, giveInHonor, coverFee]);

  const presetAmounts = [
    { amount: 25, description: "Empower Life Skills" },
    { amount: 50, description: "Can Strengthen Career Development" },
    { amount: 100, description: "Can Empower A Participant's Pathway" },
    { amount: 250, description: "Unlock's Support for Families" },
    { amount: 500, description: "Comprehensive Career Support" },
    { amount: 1000, description: "Transform Lives with Tech Skills" }
  ];

  const chosenAmount = showOtherInput ? Number(otherAmount) || 0 : preset || 0;
  const canProceed = chosenAmount > 0;

  const navigate = (method: "card" | "bank") => {
    if (!canProceed) return;
    
    const queryParams = new URLSearchParams({
      amt: chosenAmount.toString(),
      monthly: (frequency === "monthly").toString(),
      yearly: (frequency === "yearly").toString(),
      cause: giftDesignation,
      addNote: addNote.toString(),
      giveInHonor: giveInHonor.toString(),
      coverFee: coverFee.toString()
    });
    
    router.push(`/donation/${method}?${queryParams.toString()}`);
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    const num = digits === "" ? "" : Math.min(Math.max(Number(digits), 1), 100000);
    setOtherAmount(String(num));
  };

  const giftOptions = [
    "General Persevere Support",
    "Sponsor a Dev",
    "Tech Alliance", 
    "The Greatest Need",
    "Unlock Potential",
    "Epic Youth",
    "Tennessee Community Programs",
    "Canvas Training Hub"
  ];

  return (
    <div ref={containerRef} className="bg-white rounded-lg border border-gray-200 p-3 space-y-2 w-full max-w-xs mx-auto text-xs">
      {/* Persevere Header */}
      <div className="text-center">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Persevere</h1>
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-gray-800">Choose amount</h2>
        </div>
      </div>

      {/* Frequency Toggle */}
      <div className="flex bg-gray-100 rounded p-0.5">
        <button
          onClick={() => setFrequency("one-time")}
          className={`flex-1 py-1 px-1.5 text-xs font-medium rounded transition-colors ${
            frequency === "one-time"
              ? "bg-blue-500 text-white"
              : "text-gray-600"
          }`}
        >
          One-time
        </button>
        <button
          onClick={() => setFrequency("monthly")}
          className={`flex-1 py-1 px-1.5 text-xs font-medium rounded transition-colors ${
            frequency === "monthly"
              ? "bg-blue-500 text-white"
              : "text-gray-600"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setFrequency("yearly")}
          className={`flex-1 py-1 px-1.5 text-xs font-medium rounded transition-colors ${
            frequency === "yearly"
              ? "bg-blue-500 text-white"
              : "text-gray-600"
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Preset Amount Grid */}
      <div className="grid grid-cols-2 gap-1">
        {presetAmounts.map((item) => (
          <button
            key={item.amount}
            onClick={() => {
              setShowOtherInput(false);
              setPreset(item.amount);
            }}
            className={`p-2 rounded border text-left transition-all ${
              preset === item.amount
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="font-bold text-sm text-gray-900">${item.amount}</div>
            <div className="text-xs text-gray-600 leading-tight">{item.description}</div>
          </button>
        ))}
      </div>

      {/* Other Amount */}
      <div className="space-y-1">
        <button
          onClick={() => {
            setShowOtherInput(!showOtherInput);
            setPreset(null);
          }}
          className={`w-full p-2 rounded border text-left ${
            showOtherInput
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-600">$</span>
              <span className="text-sm font-medium text-gray-600">Other</span>
            </div>
            <span className="text-xs text-gray-500">USD</span>
          </div>
        </button>

        {showOtherInput && (
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">$</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter amount"
              value={otherAmount}
              onChange={handleOtherChange}
              className="w-full pl-6 pr-8 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">USD</span>
          </div>
        )}
      </div>

      {/* Designate your gift */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">
          Designate your gift
        </label>
        <select
          value={giftDesignation}
          onChange={(e) => setGiftDesignation(e.target.value)}
          className="w-full p-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          {giftOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Optional Checkboxes */}
      <div className="space-y-1">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={addNote}
            onChange={(e) => setAddNote(e.target.checked)}
            className="w-3 h-3 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-xs text-gray-700">Add note/comment</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={giveInHonor}
            onChange={(e) => setGiveInHonor(e.target.checked)}
            className="w-3 h-3 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-xs text-gray-700">Give in honor/memory</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={coverFee}
            onChange={(e) => setCoverFee(e.target.checked)}
            className="w-3 h-3 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-xs text-gray-700">Cover payment fees (3%)</span>
        </label>
      </div>

      {/* Payment Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate("card")}
          disabled={!canProceed}
          className={`flex-1 py-2 px-3 text-xs rounded font-medium transition-colors ${
            canProceed
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Pay with Card
        </button>
        <button
          onClick={() => navigate("bank")}
          disabled={!canProceed}
          className={`flex-1 py-2 px-3 text-xs rounded font-medium transition-colors ${
            canProceed
              ? "bg-purple-500 hover:bg-purple-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Pay via Bank
        </button>
      </div>

      {/* Copyright */}
      <div className="text-center pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Copyright 2025 Banyan Labs
        </p>
      </div>
    </div>
  );
}
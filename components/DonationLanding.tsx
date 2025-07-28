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

  const navigate = () => {
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
    
    router.push(`/donation/card?${queryParams.toString()}`);
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
    <div ref={containerRef} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 w-full max-w-md mx-auto">
      {/* Header with checkmark */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Choose amount</h2>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Persevere</h1>
      </div>

      {/* Frequency Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setFrequency("one-time")}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            frequency === "one-time"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          One-time
        </button>
        <button
          onClick={() => setFrequency("monthly")}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            frequency === "monthly"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setFrequency("yearly")}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            frequency === "yearly"
              ? "bg-blue-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Preset Amount Grid */}
      <div className="grid grid-cols-2 gap-3">
        {presetAmounts.map((item) => (
          <button
            key={item.amount}
            onClick={() => {
              setShowOtherInput(false);
              setPreset(item.amount);
            }}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              preset === item.amount
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          >
            <div className="font-bold text-lg text-gray-900">${item.amount}</div>
            <div className="text-sm text-gray-600 mt-1">{item.description}</div>
          </button>
        ))}
      </div>

      {/* Other Amount */}
      <div className="space-y-2">
        <button
          onClick={() => {
            setShowOtherInput(!showOtherInput);
            setPreset(null);
          }}
          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
            showOtherInput
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-gray-50 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-gray-600">$</span>
              <span className="text-lg font-medium text-gray-600">Other</span>
            </div>
            <span className="text-sm text-gray-500">USD</span>
          </div>
        </button>

        {showOtherInput && (
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter amount"
              value={otherAmount}
              onChange={handleOtherChange}
              className="w-full pl-8 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">USD</span>
          </div>
        )}
      </div>

      {/* Designate your gift */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Designate your gift
        </label>
        <select
          value={giftDesignation}
          onChange={(e) => setGiftDesignation(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {giftOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Optional Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={addNote}
            onChange={(e) => setAddNote(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Add note/comment</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={giveInHonor}
            onChange={(e) => setGiveInHonor(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Give in honor/memory</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={coverFee}
            onChange={(e) => setCoverFee(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Cover payment fees (3%)</span>
        </label>
      </div>

      {/* Continue Button */}
      <button
        onClick={navigate}
        disabled={!canProceed}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          canProceed
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Continue
      </button>

      {/* Copyright */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Copyright 2025 Banyan Labs
        </p>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHeightMonitor } from "@/hooks/useHeightMonitor";

export default function DonationLanding() {
  const [frequency, setFrequency] = useState<"one-time" | "monthly">(
    "one-time"
  );
  const [preset, setPreset] = useState<number | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherAmount, setOtherAmount] = useState("");
  const [cause, setCause] = useState("Sponsor a Dev");
  const [coverFee, setCoverFee] = useState(false);
  const router = useRouter();
  
  // Monitor height changes and notify parent window
  const containerRef = useHeightMonitor([frequency, preset, showOtherInput, cause, coverFee]);

  const presets = [10, 30, 60, 100, 200] as const;
  const chosenAmount = showOtherInput ? Number(otherAmount) || 0 : preset || 0;
  const canProceed = chosenAmount > 0;

  const navigate = (method: "card" | "bank") => {
    if (!canProceed) return;
    router.push(
      `/donation/${method}?amt=${chosenAmount}&monthly=${
        frequency === "monthly"
      }&cause=${encodeURIComponent(cause)}&coverFee=${coverFee}`
    );
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // numeric‐only, clamp 1–100000
    const digits = e.target.value.replace(/\D/g, "");
    const num =
      digits === "" ? "" : Math.min(Math.max(Number(digits), 1), 100000);
    setOtherAmount(String(num));
  };

  return (
    <div ref={containerRef} className="rounded-2xl shadow-lg p-6 space-y-6 w-full">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center text-blue-800">PassItOn</h2>

      {/* Frequency Toggle */}
      <div className="flex rounded-full bg-white overflow-hidden">
        <button
          onClick={() => setFrequency("one-time")}
          className={`flex-1 py-2 text-center font-medium cursor-pointer transition-colors ${
            frequency === "one-time"
              ? "bg-blue-600 text-white"
              : "text-gray-900"
          }`}
        >
          One-time
        </button>
        <button
          onClick={() => setFrequency("monthly")}
          className={`flex-1 py-2 text-center font-medium cursor-pointer transition-colors ${
            frequency === "monthly"
              ? "bg-purple-700 text-white"
              : "text-gray-900"
          }`}
        >
          Monthly
        </button>
      </div>
      {frequency === "monthly" && (
  <div className="text-sm text-blue-700 bg-blue-100 border border-blue-300 rounded-md p-3 mt-2">
    This will be a <strong>monthly recurring charge</strong>. You can cancel at any time.
  </div>
)}


      {/* 3×2 Preset Grid */}
      <div className="grid grid-cols-3 gap-4">
        {presets.slice(0, 3).map((v) => (
          <button
            key={v}
            onClick={() => {
              setShowOtherInput(false);
              setPreset(v);
            }}
            className={`py-3 rounded-xl font-semibold cursor-pointer transition-colors ${
              preset === v
                ? "bg-blue-600 text-gray-800"
                : "bg-blue-200 text-gray-800 hover:bg-purple-400"
            }`}
          >
            ${v}
          </button>
        ))}
        {presets.slice(3).map((v) => (
          <button
            key={v}
            onClick={() => {
              setShowOtherInput(false);
              setPreset(v);
            }}
            className={`py-3 rounded-xl font-semibold cursor-pointer transition-colors ${
              preset === v
                ? "bg-blue-600 text-gray-800"
                : "bg-blue-200 text-gray-800 hover:bg-purple-400"
            }`}
          >
            ${v}
          </button>
        ))}
        <button
          onClick={() => {
            setShowOtherInput((o) => !o);
            setPreset(null);
          }}
          className={`py-3 rounded-xl font-semibold cursor-pointer transition-colors ${
            showOtherInput
              ? "bg-blue-600 text-gray-800"
              : "bg-blue-200 text-gray-800 hover:bg-purple-400"
          }`}
        >
          Other
        </button>
      </div>

      {/* Other input row */}
      {showOtherInput && (
        <div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter your custom amount"
            value={otherAmount}
            onChange={handleOtherChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      )}

      {/* Cause Dropdown */}
      <select
        value={cause}
        onChange={(e) => setCause(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
      >
        <option>Sponsor a Dev</option>
        <option>Tech Alliance</option>
        <option>The Greatest Need</option>
        <option>Unlock Potential</option>
        <option>Epic Youth</option>
        <option>Tenneessee Community Programs</option>
        <option>Canvas Training Hub</option>

      </select>

      {/* Cover Fee */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={coverFee}
          onChange={() => setCoverFee((f) => !f)}
          className="cursor-pointer"
        />
        <span className="text-gray-700">Cover payment fees (3%)</span>
      </label>

      {/* Pay Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("card")}
          disabled={!canProceed}
          className={`flex-1 py-3 rounded-xl font-semibold text-white transition-colors ${
            canProceed
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Pay with Card
        </button>
        <button
          onClick={() => navigate("bank")}
          disabled={!canProceed}
          className={`flex-1 py-3 rounded-xl font-semibold text-white transition-colors ${
            canProceed
              ? "bg-purple-500 hover:bg-purple-600 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Pay via Bank
        </button>
    </div>
      </div>
  );
}

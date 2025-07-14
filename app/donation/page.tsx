// app/donation/page.tsx
"use client";

import DonateWidget from "@/components/DonateWidget";

export default function DonationPage() {
  return (
    <div>
      {/* initialOpen makes it pop immediately */}
      <DonateWidget initialOpen={true} />
    </div>
  );
}

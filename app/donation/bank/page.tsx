// app/donation/bank/page.tsx
"use client";

import { Suspense } from "react";
import BankClient from "./BankClient";

export default function BankPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <BankClient />
    </Suspense>
  );
}

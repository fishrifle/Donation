// app/donation/card/page.tsx
"use client";

import { Suspense } from "react";
import CardClient from "./CardClient";

export default function CardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <CardClient />
    </Suspense>
  );
}

// components/BackButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode } from "react";

interface BackButtonProps {
  /** If provided, clicking will push to this URL; otherwise falls back to router.back() */
  href?: string;
  children?: ReactNode;
}

export default function BackButton({ href, children }: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (href) router.push(href);
    else router.back();
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center text-sm text-gray-700 hover:text-gray-900 mb-4 cursor-pointer"

    >
      ← {children ?? "Back"}
    </button>
  );
}

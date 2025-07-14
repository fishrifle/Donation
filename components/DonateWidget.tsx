// components/DonateWidget.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DonationLanding from "./DonationLanding";

interface DonateWidgetProps {
  initialOpen?: boolean;
}

export default function DonateWidget({
  initialOpen = false,
}: DonateWidgetProps) {
  const [open, setOpen] = useState(initialOpen);

  // If initialOpen is true, hide the pill button permanently
  const showPill = !initialOpen;

  return (
    <>
      <AnimatePresence>
        {showPill && !open && (
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="
              bg-gradient-to-r from-blue-500 to-purple-600
              text-white font-bold py-3 px-6 rounded-full
              shadow-lg hover:shadow-xl
              transform transition duration-300
              cursor-pointer
            "
          >
            Donate
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
              <DonationLanding />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

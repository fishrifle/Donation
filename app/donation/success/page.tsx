"use client";
import { useEffect, useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import Confetti from "react-confetti";
import {format, addMonths} from 'date-fns';
import { Locale, enUS } from 'date-fns/locale';
import getLocale from '../../../utils/getLocale'

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  
  
  const amt = params?.get('amt') || "0";
  const monthly = params?.get("monthly") === "true";

    const [nextBilling, setNextBilling] = useState('')

    useEffect(() => {
      localStorage.removeItem('donationAmount')
    }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/donation"); 
    }, 7000);
    if (monthly && typeof window !== 'undefined') {
      const nextDate = addMonths(new Date(), 1)
      const lang = typeof navigator ||  'en-US'
     const {locale} = getLocale(lang);
     const formatted = format(nextDate, "d MMMM yyyy", { locale: locale as Locale || enUS })
      setNextBilling(formatted)
    }
    return () => clearTimeout(timer);
  }, [router, monthly]);


  return (
     <main className="min-h-screen flex flex-col justify-center items-center bg-white relative overflow-hidden">
     {typeof window !== 'undefined' && (
  <Confetti width={window.innerWidth} height={window.innerHeight} />
)}

      <div className="bg-white p-8 rounded-lg shadow-lg text-center z-10">
        <h1 className="text-3xl font-bold text-green-600 mb-2">Thank you!</h1>
        <p className="text-gray-700 text-lg mb-2">
          You donated <strong>${amt}</strong>
        </p>
        {monthly && (
          <p className="text-gray-700 text-sm mb-2">
            This is a <strong>monthly recurring donation</strong>. Your next charge will be on <strong>{nextBilling}</strong>
          </p>
        )}
        <p className="text-gray-500 text-sm">You’ll be redirected shortly...</p>
      </div>
    </main>
  );
}

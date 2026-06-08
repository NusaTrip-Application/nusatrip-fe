"use client";
import React, { useEffect, useState } from "react";
import { notification } from "@/lib/notification";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export default function NotificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info">("info");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const unsubscribe = notification.subscribe((event) => {
      setMessage(event.message);
      setType(event.type);
      setIsOpen(true);
      
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    });

    return () => {
      unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex animate-in slide-in-from-bottom-8 fade-in duration-300">
      <div className={`relative flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border text-[14px] font-bold ${
        type === "success" ? "bg-[#10B981] text-white border-[#059669]" :
        type === "error" ? "bg-error text-white border-[#B91C1C]" :
        "bg-[#2563EB] text-white border-[#1D4ED8]"
      }`}>
        {type === "success" && <CheckCircle2 size={20} />}
        {type === "error" && <XCircle size={20} />}
        {type === "info" && <Info size={20} />}
        <span className="whitespace-nowrap">{message}</span>
        <button onClick={() => setIsOpen(false)} className="ml-1 hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

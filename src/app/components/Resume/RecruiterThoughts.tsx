"use client";

import { useState, useEffect } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { cx } from "lib/cx";

const THOUGHTS = [
  { time: 6, text: "Scanning for name and contact info... Looks professional." },
  { time: 5, text: "Checking current role. Is the title relevant to what I need?" },
  { time: 4, text: "Glancing at dates. No major gaps? Good progression." },
  { time: 3, text: "Scanning bullet points for keywords and metrics..." },
  { time: 2, text: "Checking education. Does the degree match the requirements?" },
  { time: 1, text: "Final decision: Should I invite them for an interview?" },
];

export const RecruiterThoughts = ({ timeLeft }: { timeLeft: number }) => {
  const currentThought = THOUGHTS.find(t => t.time === timeLeft) || THOUGHTS[THOUGHTS.length - 1];

  return (
    <div className="absolute bottom-20 left-1/2 z-50 w-full max-w-xs -translate-x-1/2 px-4">
      <div className="animate-in fade-in slide-in-from-bottom-4 flex items-start gap-3 rounded-2xl bg-gray-900/95 p-4 text-white shadow-2xl backdrop-blur-md ring-1 ring-white/10">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500 shadow-lg shadow-purple-500/20">
          <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Recruiter's Mind</p>
          <p className="text-xs font-medium leading-relaxed italic">
            "{currentThought.text}"
          </p>
        </div>
      </div>
      {/* Animated progress bar for the thought duration */}
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div 
          className="h-full bg-purple-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(timeLeft / 6) * 100}%` }}
        />
      </div>
    </div>
  );
};
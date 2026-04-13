"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

export const ATSScoreBadge = () => {
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const score = useMemo(() => {
    if (!jd) return null;

    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have", "using", "work", "team"]);
    const jdWords = Array.from(new Set(jd.toLowerCase().match(/\b(\w{4,})\b/g) || []))
      .filter(word => !stopWords.has(word));

    const resumeText = JSON.stringify(resume).toLowerCase();
    const matches = jdWords.filter(word => resumeText.includes(word));
    
    return jdWords.length > 0 ? Math.round((matches.length / jdWords.length) * 100) : 0;
  }, [jd, resume]);

  if (score === null) return null;

  return (
    <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-sm border border-purple-100">
      <SparklesIcon className="h-4 w-4 text-purple-500" />
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">ATS Match:</span>
      <span className={`text-sm font-black ${score > 70 ? 'text-green-600' : score > 40 ? 'text-amber-500' : 'text-red-500'}`}>
        {score}%
      </span>
    </div>
  );
};
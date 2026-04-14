"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectJobDescription } from "lib/redux/aiSlice";
import { useMemo } from "react";
import { ChartBarSquareIcon } from "@heroicons/react/24/outline";

export const KeywordDensity = () => {
  const resume = useAppSelector(selectResume);
  const jd = useAppSelector(selectJobDescription);

  const density = useMemo(() => {
    const resumeText = JSON.stringify(resume).toLowerCase();
    const words = resumeText.match(/\b(\w{4,})\b/g) || [];
    
    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have", "using", "work", "team", "about", "after", "again", "against", "all", "and", "are", "but", "for", "had", "has", "not", "the", "was", "were"]);
    
    const freq: Record<string, number> = {};
    words.forEach(word => {
      if (!stopWords.has(word)) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [resume]);

  if (density.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ChartBarSquareIcon className="h-5 w-5 text-gray-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Keyword Density</h3>
      </div>
      
      <div className="space-y-3">
        {density.map(([word, count]) => {
          const isInJD = jd?.toLowerCase().includes(word);
          return (
            <div key={word} className="flex items-center gap-3">
              <div className="w-24 truncate text-xs font-bold text-gray-600 capitalize">{word}</div>
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div 
                  className={`h-full transition-all duration-1000 ${isInJD ? 'bg-sky-500' : 'bg-gray-300'}`}
                  style={{ width: `${(count / density[0][1]) * 100}%` }}
                />
              </div>
              <div className="w-8 text-right text-[10px] font-black text-gray-400">{count}x</div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[10px] text-gray-400 italic">
        Blue bars indicate keywords that also appear in your target Job Description.
      </p>
    </div>
  );
};
"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { useMemo } from "react";

export const JDWordCloud = () => {
  const jd = useAppSelector(selectJobDescription);

  const words = useMemo(() => {
    if (!jd) return [];

    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have", "using", "work", "team", "experience", "knowledge", "skills", "ability", "requirements", "responsibilities", "looking", "join", "company", "role", "position"]);
    const allWords = jd.toLowerCase().match(/\b(\w{4,})\b/g) || [];
    
    const freq: { [key: string]: number } = {};
    allWords.forEach(w => {
      if (!stopWords.has(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    });

    return Object.entries(freq)
      .map(([text, count]) => ({ text, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30);
  }, [jd]);

  if (words.length === 0) return null;

  const maxCount = Math.max(...words.map(w => w.count));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
        Job Description Word Cloud
      </h3>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {words.map(({ text, count }) => {
          const size = 0.75 + (count / maxCount) * 1.5;
          const opacity = 0.4 + (count / maxCount) * 0.6;
          
          return (
            <span
              key={text}
              className="cursor-default transition-all hover:scale-110 hover:text-indigo-600"
              style={{
                fontSize: `${size}rem`,
                fontWeight: count > maxCount / 2 ? 'bold' : 'normal',
                opacity: opacity,
                color: count === maxCount ? 'rgb(79, 70, 229)' : 'inherit'
              }}
            >
              {text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

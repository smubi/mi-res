"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { ChartBarIcon, SparklesIcon } from "@heroicons/react/24/outline";

export const QuantificationNudge = () => {
  const resume = useAppSelector(selectResume);

  const weakBullets = useMemo(() => {
    const allBullets = [
      ...resume.workExperiences.flatMap((w) => w.descriptions.map(d => ({ text: d, context: w.company }))),
      ...resume.projects.flatMap((p) => p.descriptions.map(d => ({ text: d, context: p.project }))),
    ];

    return allBullets
      .filter((b) => !/\d+%|\d+\s?percent|\$\d+|\d+\+/.test(b.text))
      .slice(0, 3);
  }, [resume]);

  if (weakBullets.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ChartBarIcon className="h-5 w-5 text-amber-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-amber-800">Quantification Nudge</h3>
      </div>
      
      <p className="mb-4 text-xs text-amber-700/70 leading-relaxed">
        These bullet points lack metrics. Adding numbers (%, $, #) makes your impact 3x more likely to be noticed by recruiters:
      </p>

      <div className="space-y-3">
        {weakBullets.map((bullet, idx) => (
          <div key={idx} className="group relative rounded-lg bg-white p-3 border border-amber-100 shadow-sm">
            <p className="text-[11px] font-medium text-gray-600 italic mb-1 opacity-60">{bullet.context}</p>
            <p className="text-xs text-gray-800 leading-relaxed pr-8">{bullet.text}</p>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <SparklesIcon className="h-3 w-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
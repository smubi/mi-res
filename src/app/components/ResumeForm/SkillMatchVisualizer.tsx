"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { 
  ChartBarIcon, 
  CheckBadgeIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

export const SkillMatchVisualizer = () => {
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const skillMatch = useMemo(() => {
    if (!jd) return null;

    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have", "using", "work", "team", "experience", "skills", "ability"]);
    const jdWords = Array.from(new Set(jd.toLowerCase().match(/\b(\w{4,})\b/g) || []))
      .filter(word => !stopWords.has(word));

    const resumeText = JSON.stringify(resume).toLowerCase();
    
    const matches = jdWords.map(word => {
      const count = (resumeText.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
      const frequencyInJD = (jd.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
      return { word, count, importance: frequencyInJD };
    }).sort((a, b) => b.importance - a.importance);

    return matches.slice(0, 12);
  }, [jd, resume]);

  if (!skillMatch) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ChartBarIcon className="h-5 w-5 text-purple-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Skill Match Strength</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {skillMatch.map((skill, idx) => (
          <div key={idx} className="flex flex-col gap-1.5 rounded-lg border border-gray-50 bg-gray-50/30 p-3 transition-all hover:border-purple-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 capitalize">{skill.word}</span>
              {skill.count > 0 ? (
                <CheckBadgeIcon className="h-4 w-4 text-green-500" />
              ) : (
                <PlusCircleIcon className="h-4 w-4 text-gray-300" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div 
                  className={cx(
                    "h-full transition-all duration-1000",
                    skill.count > 0 ? "bg-purple-500" : "bg-gray-300"
                  )}
                  style={{ width: skill.count > 0 ? '100%' : '0%' }}
                />
              </div>
              <span className="text-[10px] font-black text-gray-400">
                {skill.count > 0 ? 'MATCH' : 'MISSING'}
              </span>
            </div>
            <p className="text-[9px] text-gray-400 italic">
              Appears {skill.importance}x in Job Description
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
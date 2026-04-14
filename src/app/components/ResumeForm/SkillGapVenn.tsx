"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";

export const SkillGapVenn = () => {
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const analysis = useMemo(() => {
    if (!jd) return null;

    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have", "using", "work", "team", "experience", "knowledge", "skills", "ability"]);
    const jdWords = Array.from(new Set(jd.toLowerCase().match(/\b(\w{4,})\b/g) || []))
      .filter(word => !stopWords.has(word));

    const resumeText = JSON.stringify(resume).toLowerCase();
    
    const matched = jdWords.filter(word => resumeText.includes(word));
    const missing = jdWords.filter(word => !resumeText.includes(word));
    
    // Extract skills from resume to show "Extra" skills (simplified)
    const resumeSkills = [
      ...resume.skills.featuredSkills.map(s => s.skill.toLowerCase()),
      ...resume.skills.descriptions.flatMap(d => d.toLowerCase().match(/\b(\w{4,})\b/g) || [])
    ];
    const extra = Array.from(new Set(resumeSkills.filter(skill => !jd.toLowerCase().includes(skill))));

    return { matched, missing, extra };
  }, [jd, resume]);

  if (!analysis) return null;

  const { matched, missing, extra } = analysis;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
        Skill Gap Analysis
      </h3>
      
      <div className="relative flex h-64 items-center justify-center">
        <svg viewBox="0 0 400 300" className="h-full w-full max-w-md">
          {/* Resume Circle */}
          <circle
            cx="160"
            cy="150"
            r="80"
            className="fill-blue-500/20 stroke-blue-500"
            strokeWidth="2"
          />
          {/* JD Circle */}
          <circle
            cx="240"
            cy="150"
            r="80"
            className="fill-indigo-500/20 stroke-indigo-500"
            strokeWidth="2"
          />
          
          {/* Labels */}
          <text x="100" y="60" className="fill-blue-600 text-[12px] font-bold dark:fill-blue-400">Resume</text>
          <text x="260" y="60" className="fill-indigo-600 text-[12px] font-bold dark:fill-indigo-400">Job Description</text>
          
          {/* Counts */}
          <text x="120" y="155" className="fill-blue-700 text-lg font-black dark:fill-blue-300">{extra.length}</text>
          <text x="200" y="155" textAnchor="middle" className="fill-purple-700 text-xl font-black dark:fill-purple-300">{matched.length}</text>
          <text x="280" y="155" className="fill-indigo-700 text-lg font-black dark:fill-indigo-300">{missing.length}</text>
          
          <text x="120" y="175" textAnchor="middle" className="fill-blue-600 text-[10px] dark:fill-blue-400">Extra</text>
          <text x="200" y="175" textAnchor="middle" className="fill-purple-600 text-[10px] dark:fill-purple-400">Matched</text>
          <text x="280" y="175" textAnchor="middle" className="fill-indigo-600 text-[10px] dark:fill-indigo-400">Missing</text>
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs font-bold text-blue-600 uppercase">Extra</div>
          <div className="text-xl font-black text-blue-700">{extra.length}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-purple-600 uppercase">Matched</div>
          <div className="text-xl font-black text-purple-700">{matched.length}</div>
        </div>
        <div>
          <div className="text-xs font-bold text-indigo-600 uppercase">Missing</div>
          <div className="text-xl font-black text-indigo-700">{missing.length}</div>
        </div>
      </div>
    </div>
  );
};

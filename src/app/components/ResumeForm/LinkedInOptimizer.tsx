"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectJobTitle } from "lib/redux/aiSlice";
import { useMemo } from "react";
import { 
  UserCircleIcon, 
  CheckBadgeIcon, 
  ExclamationCircleIcon,
  LightBulbIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

export const LinkedInOptimizer = () => {
  const resume = useAppSelector(selectResume);
  const targetTitle = useAppSelector(selectJobTitle);

  const analysis = useMemo(() => {
    const suggestions = [];
    
    // 1. Headline Suggestion
    const currentJob = resume.workExperiences[0];
    const headline = targetTitle 
      ? `${targetTitle} | ${resume.skills.featuredSkills.slice(0, 3).map(s => s.skill).join(" • ")}`
      : `${currentJob?.jobTitle || "Professional"} specializing in ${resume.skills.featuredSkills[0]?.skill || "my field"}`;
    
    suggestions.push({
      label: "Optimized Headline",
      value: headline,
      tip: "Your headline should include your target role and top 3 skills to appear in recruiter searches."
    });

    // 2. About Section
    const about = `I am a ${resume.profile.summary.toLowerCase()} With a background in ${resume.educations[0]?.degree || "my field"}, I have developed expertise in ${resume.skills.featuredSkills.slice(0, 4).map(s => s.skill).join(", ")}. At ${currentJob?.company || "my previous role"}, I ${currentJob?.descriptions[0]?.toLowerCase() || "contributed to key projects"}. I'm passionate about solving complex problems and delivering high-quality results.`;

    suggestions.push({
      label: "About Section Draft",
      value: about,
      tip: "LinkedIn's 'About' section should be written in the first person and highlight your unique value proposition."
    });

    // 3. Skills Check
    const skillCount = resume.skills.featuredSkills.filter(s => s.skill).length + resume.skills.descriptions.length;
    const skillStatus = skillCount >= 10 ? "pass" : "warning";

    return { suggestions, skillStatus, skillCount };
  }, [resume, targetTitle]);

  return (
    <div className="rounded-xl border border-sky-100 bg-sky-50/30 p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCircleIcon className="h-6 w-6 text-sky-600" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">LinkedIn Optimizer</h3>
        </div>
        <a 
          href="https://www.linkedin.com/public-profile/settings" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-1 text-[10px] font-bold text-sky-600 hover:underline"
        >
          Open LinkedIn <ArrowTopRightOnSquareIcon className="h-3 w-3" />
        </a>
      </div>

      <div className="space-y-6">
        {analysis.suggestions.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-gray-400">{item.label}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(item.value)}
                className="text-[10px] font-bold text-sky-600 hover:text-sky-700"
              >
                Copy
              </button>
            </div>
            <div className="rounded-lg bg-white p-3 text-xs leading-relaxed text-gray-700 border border-sky-100 shadow-sm">
              {item.value}
            </div>
            <div className="flex items-start gap-1.5 text-[10px] text-gray-500 italic">
              <LightBulbIcon className="h-3 w-3 shrink-0 mt-0.5 text-amber-500" />
              <span>{item.tip}</span>
            </div>
          </div>
        ))}

        <div className={cx(
          "flex items-center justify-between rounded-lg p-3 border",
          analysis.skillStatus === 'pass' ? "bg-green-50 border-green-100 text-green-700" : "bg-amber-50 border-amber-100 text-amber-700"
        )}>
          <div className="flex items-center gap-2">
            {analysis.skillStatus === 'pass' ? <CheckBadgeIcon className="h-5 w-5" /> : <ExclamationCircleIcon className="h-5 w-5" />}
            <span className="text-xs font-bold">Skills Endorsement Ready</span>
          </div>
          <span className="text-xs font-black">{analysis.skillCount}/10 Skills</span>
        </div>
      </div>
    </div>
  );
};
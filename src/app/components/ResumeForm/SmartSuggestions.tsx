"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectJobDescription } from "lib/redux/aiSlice";
import { useMemo } from "react";
import { 
  LightBulbIcon, 
  CheckBadgeIcon, 
  ExclamationCircleIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";

export const SmartSuggestions = () => {
  const resume = useAppSelector(selectResume);
  const jd = useAppSelector(selectJobDescription);

  const suggestions = useMemo(() => {
    const list = [];

    // 1. Action Verb Check
    const weakVerbs = ["helped", "worked", "responsible", "managed", "did"];
    const resumeText = JSON.stringify(resume).toLowerCase();
    const foundWeakVerbs = weakVerbs.filter(v => resumeText.includes(v));
    
    if (foundWeakVerbs.length > 0) {
      list.push({
        title: "Use Stronger Action Verbs",
        text: `Replace passive words like "${foundWeakVerbs[0]}" with high-impact verbs like "Spearheaded" or "Orchestrated".`,
        icon: ArrowTrendingUpIcon,
        color: "text-amber-600",
        bg: "bg-amber-50"
      });
    }

    // 2. Quantification Check
    const hasNumbers = /\d+/.test(resumeText);
    if (!hasNumbers) {
      list.push({
        title: "Quantify Your Impact",
        text: "Add metrics (%, $, numbers) to your bullet points to prove your results to recruiters.",
        icon: CheckBadgeIcon,
        color: "text-purple-600",
        bg: "bg-purple-50"
      });
    }

    // 3. JD Specific Tip
    if (jd && jd.length > 100) {
      const jdKeywords = jd.toLowerCase().match(/\b(\w{6,})\b/g) || [];
      const missing = jdKeywords.filter(w => !resumeText.includes(w)).slice(0, 2);
      if (missing.length > 0) {
        list.push({
          title: "Targeted Keywords",
          text: `The job description emphasizes "${missing[0]}". Consider adding this to your skills or experience.`,
          icon: LightBulbIcon,
          color: "text-sky-600",
          bg: "bg-sky-50"
        });
      }
    }

    // 4. Length Check
    const totalWords = resumeText.split(" ").length;
    if (totalWords < 200) {
      list.push({
        title: "Resume is too short",
        text: "Your resume might be too brief for ATS systems. Aim for at least 300-500 words of relevant content.",
        icon: ExclamationCircleIcon,
        color: "text-red-600",
        bg: "bg-red-50"
      });
    }

    return list;
  }, [resume, jd]);

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <LightBulbIcon className="h-5 w-5 text-amber-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Smart Suggestions</h3>
      </div>
      <div className="grid gap-3">
        {suggestions.map((s, i) => (
          <div key={i} className={`flex gap-4 rounded-xl p-4 border border-transparent transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm ${s.bg}`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{s.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
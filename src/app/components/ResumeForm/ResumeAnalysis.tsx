"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { 
  LightBulbIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon 
} from "@heroicons/react/24/outline";

export const ResumeAnalysis = () => {
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const analysis = useMemo(() => {
    if (!jd) return null;

    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have", "using", "work", "team"]);
    const jdWords = Array.from(new Set(jd.toLowerCase().match(/\b(\w{4,})\b/g) || []))
      .filter(word => !stopWords.has(word));

    const resumeText = JSON.stringify(resume).toLowerCase();
    const missing = jdWords.filter(word => !resumeText.includes(word));
    
    const tips = [];
    if (missing.length > 5) {
      tips.push({
        type: "warning",
        text: `Missing key terms: ${missing.slice(0, 3).join(", ")}. Try adding these to your skills or experience.`
      });
    }
    
    const totalBullets = resume.workExperiences.reduce((acc, curr) => acc + curr.descriptions.length, 0);
    if (totalBullets < 5) {
      tips.push({
        type: "info",
        text: "Your experience section is a bit thin. Use the AI Optimizer to expand your bullet points."
      });
    }

    if (resume.profile.summary.length < 50) {
      tips.push({
        type: "info",
        text: "Your professional summary is short. A strong summary helps ATS systems categorize your profile."
      });
    }

    return { tips, score: jdWords.length > 0 ? Math.round(((jdWords.length - missing.length) / jdWords.length) * 100) : 0 };
  }, [jd, resume]);

  if (!analysis) return null;

  return (
    <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <LightBulbIcon className="h-5 w-5 text-sky-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-sky-800">Smart Analysis</h3>
      </div>
      
      <div className="space-y-3">
        {analysis.tips.map((tip, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-lg bg-white p-3 text-xs font-medium text-gray-700 shadow-sm border border-sky-100/50">
            {tip.type === 'warning' ? (
              <ExclamationTriangleIcon className="h-4 w-4 shrink-0 text-amber-500" />
            ) : (
              <CheckCircleIcon className="h-4 w-4 shrink-0 text-sky-500" />
            )}
            <span>{tip.text}</span>
          </div>
        ))}
        {analysis.tips.length === 0 && (
          <div className="flex items-center gap-3 rounded-lg bg-white p-3 text-xs font-medium text-green-700 shadow-sm border border-green-100">
            <CheckCircleIcon className="h-4 w-4 shrink-0 text-green-500" />
            <span>Your resume is well-tailored to this job description!</span>
          </div>
        )}
      </div>
    </div>
  );
};
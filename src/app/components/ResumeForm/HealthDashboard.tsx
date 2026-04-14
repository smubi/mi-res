"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { useMemo } from "react";
import { 
  TrophyIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  BoltIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

export const HealthDashboard = () => {
  const resume = useAppSelector(selectResume);
  const jd = useAppSelector(selectJobDescription);
  const settings = useAppSelector(selectSettings);

  const stats = useMemo(() => {
    // 1. Content Score
    let contentScore = 0;
    if (resume.profile.name) contentScore += 10;
    if (resume.profile.email) contentScore += 10;
    
    const allBullets = [
      ...resume.workExperiences.flatMap(w => w.descriptions),
      ...resume.projects.flatMap(p => p.descriptions)
    ];
    
    const metricsCount = allBullets.filter(b => /\d+%|\d+\s?percent|\$\d+|\d+\+/.test(b)).length;
    const metricsRatio = allBullets.length > 0 ? metricsCount / allBullets.length : 0;
    
    contentScore += Math.min(40, allBullets.length * 4);
    contentScore += Math.round(metricsRatio * 20);

    // 2. Scannability Score (from RecruiterInsights logic)
    const scannabilityChecks = [
      !!(resume.profile.name && resume.profile.email),
      resume.workExperiences.length > 0 && !!resume.workExperiences[0].jobTitle,
      resume.workExperiences.every(w => /\d{4}/.test(w.date)),
      resume.educations.length > 0,
      settings.formToHeading.workExperiences === settings.formToHeading.workExperiences.toUpperCase(),
      resume.workExperiences.every(w => w.descriptions.length <= 6)
    ];
    const scannabilityScore = Math.round((scannabilityChecks.filter(Boolean).length / scannabilityChecks.length) * 100);

    // 3. Match Score
    let matchScore = 0;
    if (jd) {
      const jdWords = Array.from(new Set(jd.toLowerCase().match(/\b(\w{4,})\b/g) || []));
      const resumeText = JSON.stringify(resume).toLowerCase();
      const matches = jdWords.filter(word => resumeText.includes(word));
      matchScore = jdWords.length > 0 ? Math.round((matches.length / jdWords.length) * 100) : 0;
    }

    const finalScore = Math.round((contentScore * 0.4) + (scannabilityScore * 0.3) + (matchScore * 0.3));

    // Identify top 3 issues
    const issues = [];
    if (allBullets.length < 5) issues.push("Add more bullet points to your experience.");
    if (metricsRatio < 0.3) issues.push("Quantify your impact with more numbers (%, $, #).");
    if (scannabilityScore < 80) issues.push("Improve scannability (check the Insights panel).");
    if (jd && matchScore < 50) issues.push("Tailor your keywords to match the job description.");

    return { 
      score: Math.min(100, finalScore), 
      scannabilityScore,
      matchScore, 
      issues: issues.slice(0, 3),
      isHealthy: finalScore > 80
    };
  }, [resume, jd, settings]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-sky-100 bg-sky-50/30 p-6 text-center dark:border-sky-900/20 dark:bg-sky-900/5">
        <div className="relative mb-2">
          <svg className="h-16 w-16" viewBox="0 0 36 36">
            <path className="text-gray-100 dark:text-gray-800" strokeDasharray="100, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-sky-500 transition-all duration-1000" strokeDasharray={`${stats.score}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-sky-600 dark:text-sky-400">
            {stats.score}
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Overall Health</span>
      </div>

      <div className="col-span-2 flex flex-col justify-between rounded-2xl border border-purple-100 bg-purple-50/30 p-6 dark:border-purple-900/20 dark:bg-purple-900/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <EyeIcon className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-[10px] font-bold uppercase text-gray-400">Scannability</span>
              </div>
              <span className="text-sm font-black text-gray-900 dark:text-white">{stats.scannabilityScore}%</span>
            </div>
            <div className="h-8 w-px bg-purple-100 dark:bg-purple-900/50" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <SparklesIcon className="h-3.5 w-3.5 text-purple-500" />
                <span className="text-[10px] font-bold uppercase text-gray-400">JD Match</span>
              </div>
              <span className="text-sm font-black text-gray-900 dark:text-white">{stats.matchScore}%</span>
            </div>
          </div>
          {stats.isHealthy && (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircleIcon className="h-3 w-3" />
              Healthy
            </span>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          {stats.issues.length > 0 ? (
            stats.issues.map((issue, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                <div className="h-1 w-1 rounded-full bg-purple-400" />
                {issue}
              </div>
            ))
          ) : (
            <p className="text-xs italic text-gray-400">Your resume is in great shape! Ready to apply.</p>
          )}
        </div>
      </div>
    </div>
  );
};
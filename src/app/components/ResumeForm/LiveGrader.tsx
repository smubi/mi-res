"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { 
  TrophyIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

const ACTION_VERBS = new Set([
  "spearheaded", "orchestrated", "chaired", "coordinated", "directed", "guided", "mentored", "oversaw",
  "architected", "engineered", "programmed", "debugged", "deployed", "integrated", "refactored", "automated",
  "accelerated", "boosted", "maximized", "outpaced", "surpassed", "yielded", "generated", "expanded",
  "optimized", "streamlined", "consolidated", "simplified", "restructured", "revitalized", "modernized",
  "led", "managed", "developed", "created", "pioneered", "designed", "implemented", "built", "delivered"
]);

export const LiveGrader = () => {
  const resume = useAppSelector(selectResume);

  const analysis = useMemo(() => {
    let score = 0;
    const deductions = [];
    const bonuses = [];

    // 1. Profile (Max 20)
    if (resume.profile.name) score += 5;
    if (resume.profile.email) score += 5;
    if (resume.profile.phone) score += 5;
    if (resume.profile.summary.length > 50) score += 5;
    else deductions.push("Professional summary is too short or missing.");

    // 2. Experience & Projects (Max 40)
    const allBullets = [
      ...resume.workExperiences.flatMap(w => w.descriptions),
      ...resume.projects.flatMap(p => p.descriptions)
    ];

    if (allBullets.length === 0) {
      deductions.push("No experience or project descriptions found.");
    } else {
      score += 10; // Base points for having content

      // Bullet Length Check
      const shortBullets = allBullets.filter(b => b.length < 40);
      if (shortBullets.length > 0) {
        const penalty = Math.min(10, shortBullets.length * 2);
        score += (10 - penalty);
        deductions.push(`${shortBullets.length} bullet points are too short (aim for >40 characters).`);
      } else {
        score += 10;
        bonuses.push("Excellent bullet point depth.");
      }

      // Action Verbs Check
      const missingVerbs = allBullets.filter(b => {
        const firstWord = b.trim().split(" ")[0]?.toLowerCase().replace(/[^a-z]/g, "");
        return !ACTION_VERBS.has(firstWord || "");
      });
      if (missingVerbs.length > 0) {
        const penalty = Math.min(10, missingVerbs.length * 2);
        score += (10 - penalty);
        deductions.push(`${missingVerbs.length} bullets don't start with strong action verbs.`);
      } else {
        score += 10;
        bonuses.push("Strong use of action verbs.");
      }

      // Quantitative Metrics Check
      const metricsCount = allBullets.filter(b => /\d+%|\d+\s?percent|\$\d+|\d+\+/.test(b)).length;
      const metricsRatio = metricsCount / allBullets.length;
      if (metricsRatio < 0.3) {
        score += Math.round(metricsRatio * 10);
        deductions.push("Missing quantitative metrics (%, $, #) in most bullet points.");
      } else {
        score += 10;
        bonuses.push("Great use of data and metrics.");
      }
    }

    // 3. Education (Max 20)
    if (resume.educations.length > 0 && resume.educations[0].school) {
      score += 20;
    } else {
      deductions.push("Education section is incomplete.");
    }

    // 4. Skills (Max 20)
    const hasSkills = resume.skills.descriptions.length > 0 || resume.skills.featuredSkills.some(s => s.skill);
    if (hasSkills) {
      score += 20;
    } else {
      deductions.push("Skills section is empty.");
    }

    return { score: Math.min(100, score), deductions, bonuses };
  }, [resume]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
            <TrophyIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Resume Strength</h3>
            <p className="text-2xl font-black text-gray-900">{analysis.score}/100</p>
          </div>
        </div>
        <div className="relative h-16 w-16">
          <svg className="h-full w-full" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              strokeDasharray="100, 100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={cx(
                "transition-all duration-1000",
                analysis.score > 80 ? "text-green-500" : analysis.score > 50 ? "text-sky-500" : "text-amber-500"
              )}
              strokeDasharray={`${analysis.score}, 100`}
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <ArrowTrendingUpIcon className="h-5 w-5 text-gray-300" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {analysis.deductions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Areas for Improvement</h4>
            {analysis.deductions.map((d, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-amber-50/50 p-2 text-xs font-medium text-amber-800 border border-amber-100/50">
                <ExclamationTriangleIcon className="h-4 w-4 shrink-0 text-amber-500" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        )}

        {analysis.bonuses.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-green-600">Strong Points</h4>
            {analysis.bonuses.map((b, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-green-50/50 p-2 text-xs font-medium text-green-800 border border-green-100/50">
                <CheckCircleIcon className="h-4 w-4 shrink-0 text-green-500" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
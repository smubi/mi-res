"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectJobDescription } from "lib/redux/aiSlice";
import { useMemo } from "react";
import { 
  ChartPieIcon, 
  CheckIcon, 
  MinusIcon 
} from "@heroicons/react/24/outline";

export const ScoreBreakdown = () => {
  const resume = useAppSelector(selectResume);
  const jd = useAppSelector(selectJobDescription);

  const breakdown = useMemo(() => {
    const items = [
      { label: "Profile Basics", score: 0, max: 15 },
      { label: "Experience Depth", score: 0, max: 25 },
      { label: "Quantification", score: 0, max: 10 },
      { label: "Action Verbs", score: 0, max: 10 },
      { label: "Education & Skills", score: 0, max: 10 },
      { label: "JD Tailoring", score: 0, max: 30 },
    ];

    // Profile
    if (resume.profile.name) items[0].score += 5;
    if (resume.profile.email) items[0].score += 5;
    if (resume.profile.phone) items[0].score += 5;

    // Experience
    const allBullets = [
      ...resume.workExperiences.flatMap(w => w.descriptions),
      ...resume.projects.flatMap(p => p.descriptions)
    ];
    if (allBullets.length > 0) {
      items[1].score = Math.min(25, Math.round((allBullets.length / 10) * 25));
      
      const metricsCount = allBullets.filter(b => /\d+%|\d+\s?percent|\$\d+|\d+\+/.test(b)).length;
      items[2].score = Math.min(10, Math.round((metricsCount / Math.max(1, allBullets.length)) * 30));

      const actionVerbs = ["led", "managed", "developed", "created", "optimized", "spearheaded"];
      const verbCount = allBullets.filter(b => actionVerbs.some(v => b.toLowerCase().includes(v))).length;
      items[3].score = Math.min(10, Math.round((verbCount / Math.max(1, allBullets.length)) * 10));
    }

    // Edu & Skills
    if (resume.educations.length > 0) items[4].score += 5;
    if (resume.skills.descriptions.length > 0 || resume.skills.featuredSkills.some(s => s.skill)) items[4].score += 5;

    // JD Tailoring
    if (jd) {
      const jdWords = jd.toLowerCase().match(/\b(\w{4,})\b/g) || [];
      const resumeText = JSON.stringify(resume).toLowerCase();
      const matches = Array.from(new Set(jdWords)).filter(word => resumeText.includes(word));
      items[5].score = Math.min(30, Math.round((matches.length / Math.max(1, new Set(jdWords).size)) * 30));
    }

    return items;
  }, [resume, jd]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ChartPieIcon className="h-5 w-5 text-gray-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Score Breakdown</h3>
      </div>

      <div className="space-y-3">
        {breakdown.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600">{item.label}</span>
              <span className="font-bold text-gray-900">{item.score}/{item.max}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div 
                className="h-full bg-sky-500 transition-all duration-1000" 
                style={{ width: `${(item.score / item.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
"use client";

import { 
  EyeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  InformationCircleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { useMemo } from "react";
import { cx } from "lib/cx";

export const RecruiterInsights = () => {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);

  const analysis = useMemo(() => {
    const checks = [
      {
        label: "Clear Name & Contact",
        status: !!(resume.profile.name && resume.profile.email),
        tip: "Recruiters look at the top-left/center first for identity.",
        weight: 25
      },
      {
        label: "Current Role Visibility",
        status: resume.workExperiences.length > 0 && !!resume.workExperiences[0].jobTitle,
        tip: "The current job title is the #1 most viewed item.",
        weight: 25
      },
      {
        label: "Date Formatting",
        status: resume.workExperiences.every(w => /\d{4}/.test(w.date)),
        tip: "Consistent dates on the right side help recruiters track career progression quickly.",
        weight: 15
      },
      {
        label: "Education Placement",
        status: resume.educations.length > 0,
        tip: "Education is usually the final 'anchor' point in a 6-second scan.",
        weight: 15
      },
      {
        label: "Header Emphasis",
        status: settings.formToHeading.workExperiences === settings.formToHeading.workExperiences.toUpperCase(),
        tip: "UPPERCASE headers act as visual signposts during a rapid scan.",
        weight: 10
      },
      {
        label: "Content Density",
        status: resume.workExperiences.every(w => w.descriptions.length <= 6),
        tip: "Avoid more than 6 bullets per role to prevent 'wall of text' fatigue.",
        weight: 10
      }
    ];

    const score = checks.reduce((acc, curr) => acc + (curr.status ? curr.weight : 0), 0);

    return { checks, score };
  }, [resume, settings]);

  return (
    <div className="rounded-xl border border-orange-100 bg-orange-50/30 p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeIcon className="h-5 w-5 text-orange-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-orange-900">6-Second Scan Insights</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase text-orange-400">Scannability</span>
            <span className="text-xl font-black text-orange-600">{analysis.score}%</span>
          </div>
          <div className="h-10 w-1 bg-orange-100 rounded-full overflow-hidden">
            <div 
              className="w-full bg-orange-500 transition-all duration-1000" 
              style={{ height: `${analysis.score}%`, marginTop: `${100 - analysis.score}%` }}
            />
          </div>
        </div>
      </div>

      <p className="mb-6 text-xs leading-relaxed text-orange-800/70">
        Based on eye-tracking research, recruiters focus on a specific <strong>F-shaped pattern</strong>. Your score reflects how well your layout guides their eyes to key info.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {analysis.checks.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-2 rounded-lg bg-white p-3 shadow-sm border border-orange-100/50">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-gray-900">{item.label}</p>
              {item.status ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ExclamationCircleIcon className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed italic">{item.tip}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-orange-100/50 p-3 border border-orange-200/50">
        <div className="flex items-center gap-2 text-[10px] font-bold text-orange-800 uppercase tracking-wider">
          <InformationCircleIcon className="h-3.5 w-3.5" />
          Optimization Strategy
        </div>
        <p className="mt-1 text-[10px] text-orange-700 leading-relaxed">
          {analysis.score < 70 
            ? "Your resume might be hard to scan quickly. Try using UPPERCASE for section headers and ensuring your current job title is prominent."
            : "Great job! Your resume is highly scannable. Ensure your most impressive achievements are in the first two bullets of each role."}
        </p>
      </div>
    </div>
  );
};
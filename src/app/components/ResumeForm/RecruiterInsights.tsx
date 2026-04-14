"use client";

import { 
  EyeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";

export const RecruiterInsights = () => {
  const resume = useAppSelector(selectResume);

  const analysis = useMemo(() => {
    const checks = [
      {
        label: "Clear Name & Contact",
        status: !!(resume.profile.name && resume.profile.email),
        tip: "Recruiters look at the top-left/center first for identity."
      },
      {
        label: "Current Role Visibility",
        status: resume.workExperiences.length > 0 && !!resume.workExperiences[0].jobTitle,
        tip: "The current job title is the #1 most viewed item."
      },
      {
        label: "Date Formatting",
        status: resume.workExperiences.every(w => /\d{4}/.test(w.date)),
        tip: "Consistent dates on the right side help recruiters track career progression quickly."
      },
      {
        label: "Education Placement",
        status: resume.educations.length > 0,
        tip: "Education is usually the final 'anchor' point in a 6-second scan."
      }
    ];

    return checks;
  }, [resume]);

  return (
    <div className="rounded-xl border border-orange-100 bg-orange-50/30 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeIcon className="h-5 w-5 text-orange-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-orange-900">6-Second Scan Insights</h3>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
          <ClockIcon className="h-3 w-3" />
          STUDY BASED
        </div>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-orange-800/70">
        According to TheLadders eye-tracking research, recruiters spend an average of <strong>6 seconds</strong> before deciding if a resume is a fit. They focus on a specific "F-shaped" pattern.
      </p>

      <div className="space-y-3">
        {analysis.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-sm border border-orange-100/50">
            {item.status ? (
              <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-500" />
            ) : (
              <ExclamationCircleIcon className="h-5 w-5 shrink-0 text-amber-500" />
            )}
            <div>
              <p className="text-xs font-bold text-gray-900">{item.label}</p>
              <p className="mt-0.5 text-[10px] text-gray-500 leading-relaxed italic">{item.tip}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-orange-100/50 p-3">
        <div className="flex items-center gap-2 text-[10px] font-bold text-orange-800 uppercase tracking-wider">
          <InformationCircleIcon className="h-3.5 w-3.5" />
          Pro Tip
        </div>
        <p className="mt-1 text-[10px] text-orange-700 leading-relaxed">
          Avoid large blocks of text. Use bullet points and bold your job titles to "catch" the recruiter's eye during their rapid scan.
        </p>
      </div>
    </div>
  );
};
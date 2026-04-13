"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { 
  CheckCircleIcon, 
  CircleStackIcon,
  ClipboardDocumentCheckIcon
} from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

export const ResumeChecklist = () => {
  const resume = useAppSelector(selectResume);

  const checks = useMemo(() => {
    const items = [
      {
        label: "Contact Information",
        status: resume.profile.email && resume.profile.phone ? "complete" : "incomplete",
        tip: "Ensure both email and phone are present."
      },
      {
        label: "Professional Summary",
        status: resume.profile.summary.length > 50 ? "complete" : "incomplete",
        tip: "Aim for at least 2-3 sentences."
      },
      {
        label: "Work Experience",
        status: resume.workExperiences.length > 0 ? "complete" : "incomplete",
        tip: "Add at least one relevant role."
      },
      {
        label: "Quantified Impact",
        status: JSON.stringify(resume).match(/\d+%|\d+\s?percent|\$\d+/i) ? "complete" : "incomplete",
        tip: "Use numbers to show your results."
      },
      {
        label: "Skills Section",
        status: resume.skills.descriptions.length > 0 || resume.skills.featuredSkills.some(s => s.skill) ? "complete" : "incomplete",
        tip: "List your technical and soft skills."
      }
    ];
    return items;
  }, [resume]);

  const progress = Math.round((checks.filter(c => c.status === "complete").length / checks.length) * 100);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardDocumentCheckIcon className="h-5 w-5 text-sky-600" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Resume Checklist</h3>
        </div>
        <span className="text-xs font-black text-sky-600 bg-sky-50 px-2 py-1 rounded-md">
          {progress}% Complete
        </span>
      </div>

      <div className="space-y-4">
        {checks.map((check, idx) => (
          <div key={idx} className="group flex items-start gap-3">
            <div className={cx(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              check.status === "complete" 
                ? "border-green-500 bg-green-500 text-white" 
                : "border-gray-200 bg-white text-transparent"
            )}>
              <CheckCircleIcon className="h-4 w-4" />
            </div>
            <div>
              <p className={cx(
                "text-sm font-bold transition-colors",
                check.status === "complete" ? "text-gray-900" : "text-gray-400"
              )}>
                {check.label}
              </p>
              {check.status === "incomplete" && (
                <p className="mt-0.5 text-xs text-gray-500">{check.tip}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
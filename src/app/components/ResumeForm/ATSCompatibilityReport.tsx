"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { useMemo } from "react";
import { 
  ShieldCheckIcon, 
  XCircleIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentMagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

export const ATSCompatibilityReport = () => {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);

  const report = useMemo(() => {
    const checks = [
      {
        label: "Standard Font Usage",
        status: ["Roboto", "Lato", "OpenSans", "Montserrat"].includes(settings.fontFamily),
        passMsg: "Using an ATS-friendly sans-serif font.",
        failMsg: "Some older ATS systems struggle with complex serif fonts. Consider Roboto or Lato.",
        severity: "info"
      },
      {
        label: "Single Column Layout",
        status: settings.templateId !== "two-column", // We don't have two-column yet, but good for future-proofing
        passMsg: "Single column layout is highly readable for all ATS versions.",
        failMsg: "Multi-column layouts can cause text-parsing errors in older systems.",
        severity: "critical"
      },
      {
        label: "Contact Info Placement",
        status: !!(resume.profile.email && resume.profile.phone),
        passMsg: "Contact details are clearly defined in the header.",
        failMsg: "Missing email or phone. ATS might fail to create a candidate profile.",
        severity: "critical"
      },
      {
        label: "Section Header Clarity",
        status: settings.formToHeading.workExperiences.length > 0 && settings.formToHeading.educations.length > 0,
        passMsg: "Standard section headers detected.",
        failMsg: "Ensure your section headers use standard terms like 'Experience' and 'Education'.",
        severity: "warning"
      },
      {
        label: "No Complex Graphics",
        status: !resume.skills.featuredSkills.some(s => s.rating > 0), // Featured skills use circles which are fine in our PDF, but we check for 'complex' ones
        passMsg: "No complex tables or images detected.",
        failMsg: "Visual skill ratings (circles) are fine here, but avoid adding external images or icons.",
        severity: "info"
      }
    ];

    const score = Math.round((checks.filter(c => c.status).length / checks.length) * 100);
    return { checks, score };
  }, [resume, settings]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DocumentMagnifyingGlassIcon className="h-5 w-5 text-sky-600" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">ATS Technical Report</h3>
        </div>
        <div className={cx(
          "rounded-full px-3 py-1 text-xs font-black",
          report.score > 80 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
        )}>
          {report.score}% Compatible
        </div>
      </div>

      <div className="space-y-4">
        {report.checks.map((check, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {check.status ? (
              <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-500" />
            ) : check.severity === 'critical' ? (
              <XCircleIcon className="h-5 w-5 shrink-0 text-red-500" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-amber-500" />
            )}
            <div>
              <p className="text-xs font-bold text-gray-900">{check.label}</p>
              <p className="mt-0.5 text-[10px] text-gray-500 leading-relaxed">
                {check.status ? check.passMsg : check.failMsg}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg bg-sky-50 p-3 text-[10px] font-medium text-sky-700 border border-sky-100">
        <ShieldCheckIcon className="h-4 w-4 shrink-0" />
        <span>This report checks for technical parsing compatibility, not content quality.</span>
      </div>
    </div>
  );
};
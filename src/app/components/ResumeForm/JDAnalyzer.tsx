"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { 
  ClipboardDocumentListIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InformationCircleIcon 
} from "@heroicons/react/24/outline";

export const JDAnalyzer = () => {
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const analysis = useMemo(() => {
    if (!jd) return null;

    const results = [];

    // 1. Experience Check
    const expMatch = jd.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*experience/i);
    if (expMatch) {
      const requiredYears = parseInt(expMatch[1]);
      const resumeYears = resume.workExperiences.reduce((acc, curr) => {
        const dateMatch = curr.date.match(/(\d{4})/g);
        if (dateMatch && dateMatch.length >= 2) {
          return acc + (parseInt(dateMatch[1]) - parseInt(dateMatch[0]));
        }
        return acc;
      }, 0);

      results.push({
        label: "Experience Level",
        required: `${requiredYears}+ Years`,
        found: `${resumeYears} Years detected`,
        status: resumeYears >= requiredYears ? "pass" : "fail",
        tip: `The JD asks for ${requiredYears} years. Ensure your dates are clear.`
      });
    }

    // 2. Education Check
    const eduLevels = [
      { key: "phd", label: "PhD", regex: /phd|doctorate/i },
      { key: "masters", label: "Master's", regex: /master|ms|mba/i },
      { key: "bachelors", label: "Bachelor's", regex: /bachelor|bs|ba/i }
    ];

    const requiredEdu = eduLevels.find(level => level.regex.test(jd));
    if (requiredEdu) {
      const hasEdu = resume.educations.some(edu => requiredEdu.regex.test(edu.degree));
      results.push({
        label: "Education Requirement",
        required: requiredEdu.label,
        found: hasEdu ? "Matched" : "Not explicitly found",
        status: hasEdu ? "pass" : "fail",
        tip: `Make sure your ${requiredEdu.label} degree is clearly listed.`
      });
    }

    return results;
  }, [jd, resume]);

  if (!analysis || analysis.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ClipboardDocumentListIcon className="h-5 w-5 text-sky-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Requirement Matcher</h3>
      </div>

      <div className="space-y-4">
        {analysis.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">{item.label}</span>
              {item.status === "pass" ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-amber-500" />
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Required: <span className="font-bold text-gray-900">{item.required}</span></span>
              <span className={item.status === "pass" ? "text-green-700 font-bold" : "text-amber-700 font-bold"}>{item.found}</span>
            </div>
            {item.status === "fail" && (
              <div className="mt-1 flex items-start gap-1.5 text-[10px] text-gray-500 italic">
                <InformationCircleIcon className="h-3 w-3 shrink-0 mt-0.5" />
                <span>{item.tip}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
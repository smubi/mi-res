"use client";

import React, { useMemo } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectJobDescription } from "lib/redux/aiSlice";
import { 
  LightBulbIcon, 
  CheckCircleIcon, 
  InformationCircleIcon 
} from "@heroicons/react/24/outline";

export const SmartSuggestions = () => {
  const resume = useAppSelector(selectResume);
  const jd = useAppSelector(selectJobDescription);

  const suggestions = useMemo(() => {
    const list = [];

    // Check for quantification
    const allDescriptions = [
      ...resume.workExperiences.flatMap(w => w.descriptions),
      ...resume.projects.flatMap(p => p.descriptions)
    ];
    const hasNumbers = allDescriptions.some(d => /\d+/.test(d));
    if (!hasNumbers && allDescriptions.length > 0) {
      list.push({
        title: "Quantify your impact",
        text: "Try adding metrics (%, $, #) to your bullet points to show scale and results.",
        type: "tip"
      });
    }

    // Check for action verbs
    const actionVerbs = ["led", "managed", "developed", "created", "optimized", "spearheaded", "architected", "engineered"];
    const startsWithActionVerb = allDescriptions.every(d => 
      actionVerbs.some(v => d.toLowerCase().trim().startsWith(v))
    );
    if (!startsWithActionVerb && allDescriptions.length > 0) {
      list.push({
        title: "Use strong action verbs",
        text: "Start every bullet point with a strong action verb like 'Architected' or 'Orchestrated'.",
        type: "tip"
      });
    }

    // JD specific suggestion
    if (jd && jd.length > 100) {
      list.push({
        title: "Tailoring active",
        text: "We've identified key skills from the job description. Use the AI Optimizer to inject them.",
        type: "success"
      });
    }

    return list;
  }, [resume, jd]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <LightBulbIcon className="h-5 w-5 text-amber-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Smart Suggestions</h3>
      </div>
      
      <div className="grid gap-3">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            {s.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-500" />
            ) : (
              <InformationCircleIcon className="h-5 w-5 shrink-0 text-sky-500" />
            )}
            <div>
              <p className="text-sm font-bold text-gray-900">{s.title}</p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">{s.text}</p>
            </div>
          </div>
        ))}
        {suggestions.length === 0 && (
          <p className="px-1 text-xs text-gray-400 italic">No new suggestions. Your resume looks great!</p>
        )}
      </div>
    </div>
  );
};
"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const ATSView = () => {
  const resume = useAppSelector(selectResume);
  const [copied, setCopied] = useState(false);

  const getPlainText = () => {
    const lines = [];
    lines.push(resume.profile.name);
    lines.push(`${resume.profile.email} | ${resume.profile.phone} | ${resume.profile.location}`);
    lines.push(resume.profile.url);
    lines.push("\nSUMMARY");
    lines.push(resume.profile.summary);

    lines.push("\nEXPERIENCE");
    resume.workExperiences.forEach(exp => {
      lines.push(`${exp.company} - ${exp.jobTitle}`);
      lines.push(exp.date);
      exp.descriptions.forEach(d => lines.push(`• ${d}`));
    });

    lines.push("\nEDUCATION");
    resume.educations.forEach(edu => {
      lines.push(`${edu.school} - ${edu.degree}`);
      lines.push(`${edu.date} | GPA: ${edu.gpa}`);
    });

    lines.push("\nSKILLS");
    lines.push(resume.skills.featuredSkills.map(s => s.skill).filter(Boolean).join(", "));
    resume.skills.descriptions.forEach(d => lines.push(d));

    return lines.join("\n");
  };

  const plainText = getPlainText();

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full w-full bg-gray-900 p-8 font-mono text-sm leading-relaxed text-green-400/90 shadow-inner overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
      <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Live ATS Stream</h3>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1 text-[10px] font-bold text-gray-400 hover:bg-gray-700 hover:text-white transition-all"
        >
          {copied ? <CheckIcon className="h-3 w-3 text-green-500" /> : <ClipboardIcon className="h-3 w-3" />}
          {copied ? "Copied" : "Copy Raw"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap">
        {plainText}
      </pre>
    </div>
  );
};
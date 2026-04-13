"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectJobDescription, selectCoverLetter, setCoverLetter } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { DocumentTextIcon, SparklesIcon, ArrowPathIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { BaseForm } from "components/ResumeForm/Form";

export const CoverLetterGenerator = () => {
  const dispatch = useAppDispatch();
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);
  const coverLetter = useAppSelector(selectCoverLetter);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!jd || isGenerating) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation based on Resume and JD
    setTimeout(() => {
      const name = resume.profile.name || "[Your Name]";
      const company = jd.match(/at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/)?.[1] || "[Company Name]";
      
      const draft = `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the position at ${company}, as advertised. With a strong background in ${resume.skills.featuredSkills[0]?.skill || "my field"} and a proven track record of success at ${resume.workExperiences[0]?.company || "my previous roles"}, I am confident that my skills and experiences align perfectly with the requirements of this role.

In my recent experience at ${resume.workExperiences[0]?.company || "my last company"}, I ${resume.workExperiences[0]?.descriptions[0]?.toLowerCase() || "contributed to key projects"}. This experience allowed me to develop a deep understanding of ${resume.skills.descriptions[0] || "industry best practices"}, which I am eager to bring to your team.

I am particularly drawn to ${company} because of your commitment to innovation and excellence. I am confident that my proactive approach and dedication to high-quality results will make me a valuable asset to your organization.

Thank you for your time and consideration. I look forward to the possibility of discussing how my background can contribute to the continued success of ${company}.

Sincerely,

${name}`;

      dispatch(setCoverLetter(draft));
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
            <h1 className="text-lg font-semibold tracking-wide text-gray-900">
              AI Cover Letter
            </h1>
          </div>
          {coverLetter && (
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
            >
              <ClipboardIcon className="h-3 w-3" />
              Copy
            </button>
          )}
        </div>

        {!coverLetter ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
            <p className="mb-4 text-sm text-gray-500">
              {jd 
                ? "Ready to draft a tailored cover letter based on your resume and the job description." 
                : "Please provide a Job Description first to generate a tailored cover letter."}
            </p>
            <button
              onClick={handleGenerate}
              disabled={!jd || isGenerating}
              className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <SparklesIcon className="h-4 w-4" />
              )}
              {isGenerating ? "Drafting..." : "Generate Cover Letter"}
            </button>
          </div>
        ) : (
          <div className="relative">
            <textarea
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none min-h-[300px]"
              value={coverLetter}
              onChange={(e) => dispatch(setCoverLetter(e.target.value))}
            />
            <button
              onClick={handleGenerate}
              className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 text-purple-600 hover:text-purple-700 transition-all hover:scale-110"
              title="Regenerate"
            >
              <ArrowPathIcon className={isGenerating ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            </button>
          </div>
        )}
      </div>
    </BaseForm>
  );
};
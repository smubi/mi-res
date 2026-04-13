"use client";

import { useState } from "react";
import { BaseForm } from "components/ResumeForm/Form";
import { Textarea } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectCoverLetter, setCoverLetter, selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { SparklesIcon, DocumentDuplicateIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export const CoverLetterForm = () => {
  const dispatch = useAppDispatch();
  const coverLetter = useAppSelector(selectCoverLetter);
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!jd) {
      toast.error("Please provide a Job Description in the 'AI Optimize' tab first.");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation based on Resume and JD
    setTimeout(() => {
      const name = resume.profile.name || "[Your Name]";
      const company = jd.match(/at\s+([A-Z][a-z]+)/)?.[1] || "[Company Name]";
      const role = jd.match(/(?:for|as)\s+a\s+([A-Z][a-z\s]+)/)?.[1] || "[Role Name]";
      
      const draft = `Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${role} position at ${company}, as advertised. With a strong background in ${resume.skills.featuredSkills[0]?.skill || "industry-standard technologies"} and a proven track record of ${resume.workExperiences[0]?.jobTitle || "delivering high-quality results"}, I am confident that my skills and experiences align perfectly with the requirements of this role.

In my previous role at ${resume.workExperiences[0]?.company || "my last company"}, I ${resume.workExperiences[0]?.descriptions[0]?.toLowerCase() || "successfully contributed to key projects"}. This experience allowed me to develop a deep understanding of ${resume.skills.descriptions[0] || "core industry principles"}, which I am eager to bring to the team at ${company}.

I am particularly drawn to ${company} because of its reputation for innovation and excellence. I am eager to contribute my expertise to help the team achieve its goals and continue its growth.

Thank you for your time and consideration. I look forward to the possibility of discussing how my background and skills can contribute to the continued success of ${company}.

Sincerely,

${name}`;

      dispatch(setCoverLetter(draft));
      setIsGenerating(false);
      toast.success("Cover letter generated!");
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Cover_Letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
            <h1 className="text-lg font-semibold tracking-wide text-gray-900">
              AI Cover Letter
            </h1>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-purple-700 active:scale-95 disabled:opacity-50 ${isGenerating ? 'animate-pulse' : ''}`}
          >
            <SparklesIcon className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Draft"}
          </button>
        </div>

        {!coverLetter && !isGenerating && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500">
              No draft generated yet. Paste a Job Description in the <span className="font-bold text-sky-500">AI Optimize</span> tab and click generate.
            </p>
          </div>
        )}

        {(coverLetter || isGenerating) && (
          <div className="relative">
            <div className="absolute right-2 top-2 flex gap-2">
              <button 
                onClick={handleCopy}
                className="rounded-md bg-white/80 p-1.5 text-gray-500 shadow-sm backdrop-blur-sm hover:text-sky-600"
                title="Copy to clipboard"
              >
                <DocumentDuplicateIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={handleDownload}
                className="rounded-md bg-white/80 p-1.5 text-gray-500 shadow-sm backdrop-blur-sm hover:text-sky-600"
                title="Download as .txt"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
              </button>
            </div>
            <Textarea
              label="Draft Content"
              name="coverLetter"
              placeholder="Your AI-generated cover letter will appear here..."
              value={coverLetter}
              onChange={(_, value) => dispatch(setCoverLetter(value))}
              labelClassName="col-span-full"
            />
          </div>
        )}

        <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
          <p className="text-xs font-medium text-amber-800">
            <span className="font-bold">Pro Tip:</span> AI drafts are a starting point. Always review and personalize your cover letter to reflect your unique voice and specific interest in the company.
          </p>
        </div>
      </div>
    </BaseForm>
  );
};
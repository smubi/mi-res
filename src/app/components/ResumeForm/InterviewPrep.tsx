"use client";

import { useState } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectJobDescription } from "lib/redux/aiSlice";
import { 
  ChatBubbleBottomCenterTextIcon, 
  SparklesIcon, 
  ArrowPathIcon,
  QuestionMarkCircleIcon 
} from "@heroicons/react/24/outline";
import { BaseForm } from "components/ResumeForm/Form";

export const InterviewPrep = () => {
  const resume = useAppSelector(selectResume);
  const jd = useAppSelector(selectJobDescription);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);

    // Simulate AI generating questions based on Resume and JD
    setTimeout(() => {
      const q = [
        `Can you tell me about a time you used ${resume.skills.featuredSkills[0]?.skill || "your technical skills"} to solve a complex problem?`,
        `In your role at ${resume.workExperiences[0]?.company || "your last job"}, how did you handle a situation where a project was falling behind schedule?`,
        `The job description mentions a need for ${jd.match(/\b(\w{6,})\b/)?.[1] || "strong leadership"}. Can you provide an example of when you demonstrated this?`,
        `What was the most challenging aspect of your ${resume.projects[0]?.project || "latest project"}, and how did you overcome it?`,
        `Why do you think your experience with ${resume.skills.descriptions[0]?.split(" ")[0] || "this industry"} makes you the best fit for this specific role?`
      ];
      setQuestions(q);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
            <h1 className="text-lg font-semibold tracking-wide text-gray-900">
              AI Interview Prep
            </h1>
          </div>
          {questions.length > 0 && (
            <button 
              onClick={handleGenerate}
              className="text-gray-400 hover:text-purple-600 transition-colors"
              title="Regenerate"
            >
              <ArrowPathIcon className={isGenerating ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            </button>
          )}
        </div>

        {questions.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
            <p className="mb-4 text-sm text-gray-500">
              Generate personalized interview questions based on your resume and the target role.
            </p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              {isGenerating ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <SparklesIcon className="h-4 w-4" />
              )}
              {isGenerating ? "Analyzing..." : "Generate Questions"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={i} className="flex gap-3 rounded-xl border border-purple-100 bg-purple-50/30 p-4 shadow-sm">
                <QuestionMarkCircleIcon className="h-5 w-5 shrink-0 text-purple-500" />
                <p className="text-xs font-medium leading-relaxed text-gray-700">{q}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseForm>
  );
};
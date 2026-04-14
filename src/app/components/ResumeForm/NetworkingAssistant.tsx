"use client";

import { useState } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectJobDescription, selectJobTitle } from "lib/redux/aiSlice";
import { 
  UserPlusIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftEllipsisIcon,
  SparklesIcon,
  ClipboardIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import { BaseForm } from "components/ResumeForm/Form";

type TemplateType = "linkedin" | "followup" | "thankyou";

export const NetworkingAssistant = () => {
  const resume = useAppSelector(selectResume);
  const jd = useAppSelector(selectJobDescription);
  const jobTitle = useAppSelector(selectJobTitle);
  
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("linkedin");
  const [copied, setCopied] = useState(false);

  const generateTemplate = (type: TemplateType) => {
    const name = resume.profile.name || "[Your Name]";
    const targetRole = jobTitle || "the open position";
    const company = jd?.match(/at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/)?.[1] || "[Company]";

    switch (type) {
      case "linkedin":
        return `Hi [Name], I noticed your work at ${company} and was impressed by your background in ${resume.skills.featuredSkills[0]?.skill || "the industry"}. I'm currently applying for the ${targetRole} role and would love to connect and learn more about your experience with the team. Best, ${name}`;
      
      case "followup":
        return `Subject: Following up on ${targetRole} application - ${name}\n\nDear Hiring Team,\n\nI hope this email finds you well. I am writing to briefly follow up on my application for the ${targetRole} position. I remain very interested in the opportunity at ${company}, especially given my experience with ${resume.workExperiences[0]?.descriptions[0]?.slice(0, 50) || "relevant projects"}.\n\nPlease let me know if there is any additional information I can provide. Thank you for your time!\n\nBest regards,\n\n${name}`;
      
      case "thankyou":
        return `Subject: Thank you - ${targetRole} Interview - ${name}\n\nDear [Interviewer Name],\n\nThank you so much for the opportunity to interview for the ${targetRole} position today. I really enjoyed our conversation about ${company}'s goals for ${jd?.match(/\b(\w{8,})\b/)?.[1] || "innovation"}.\n\nOur discussion furthered my interest in the role, and I'm confident my skills in ${resume.skills.featuredSkills.slice(0, 2).map(s => s.skill).join(" and ")} would allow me to contribute effectively to your team. I look forward to hearing from you.\n\nBest,\n\n${name}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateTemplate(activeTemplate));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlusIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
            <h1 className="text-lg font-semibold tracking-wide text-gray-900">
              Networking Assistant
            </h1>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            {copied ? <CheckIcon className="h-3 w-3 text-green-500" /> : <ClipboardIcon className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex gap-2 border-b border-gray-100 pb-2">
          {[
            { id: "linkedin", label: "LinkedIn", icon: ChatBubbleLeftEllipsisIcon },
            { id: "followup", label: "Follow-up", icon: EnvelopeIcon },
            { id: "thankyou", label: "Thank You", icon: SparklesIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTemplate(tab.id as TemplateType)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTemplate === tab.id 
                  ? "bg-sky-600 text-white shadow-sm" 
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative rounded-xl bg-gray-50 p-4">
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-gray-700">
            {generateTemplate(activeTemplate)}
          </pre>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 italic">
            <SparklesIcon className="h-3 w-3 text-purple-400" />
            Tailored using your resume and target role details.
          </div>
        </div>
      </div>
    </BaseForm>
  );
};
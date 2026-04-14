"use client";

import { useState } from "react";
import { 
  SparklesIcon, 
  ArrowPathIcon, 
  ClipboardIcon,
  CheckIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { BaseForm } from "components/ResumeForm/Form";

type GapReason = "personal" | "education" | "pivot" | "layoff";

export const EmploymentGapFramer = () => {
  const [reason, setReason] = useState<GapReason>("personal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const frames = {
        personal: "During this period, I stepped away from my professional role to focus on a significant personal commitment. This time allowed me to refine my organizational and time-management skills, and I am now fully prepared and eager to return to a full-time role where I can apply my expertise in [Skill].",
        education: "I intentionally took a hiatus from full-time employment to pursue advanced certifications and specialized training in [Field]. This dedicated period of upskilling has equipped me with modern methodologies that I am ready to implement in my next role.",
        pivot: "I utilized this time to strategically transition my career focus toward [New Field]. By engaging in intensive self-study and project-based learning, I have successfully bridged the gap between my previous experience and the requirements of this new direction.",
        layoff: "Following a company-wide restructuring, I took the opportunity to reflect on my career goals and engage in professional development. I am now seeking a role where I can leverage my proven track record in [Previous Role] to drive results for a forward-thinking organization."
      };
      setResult(frames[reason]);
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-purple-600" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-purple-900">Gap Framer</h3>
        </div>
        {result && (
          <button onClick={handleCopy} className="text-[10px] font-bold text-purple-600 hover:underline">
            {copied ? "Copied!" : "Copy Text"}
          </button>
        )}
      </div>

      <p className="mb-4 text-xs text-purple-700/70 leading-relaxed">
        Employment gaps are common. The key is framing them as periods of growth or intentionality.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: "personal", label: "Personal/Family" },
          { id: "education", label: "Upskilling" },
          { id: "pivot", label: "Career Pivot" },
          { id: "layoff", label: "Restructuring" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setReason(item.id as GapReason)}
            className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
              reason === item.id 
                ? "bg-purple-600 text-white shadow-sm" 
                : "bg-white text-purple-600 border border-purple-100 hover:bg-purple-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {!result ? (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full rounded-lg bg-purple-600 py-2 text-xs font-bold text-white hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? <ArrowPathIcon className="h-3 w-3 animate-spin" /> : <SparklesIcon className="h-3 w-3" />}
          Generate Professional Frame
        </button>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg bg-white p-3 text-xs leading-relaxed text-gray-700 border border-purple-100 italic">
            "{result}"
          </div>
          <button 
            onClick={() => setResult("")}
            className="text-[10px] font-bold text-gray-400 hover:text-purple-600"
          >
            Try another reason
          </button>
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-white/50 p-2 text-[9px] text-purple-800/60 italic">
        <InformationCircleIcon className="h-3 w-3 shrink-0 mt-0.5" />
        <span>Tip: You can use this text in your Professional Summary or during an interview.</span>
      </div>
    </div>
  );
};
"use client";

import type { Resume } from "lib/redux/types";
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";

export const ResumeGrade = ({ resume }: { resume: Resume }) => {
  const calculateGrade = (resume: Resume) => {
    let score = 0;
    const feedback = [];

    // Profile (Max 20)
    if (resume.profile.name) score += 5;
    else feedback.push({ type: "error", text: "Name not found. ATS might struggle to identify you." });
    
    if (resume.profile.email) score += 5;
    else feedback.push({ type: "error", text: "Email not found. Recruiters can't contact you." });
    
    if (resume.profile.phone) score += 5;
    if (resume.profile.summary) score += 5;
    else feedback.push({ type: "warning", text: "Professional summary is missing." });

    // Work Experience (Max 40)
    if (resume.workExperiences.length > 0) {
      score += 20;
      const avgBullets = resume.workExperiences.reduce((acc, curr) => acc + curr.descriptions.length, 0) / resume.workExperiences.length;
      if (avgBullets >= 3) score += 20;
      else feedback.push({ type: "warning", text: "Work experiences need more bullet points (aim for 3-5 per role)." });
    } else {
      feedback.push({ type: "error", text: "No work experience detected." });
    }

    // Education (Max 20)
    if (resume.educations.length > 0) {
      score += 20;
    } else {
      feedback.push({ type: "warning", text: "Education section not found." });
    }

    // Skills (Max 20)
    if (resume.skills.descriptions.length > 0 || resume.skills.featuredSkills.some(s => s.skill)) {
      score += 20;
    } else {
      feedback.push({ type: "warning", text: "Skills section is empty." });
    }

    return { score, feedback };
  };

  const { score, feedback } = calculateGrade(resume);

  return (
    <div className="mb-8 rounded-2xl border border-purple-100 bg-purple-50/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-purple-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-purple-700">AI Analysis Score</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-purple-100">
            <div 
              className="h-full bg-purple-500 transition-all duration-1000" 
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-2xl font-black text-purple-700">{score}%</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {feedback.map((item, idx) => (
          <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl text-xs font-medium ${
            item.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 
            'bg-amber-50 text-amber-700 border border-amber-100'
          }`}>
            <ExclamationCircleIcon className={`h-4 w-4 shrink-0 ${item.type === 'error' ? 'text-red-500' : 'text-amber-500'}`} />
            <span>{item.text}</span>
          </div>
        ))}
        {feedback.length === 0 && (
          <div className="col-span-2 flex items-center gap-3 p-3 rounded-xl text-xs font-medium bg-green-50 text-green-700 border border-green-100">
            <CheckCircleIcon className="h-4 w-4 text-green-500 shrink-0" />
            <span>Perfect! This resume is highly optimized for ATS systems.</span>
          </div>
        )}
      </div>
    </div>
  );
};
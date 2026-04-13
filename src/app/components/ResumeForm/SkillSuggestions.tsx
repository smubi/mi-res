"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { SparklesIcon, PlusIcon } from "@heroicons/react/24/outline";

export const SkillSuggestions = () => {
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const suggestions = useMemo(() => {
    if (!jd) return [];

    // Common technical keywords to look for
    const techKeywords = [
      "react", "typescript", "javascript", "python", "node.js", "sql", "aws", 
      "docker", "kubernetes", "graphql", "rest api", "agile", "scrum", 
      "machine learning", "ci/cd", "unit testing", "git", "nosql", "postgres"
    ];

    const resumeText = JSON.stringify(resume).toLowerCase();
    const jdLower = jd.toLowerCase();

    return techKeywords.filter(skill => 
      jdLower.includes(skill) && !resumeText.includes(skill)
    ).slice(0, 5);
  }, [jd, resume]);

  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <SparklesIcon className="h-5 w-5 text-purple-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-purple-800">AI Skill Suggestions</h3>
      </div>
      
      <p className="mb-4 text-xs text-purple-700/70">
        We found these keywords in the job description that aren't in your resume yet:
      </p>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((skill) => (
          <div 
            key={skill} 
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-purple-700 shadow-sm border border-purple-100"
          >
            <PlusIcon className="h-3 w-3" />
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};
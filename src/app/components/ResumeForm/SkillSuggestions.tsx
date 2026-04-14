"use client";

import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume, addSkill } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { SparklesIcon, PlusIcon } from "@heroicons/react/24/outline";

export const SkillSuggestions = () => {
  const dispatch = useAppDispatch();
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const suggestions = useMemo(() => {
    if (!jd) return [];

    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have", "using", "work", "team", "about", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", "himself", "his", "how", "if", "in", "into", "is", "it", "its", "itself", "just", "me", "more", "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves", "experience", "years", "skills", "ability", "knowledge", "requirements", "responsibilities", "preferred", "required", "excellent", "strong", "written", "verbal", "communication"]);
    
    const jdWords = jd.toLowerCase().match(/\b(\w{4,})\b/g) || [];
    const wordFreq: Record<string, number> = {};
    
    jdWords.forEach(word => {
      if (!stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const resumeText = JSON.stringify(resume).toLowerCase();
    
    return Object.entries(wordFreq)
      .filter(([word]) => !resumeText.includes(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }, [jd, resume]);

  const handleAddSkill = (skill: string) => {
    dispatch(addSkill(skill));
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <SparklesIcon className="h-5 w-5 text-purple-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-purple-800">AI Skill Suggestions</h3>
      </div>
      
      <p className="mb-4 text-xs text-purple-700/70">
        We found these key terms in the job description that aren't in your resume yet. Click to add them:
      </p>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((skill) => (
          <button 
            key={skill} 
            onClick={() => handleAddSkill(skill)}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-purple-700 shadow-sm border border-purple-100 capitalize hover:bg-purple-600 hover:text-white transition-all active:scale-95"
          >
            <PlusIcon className="h-3 w-3" />
            {skill}
          </button>
        ))}
      </div>
    </div>
  );
};
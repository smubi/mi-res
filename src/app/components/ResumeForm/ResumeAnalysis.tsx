"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { 
  LightBulbIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

export const ResumeAnalysis = () => {
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const analysis = useMemo(() => {
    if (!jd) return null;

    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have", "using", "work", "team", "about", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", "himself", "his", "how", "if", "in", "into", "is", "it", "its", "itself", "just", "me", "more", "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves"]);
    
    const jdWords = jd.toLowerCase().match(/\b(\w{4,})\b/g) || [];
    const wordFreq: Record<string, number> = {};
    jdWords.forEach(word => {
      if (!stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const resumeText = JSON.stringify(resume).toLowerCase();
    const missing = Object.entries(wordFreq)
      .filter(([word]) => !resumeText.includes(word))
      .sort((a, b) => b[1] - a[1]);
    
    const tips = [];

    // Critical Missing Keywords (Top 3 most frequent in JD)
    if (missing.length > 0) {
      const critical = missing.slice(0, 3).map(m => m[0]);
      tips.push({
        type: "critical",
        text: `Critical keywords missing: ${critical.join(", ")}. These appear frequently in the JD and are likely high priority for ATS.`
      });
    }

    // Content Density Check
    const totalBullets = resume.workExperiences.reduce((acc, curr) => acc + curr.descriptions.length, 0);
    if (totalBullets < 5) {
      tips.push({
        type: "info",
        text: "Your experience section is a bit thin. Use the AI Optimizer to expand your bullet points with more detail."
      });
    }

    // Summary Check
    if (resume.profile.summary.length < 50) {
      tips.push({
        type: "warning",
        text: "Your professional summary is quite short. A robust summary helps ATS systems categorize your profile correctly."
      });
    }

    // Action Verb Check
    const actionVerbs = ["led", "managed", "developed", "created", "optimized", "spearheaded"];
    const hasActionVerbs = resume.workExperiences.some(w => 
      w.descriptions.some(d => actionVerbs.some(v => d.toLowerCase().includes(v)))
    );
    if (!hasActionVerbs && totalBullets > 0) {
      tips.push({
        type: "info",
        text: "Try starting your bullet points with stronger action verbs like 'Spearheaded' or 'Architected'."
      });
    }

    return { tips };
  }, [jd, resume]);

  if (!analysis) return null;

  return (
    <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <LightBulbIcon className="h-5 w-5 text-sky-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-sky-800">Smart Analysis</h3>
      </div>
      
      <div className="space-y-3">
        {analysis.tips.map((tip, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-lg bg-white p-3 text-xs font-medium text-gray-700 shadow-sm border border-sky-100/50">
            {tip.type === 'critical' ? (
              <ExclamationTriangleIcon className="h-4 w-4 shrink-0 text-red-500" />
            ) : tip.type === 'warning' ? (
              <ExclamationTriangleIcon className="h-4 w-4 shrink-0 text-amber-500" />
            ) : (
              <InformationCircleIcon className="h-4 w-4 shrink-0 text-sky-500" />
            )}
            <span>{tip.text}</span>
          </div>
        ))}
        {analysis.tips.length === 0 && (
          <div className="flex items-center gap-3 rounded-lg bg-white p-3 text-xs font-medium text-green-700 shadow-sm border border-green-100">
            <CheckCircleIcon className="h-4 w-4 shrink-0 text-green-500" />
            <span>Your resume is highly optimized for this job description!</span>
          </div>
        )}
      </div>
    </div>
  );
};
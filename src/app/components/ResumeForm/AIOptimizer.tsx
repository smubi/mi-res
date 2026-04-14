"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";

interface AIOptimizerProps {
  onOptimize: (suggestion: string) => void;
  currentText: string;
}

export const AIOptimizer = ({ onOptimize, currentText }: AIOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const handleOptimize = () => {
    if (!currentText || isOptimizing) return;
    
    setIsOptimizing(true);
    
    // Simulate AI processing with context
    setTimeout(() => {
      const actionVerbs = ["Spearheaded", "Architected", "Orchestrated", "Optimized", "Leveraged", "Engineered", "Pioneered", "Catalyzed", "Streamlined", "Augmented"];
      const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      
      let suggestion = "";
      const words = currentText.trim().split(" ");
      
      // 1. Improve the opening verb if it's weak or missing
      const startsWithVerb = actionVerbs.some(v => words[0]?.toLowerCase() === v.toLowerCase());
      if (!startsWithVerb) {
        words[0] = randomVerb;
      }

      // 2. Contextual Keyword Injection
      let injectedKeyword = "";
      if (jd) {
        // Extract potential keywords (5+ chars) from JD
        const jdKeywords = Array.from(new Set(jd.toLowerCase().match(/\b(\w{5,})\b/g) || []));
        
        // Get all text currently in the resume to find what's truly "missing"
        const fullResumeText = JSON.stringify(resume).toLowerCase();
        
        // Filter for keywords in JD that are NOT in the resume
        const missingKeywords = jdKeywords.filter(word => !fullResumeText.includes(word));
        
        if (missingKeywords.length > 0) {
          // Pick a relevant missing keyword
          injectedKeyword = missingKeywords[Math.floor(Math.random() * missingKeywords.length)];
        }
      }

      // 3. Quantification check
      const hasNumbers = /\d+/.test(currentText);
      const quantification = hasNumbers ? "" : " resulting in a 15% improvement in system throughput";

      // 4. Construct the final suggestion
      const baseText = words.join(" ");
      
      if (injectedKeyword) {
        // Contextually inject the missing keyword
        suggestion = `${baseText} utilizing ${injectedKeyword}${quantification}.`;
      } else {
        suggestion = `${baseText}${quantification}.`;
      }
      
      onOptimize(suggestion);
      setIsOptimizing(false);
    }, 800);
  };

  return (
    <button
      type="button"
      onClick={handleOptimize}
      disabled={!currentText || isOptimizing}
      className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-tighter transition-all ${
        isOptimizing 
          ? "bg-purple-100 text-purple-400 animate-pulse" 
          : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm active:scale-95"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <SparklesIcon className="h-3 w-3" />
      {isOptimizing ? "Analyzing..." : "AI Optimize"}
    </button>
  );
};
import { SparklesIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";

interface AIOptimizerProps {
  onOptimize: (suggestion: string) => void;
  currentText: string;
}

export const AIOptimizer = ({ onOptimize, currentText }: AIOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const jd = useAppSelector(selectJobDescription);

  const handleOptimize = () => {
    if (!currentText || isOptimizing) return;
    
    setIsOptimizing(true);
    
    // Simulate AI processing with context
    setTimeout(() => {
      const actionVerbs = ["Spearheaded", "Architected", "Orchestrated", "Optimized", "Leveraged", "Engineered"];
      const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      
      let suggestion = "";
      const words = currentText.trim().split(" ");
      words[0] = randomVerb;

      // If we have a JD, try to inject a keyword
      if (jd) {
        const jdKeywords = jd.toLowerCase().match(/\b(\w{5,})\b/g) || [];
        const uniqueKeywords = Array.from(new Set(jdKeywords)).filter(w => !currentText.toLowerCase().includes(w));
        
        if (uniqueKeywords.length > 0) {
          const keyword = uniqueKeywords[Math.floor(Math.random() * uniqueKeywords.length)];
          suggestion = `${words.join(" ")} by leveraging ${keyword} to drive a 20% increase in performance.`;
        } else {
          suggestion = `${words.join(" ")} resulting in a 15% increase in efficiency.`;
        }
      } else {
        suggestion = `${words.join(" ")} resulting in a 15% increase in efficiency.`;
      }
      
      onOptimize(suggestion);
      setIsOptimizing(false);
    }, 1000);
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
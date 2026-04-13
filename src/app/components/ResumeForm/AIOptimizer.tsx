import { SparklesIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

interface AIOptimizerProps {
  onOptimize: (suggestion: string) => void;
  currentText: string;
}

export const AIOptimizer = ({ onOptimize, currentText }: AIOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = () => {
    if (!currentText || isOptimizing) return;
    
    setIsOptimizing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const actionVerbs = ["Spearheaded", "Architected", "Orchestrated", "Optimized", "Leveraged", "Engineered"];
      const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      
      // Simple heuristic: replace the first word with a strong action verb if it's not already one
      const words = currentText.trim().split(" ");
      words[0] = randomVerb;
      const suggestion = words.join(" ") + " resulting in a 15% increase in efficiency.";
      
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
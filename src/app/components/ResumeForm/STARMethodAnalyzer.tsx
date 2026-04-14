import React from "react";
import { CheckCircleIcon, XCircleIcon, LightBulbIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";

const ACTION_VERBS = [
  "led", "managed", "developed", "created", "optimized", "increased", "decreased", "improved", "saved", "reduced", "grew", "built", "designed", "implemented", "coordinated", "analyzed"
];

export const STARMethodAnalyzer = () => {
  const resume = useAppSelector(selectResume);
  const allBulletPoints = resume.workExperiences.flatMap(exp => 
    exp.descriptions.map(desc => ({ desc, company: exp.company }))
  );

  const analyzeBullet = (bullet: string) => {
    const hasAction = ACTION_VERBS.some(verb => bullet.toLowerCase().includes(verb));
    const hasResult = /\d+|%|\$|increased|decreased|improved|saved|reduced|grew/.test(bullet.toLowerCase());
    return { hasAction, hasResult };
  };

  if (allBulletPoints.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">STAR Method Analyzer</h3>
        </div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Impact Check</span>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        The STAR method (Situation, Task, Action, Result) is the gold standard for resume bullet points. We check if your points have an **Action** and a **Result**.
      </p>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
        {allBulletPoints.map((item, idx) => {
          const { hasAction, hasResult } = analyzeBullet(item.desc);
          const isPerfect = hasAction && hasResult;

          return (
            <div key={idx} className={`p-3 rounded-xl border transition-all ${
              isPerfect 
                ? "bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20" 
                : "bg-slate-50 border-slate-100 dark:bg-slate-800/50 dark:border-slate-800"
            }`}>
              <div className="flex items-start gap-3">
                {isPerfect ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-slate-800 dark:text-slate-200 mb-2 italic">"{item.desc}"</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge active={hasAction} label="Action Verb" />
                    <Badge active={hasResult} label="Quantifiable Result" />
                  </div>
                  {!isPerfect && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                      <LightBulbIcon className="w-3.5 h-3.5 mt-0.5" />
                      <span>
                        {!hasAction && "Start with a strong action verb. "}
                        {!hasResult && "Add a number, percentage, or specific outcome to show impact."}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Badge = ({ active, label }: { active: boolean; label: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${
    active 
      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" 
      : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700"
  }`}>
    {label}
  </span>
);

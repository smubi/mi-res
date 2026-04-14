import React, { useMemo } from "react";
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, ChevronRightIcon, ChevronDownIcon, LightBulbIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { Resume } from "../../lib/redux/types";
import { calculateATSScore, ATSCriterion } from "../../lib/ats-scorer";

interface ATSMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume;
  jobDescription: string;
}

export const ATSMatchModal: React.FC<ATSMatchModalProps> = ({
  isOpen,
  onClose,
  resume,
  jobDescription,
}) => {
  const report = useMemo(() => {
    if (!isOpen) return null;
    return calculateATSScore(resume, jobDescription);
  }, [isOpen, resume, jobDescription]);

  if (!isOpen || !report) return null;

  const categories = ["Content", "Technical", "Formatting"] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ATS Match Report</h2>
            <p className="text-slate-500 dark:text-slate-400">Matching against: <span className="font-medium text-blue-600 dark:text-blue-400">{report.jobTitle}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Score Summary */}
        {!jobDescription.trim() ? (
          <div className="p-8 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-900/30 flex flex-col items-center text-center">
            <ExclamationCircleIcon className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Job Description Missing</h3>
            <p className="text-yellow-700 dark:text-yellow-300 max-w-md">
              Please provide a job description in the "Job Matching" section to get a more accurate ATS match report.
            </p>
          </div>
        ) : (
          <div className="p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * report.overallScore) / 100}
                  className={`${
                    report.overallScore >= 80 ? "text-green-500" : report.overallScore >= 50 ? "text-yellow-500" : "text-red-500"
                  } transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{report.overallScore}%</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Match</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {report.overallScore >= 80 ? "Excellent Match!" : report.overallScore >= 50 ? "Good Potential" : "Needs Optimization"}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mb-4">
                Your resume has been analyzed against 20 key ATS criteria.
                {report.overallScore < 80 ? " Follow the tips below to improve your score and increase your chances of getting noticed." : " Your resume is well-optimized for this role."}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <BookOpenIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Readability: {report.readabilityScore}%</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <LightBulbIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{report.missingKeywords.length} Missing Keywords</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Missing Keywords Section */}
        {report.missingKeywords.length > 0 && (
          <div className="px-6 py-4 bg-amber-50/50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/20">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <LightBulbIcon className="w-4 h-4" />
              Top Missing Keywords to Include
            </h4>
            <div className="flex flex-wrap gap-2">
              {report.missingKeywords.map(keyword => (
                <span key={keyword} className="px-2.5 py-1 bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-md border border-amber-200 dark:border-amber-800 shadow-sm">
                  + {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Checklist */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {categories.map(category => (
            <div key={category} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">{category}</h4>
              <div className="grid gap-3">
                {report.criteria
                  .filter(c => c.category === category)
                  .map(criterion => (
                    <CriterionItem key={criterion.id} criterion={criterion} />
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Got it, I'll improve it!
          </button>
        </div>
      </div>
    </div>
  );
};

const CriterionItem: React.FC<{ criterion: ATSCriterion }> = ({ criterion }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const StatusIcon = {
    pass: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    warning: <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />,
    fail: <XCircleIcon className="w-5 h-5 text-red-500" />,
  }[criterion.status];

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <div className="flex-shrink-0">{StatusIcon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-white">{criterion.name}</span>
            <span className="text-sm font-medium text-slate-500">{criterion.score}/100</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{criterion.message}</p>
        </div>
        <div className="flex-shrink-0 text-slate-400">
          {isExpanded ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/50">
          <div className="ml-8 pt-3">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{criterion.message}</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-1">Pro Tip</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">{criterion.tip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

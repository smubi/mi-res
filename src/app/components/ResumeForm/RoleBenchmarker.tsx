"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { useState, useMemo } from "react";
import { ROLE_BENCHMARKS } from "lib/benchmarking-data";
import { CheckCircle2, XCircle, ChevronDown } from "lucide-react";

export const RoleBenchmarker = () => {
  const resume = useAppSelector(selectResume);
  const [selectedRole, setSelectedRole] = useState(ROLE_BENCHMARKS[0].role);

  const benchmark = useMemo(() => {
    const roleData = ROLE_BENCHMARKS.find(r => r.role === selectedRole);
    if (!roleData) return null;

    const resumeText = JSON.stringify(resume).toLowerCase();
    
    const results = roleData.skills.map(skill => ({
      skill,
      matched: resumeText.includes(skill.toLowerCase())
    }));

    const score = Math.round((results.filter(r => r.matched).length / results.length) * 100);

    return { results, score };
  }, [selectedRole, resume]);

  if (!benchmark) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
          Role Benchmarking
        </h3>
        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="appearance-none rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-8 text-xs font-bold text-gray-700 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {ROLE_BENCHMARKS.map(r => (
              <option key={r.role} value={r.role}>{r.role}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-16 w-16">
          <svg className="h-full w-full" viewBox="0 0 36 36">
            <path
              className="stroke-gray-100 dark:stroke-gray-800"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="stroke-indigo-600 transition-all duration-1000"
              strokeWidth="3"
              strokeDasharray={`${benchmark.score}, 100`}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-indigo-600">
            {benchmark.score}%
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase">Match for {selectedRole}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {benchmark.results.filter(r => r.matched).length} of {benchmark.results.length} key skills found
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {benchmark.results.map(({ skill, matched }) => (
          <div 
            key={skill} 
            className={`flex items-center gap-2 rounded-lg border p-2 transition-colors ${
              matched 
                ? 'border-green-100 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400' 
                : 'border-gray-100 bg-gray-50 text-gray-400 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-500'
            }`}
          >
            {matched ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            <span className="text-[10px] font-bold truncate">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectSnapshots } from "lib/redux/snapshotSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

export const ResumeProgressChart = () => {
  const snapshots = useAppSelector(selectSnapshots);
  const currentResume = useAppSelector(selectResume);

  const calculateScore = (resume: any) => {
    let score = 0;
    if (resume.profile.name) score += 10;
    if (resume.profile.email) score += 10;
    const allBullets = [
      ...resume.workExperiences.flatMap((w: any) => w.descriptions),
      ...resume.projects.flatMap((p: any) => p.descriptions)
    ];
    score += Math.min(40, allBullets.length * 4);
    const metricsCount = allBullets.filter((b: string) => /\d+%|\d+\s?percent|\$\d+|\d+\+/.test(b)).length;
    score += Math.round((metricsCount / Math.max(1, allBullets.length)) * 40);
    return Math.min(100, score);
  };

  const history = useMemo(() => {
    const data = snapshots.map(s => ({
      name: s.name,
      score: calculateScore(s.resume),
      date: new Date(s.timestamp).toLocaleDateString()
    }));
    data.push({
      name: "Current",
      score: calculateScore(currentResume),
      date: "Now"
    });
    return data;
  }, [snapshots, currentResume]);

  if (snapshots.length === 0) return null;

  const maxScore = Math.max(...history.map(h => h.score));
  const firstScore = history[0].score;
  const currentScore = history[history.length - 1].score;
  const improvement = currentScore - firstScore;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5 text-sky-600" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Optimization Journey</h3>
        </div>
        {improvement > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-black text-green-700">
            <ArrowTrendingUpIcon className="h-3 w-3" />
            +{improvement}pts Improvement
          </div>
        )}
      </div>

      <div className="flex h-32 items-end gap-2 px-2">
        {history.map((item, idx) => (
          <div key={idx} className="group relative flex flex-1 flex-col items-center gap-2">
            <div 
              className={cx(
                "w-full rounded-t-md transition-all duration-500",
                idx === history.length - 1 ? "bg-sky-500" : "bg-gray-200 group-hover:bg-gray-300"
              )}
              style={{ height: `${(item.score / 100) * 100}%` }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold text-white">{item.score}%</span>
              </div>
            </div>
            <span className="w-full truncate text-center text-[8px] font-bold text-gray-400 uppercase">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <SparklesIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Peak Score</p>
            <p className="text-sm font-black text-gray-900">{maxScore}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <ClockIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Versions</p>
            <p className="text-sm font-black text-gray-900">{history.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
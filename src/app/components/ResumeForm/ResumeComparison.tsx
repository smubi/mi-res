"use client";

import { useState, useMemo } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSnapshots } from "lib/redux/snapshotSlice";
import { selectJobDescription } from "lib/redux/aiSlice";
import { 
  ArrowsRightLeftIcon, 
  ScaleIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  MinusIcon 
} from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

export const ResumeComparison = () => {
  const currentResume = useAppSelector(selectResume);
  const snapshots = useAppSelector(selectSnapshots);
  const jd = useAppSelector(selectJobDescription);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>("");

  const selectedSnapshot = useMemo(() => 
    snapshots.find(s => s.id === selectedSnapshotId),
    [snapshots, selectedSnapshotId]
  );

  const comparison = useMemo(() => {
    if (!selectedSnapshot) return null;

    const getStats = (resume: any) => {
      const allBullets = [
        ...resume.workExperiences.flatMap((w: any) => w.descriptions),
        ...resume.projects.flatMap((p: any) => p.descriptions)
      ];
      
      const metricsCount = allBullets.filter((b: string) => /\d+%|\d+\s?percent|\$\d+|\d+\+/.test(b)).length;
      
      let atsScore = 0;
      if (jd) {
        const jdWords = Array.from(new Set(jd.toLowerCase().match(/\b(\w{4,})\b/g) || []));
        const resumeText = JSON.stringify(resume).toLowerCase();
        const matches = jdWords.filter(word => resumeText.includes(word));
        atsScore = jdWords.length > 0 ? Math.round((matches.length / jdWords.length) * 100) : 0;
      }

      return {
        bulletCount: allBullets.length,
        metricsCount,
        atsScore,
        wordCount: JSON.stringify(resume).split(" ").length
      };
    };

    const current = getStats(currentResume);
    const previous = getStats(selectedSnapshot.resume);

    return [
      { label: "ATS Match Score", current: current.atsScore, previous: previous.atsScore, suffix: "%" },
      { label: "Total Bullet Points", current: current.bulletCount, previous: previous.bulletCount },
      { label: "Quantified Impact", current: current.metricsCount, previous: previous.metricsCount },
      { label: "Estimated Word Count", current: current.wordCount, previous: previous.wordCount },
    ];
  }, [currentResume, selectedSnapshot, jd]);

  if (snapshots.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowsRightLeftIcon className="h-5 w-5 text-sky-600" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Version Comparison</h3>
        </div>
      </div>

      <div className="mb-6">
        <select 
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs font-medium outline-none focus:border-sky-500"
          value={selectedSnapshotId}
          onChange={(e) => setSelectedSnapshotId(e.target.value)}
        >
          <option value="">Select a version to compare...</option>
          {snapshots.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({new Date(s.timestamp).toLocaleDateString()})</option>
          ))}
        </select>
      </div>

      {comparison ? (
        <div className="space-y-4">
          {comparison.map((item, idx) => {
            const diff = item.current - item.previous;
            return (
              <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-gray-900">{item.current}{item.suffix}</span>
                    <span className="text-xs text-gray-400 line-through">vs {item.previous}{item.suffix}</span>
                  </div>
                </div>
                <div className={cx(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold",
                  diff > 0 ? "bg-green-100 text-green-700" : diff < 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
                )}>
                  {diff > 0 ? <ArrowTrendingUpIcon className="h-3 w-3" /> : diff < 0 ? <ArrowTrendingDownIcon className="h-3 w-3" /> : <MinusIcon className="h-3 w-3" />}
                  {diff > 0 ? "+" : ""}{diff}{item.suffix}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ScaleIcon className="mb-2 h-8 w-8 text-gray-200" />
          <p className="text-xs text-gray-400 italic">Select a version to see how your current resume compares to previous iterations.</p>
        </div>
      )}
    </div>
  );
};
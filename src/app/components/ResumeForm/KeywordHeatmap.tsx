"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";

export const KeywordHeatmap = () => {
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const heatmapData = useMemo(() => {
    if (!jd) return null;

    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have", "using", "work", "team", "experience", "knowledge", "skills", "ability"]);
    const jdKeywords = Array.from(new Set(jd.toLowerCase().match(/\b(\w{4,})\b/g) || []))
      .filter(word => !stopWords.has(word))
      .slice(0, 15);

    const sections = [
      { name: "Profile", text: resume.profile.summary.toLowerCase() },
      { name: "Work", text: resume.workExperiences.map(w => `${w.company} ${w.jobTitle} ${w.descriptions.join(" ")}`).join(" ").toLowerCase() },
      { name: "Projects", text: resume.projects.map(p => `${p.project} ${p.descriptions.join(" ")}`).join(" ").toLowerCase() },
      { name: "Skills", text: [...resume.skills.featuredSkills.map(s => s.skill), ...resume.skills.descriptions].join(" ").toLowerCase() },
    ];

    return {
      keywords: jdKeywords,
      sections: sections.map(s => ({
        name: s.name,
        scores: jdKeywords.map(kw => (s.text.match(new RegExp(`\\b${kw}\\b`, 'g')) || []).length)
      }))
    };
  }, [jd, resume]);

  if (!heatmapData) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
        Keyword Density Heatmap
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-[10px] font-bold text-gray-400 uppercase">Keyword</th>
              {heatmapData.sections.map(s => (
                <th key={s.name} className="p-2 text-center text-[10px] font-bold text-gray-400 uppercase">{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData.keywords.map((kw, i) => (
              <tr key={kw} className="border-t border-gray-50 dark:border-gray-800">
                <td className="p-2 text-xs font-medium text-gray-600 dark:text-gray-400">{kw}</td>
                {heatmapData.sections.map(s => {
                  const score = s.scores[i];
                  const opacity = Math.min(score * 0.3 + 0.1, 1);
                  return (
                    <td key={s.name} className="p-1">
                      <div 
                        className="flex h-8 w-full items-center justify-center rounded-md text-[10px] font-bold transition-all"
                        style={{ 
                          backgroundColor: score > 0 ? `rgba(79, 70, 229, ${opacity})` : 'transparent',
                          color: score > 0 ? (opacity > 0.5 ? 'white' : 'rgb(79, 70, 229)') : 'rgb(209, 213, 219)'
                        }}
                      >
                        {score}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

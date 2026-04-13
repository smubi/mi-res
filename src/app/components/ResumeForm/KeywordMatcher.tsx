import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume, changeSkills } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

export const KeywordMatcher = () => {
  const dispatch = useAppDispatch();
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const analysis = useMemo(() => {
    if (!jd) return { matches: [], missing: [], score: 0 };

    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have", "using", "work", "team", "experience", "skills", "knowledge"]);
    const jdWords = Array.from(new Set(jd.toLowerCase().match(/\b(\w{4,})\b/g) || []))
      .filter(word => !stopWords.has(word));

    const resumeText = JSON.stringify(resume).toLowerCase();
    
    const matches = jdWords.map(word => {
      const count = (resumeText.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
      return { word, count };
    }).filter(m => m.count > 0);

    const missing = jdWords.filter(word => !resumeText.includes(word)).slice(0, 12);
    
    const score = jdWords.length > 0 ? Math.round((matches.length / jdWords.length) * 100) : 0;

    return { matches, missing, score };
  }, [jd, resume]);

  const handleAutoTailor = () => {
    if (analysis.missing.length === 0) return;
    
    const newSkills = [...resume.skills.descriptions];
    const keywordsToAdd = analysis.missing.slice(0, 5).join(", ");
    newSkills.push(`Keywords: ${keywordsToAdd}`);
    
    dispatch(changeSkills({ field: "descriptions", value: newSkills }));
  };

  return (
    <div className="mt-4 space-y-6 rounded-xl bg-white p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-primary">Resume Match Score</h3>
          <p className="text-[10px] text-gray-400 font-medium uppercase">Based on Job Description Keywords</p>
        </div>
        <span className={`text-3xl font-black ${analysis.score > 70 ? 'text-green-600' : analysis.score > 40 ? 'text-amber-500' : 'text-red-500'}`}>
          {analysis.score}%
        </span>
      </div>
      
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${analysis.score > 70 ? 'bg-green-500' : analysis.score > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
          style={{ width: `${analysis.score}%` }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-green-700 uppercase tracking-widest">Matched ({analysis.matches.length})</h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.matches.slice(0, 10).map(({ word, count }) => (
              <span key={word} className="flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700 border border-green-100">
                {word}
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-200 text-[8px]">{count}</span>
              </span>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Missing ({analysis.missing.length})</h4>
            {analysis.missing.length > 0 && (
              <button 
                onClick={handleAutoTailor}
                className="flex items-center gap-1 text-[9px] font-black text-purple-600 hover:text-purple-700 uppercase tracking-tighter"
              >
                <SparklesIcon className="h-3 w-3" />
                Auto-Inject
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missing.map(word => (
              <span key={word} className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700 border border-amber-100">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
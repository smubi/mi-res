import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";

export const KeywordMatcher = () => {
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const analysis = useMemo(() => {
    if (!jd) return { matches: [], missing: [], score: 0 };

    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have", "using", "work", "team"]);
    const jdWords = Array.from(new Set(jd.toLowerCase().match(/\b(\w{4,})\b/g) || []))
      .filter(word => !stopWords.has(word));

    const resumeText = JSON.stringify(resume).toLowerCase();
    
    const matches = jdWords.filter(word => resumeText.includes(word));
    const missing = jdWords.filter(word => !resumeText.includes(word)).slice(0, 12);
    
    const score = jdWords.length > 0 ? Math.round((matches.length / jdWords.length) * 100) : 0;

    return { matches, missing, score };
  }, [jd, resume]);

  return (
    <div className="mt-4 space-y-6 rounded-xl bg-white p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Resume Match Score</h3>
        <span className={`text-2xl font-black ${analysis.score > 70 ? 'text-green-600' : analysis.score > 40 ? 'text-amber-500' : 'text-red-500'}`}>
          {analysis.score}%
        </span>
      </div>
      
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${analysis.score > 70 ? 'bg-green-500' : analysis.score > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
          style={{ width: `${analysis.score}%` }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-green-700 uppercase">Matched ({analysis.matches.length})</h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.matches.slice(0, 10).map(word => (
              <span key={word} className="rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 border border-green-100">
                {word}
              </span>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-amber-700 uppercase">Missing ({analysis.missing.length})</h4>
          <div className="flex flex-wrap gap-1.5">
            {analysis.missing.map(word => (
              <span key={word} className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-100">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
import { useAppSelector } from "lib/redux/hooks";
import { selectJobDescription } from "lib/redux/aiSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";

export const KeywordMatcher = () => {
  const jd = useAppSelector(selectJobDescription);
  const resume = useAppSelector(selectResume);

  const analysis = useMemo(() => {
    if (!jd) return { matches: [], missing: [] };

    // Simple keyword extraction (words > 3 chars, excluding common ones)
    const stopWords = new Set(["with", "from", "that", "this", "their", "they", "will", "have"]);
    const jdWords = Array.from(new Set(jd.toLowerCase().match(/\b(\w{4,})\b/g) || []))
      .filter(word => !stopWords.has(word));

    const resumeText = JSON.stringify(resume).toLowerCase();
    
    const matches = jdWords.filter(word => resumeText.includes(word));
    const missing = jdWords.filter(word => !resumeText.includes(word)).slice(0, 10);

    return { matches, missing };
  }, [jd, resume]);

  return (
    <div className="mt-4 space-y-4 rounded-lg bg-gray-50 p-4 border border-gray-200">
      <div>
        <h3 className="text-sm font-bold text-green-700 flex items-center gap-2">
          ✅ Matched Keywords ({analysis.matches.length})
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {analysis.matches.slice(0, 15).map(word => (
            <span key={word} className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              {word}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-bold text-amber-700 flex items-center gap-2">
          🔍 Missing Keywords ({analysis.missing.length}+)
        </h3>
        <p className="text-xs text-gray-500 mb-2 italic">Try incorporating these into your bullet points:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {analysis.missing.map(word => (
            <span key={word} className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
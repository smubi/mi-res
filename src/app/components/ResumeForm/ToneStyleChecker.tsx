"use client";

import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { useMemo } from "react";
import { 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

const CLICHES = [
  "team player", "hard worker", "self-motivated", "detail-oriented", 
  "think outside the box", "go-getter", "results-driven", "synergy",
  "passionate", "dynamic", "proven track record"
];

const PASSIVE_VOICE_INDICATORS = [
  "was responsible for", "was tasked with", "assisted in", "helped with",
  "duties included", "served as"
];

export const ToneStyleChecker = () => {
  const resume = useAppSelector(selectResume);

  const analysis = useMemo(() => {
    const issues = [];
    const allText = JSON.stringify(resume).toLowerCase();
    const allBullets = [
      ...resume.workExperiences.flatMap(w => w.descriptions),
      ...resume.projects.flatMap(p => p.descriptions)
    ];

    // 1. Cliché Check
    const foundCliches = CLICHES.filter(cliche => allText.includes(cliche));
    if (foundCliches.length > 0) {
      issues.push({
        title: "Avoid Clichés",
        text: `Found overused phrases: ${foundCliches.slice(0, 3).join(", ")}. Try replacing these with specific achievements.`,
        type: "warning"
      });
    }

    // 2. Passive Voice Check
    const passiveBullets = allBullets.filter(b => 
      PASSIVE_VOICE_INDICATORS.some(indicator => b.toLowerCase().includes(indicator))
    );
    if (passiveBullets.length > 0) {
      issues.push({
        title: "Use Active Voice",
        text: `${passiveBullets.length} bullet points use passive language. Use strong action verbs to sound more decisive.`,
        type: "info"
      });
    }

    // 3. Bullet Consistency
    if (allBullets.length > 0) {
      const lengths = allBullets.map(b => b.length);
      const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const inconsistent = lengths.filter(l => Math.abs(l - avg) > avg * 0.8);
      if (inconsistent.length > 2) {
        issues.push({
          title: "Inconsistent Lengths",
          text: "Your bullet points vary significantly in length. Aim for a consistent 1-2 lines per point for better readability.",
          type: "info"
        });
      }
    }

    // 4. Personal Pronouns
    const pronouns = [" i ", " me ", " my ", " we ", " our "];
    const hasPronouns = pronouns.some(p => allText.includes(p));
    if (hasPronouns) {
      issues.push({
        title: "Remove First-Person",
        text: "Resumes should generally avoid 'I', 'Me', or 'My'. Use implied first-person instead (e.g., 'Led team' instead of 'I led a team').",
        type: "warning"
      });
    }

    return issues;
  }, [resume]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Tone & Style Checker</h3>
      </div>

      <div className="space-y-3">
        {analysis.map((issue, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 border border-gray-100">
            {issue.type === 'warning' ? (
              <ExclamationTriangleIcon className="h-4 w-4 shrink-0 text-amber-500" />
            ) : (
              <InformationCircleIcon className="h-4 w-4 shrink-0 text-sky-500" />
            )}
            <div>
              <p className="text-xs font-bold text-gray-900">{issue.title}</p>
              <p className="mt-0.5 text-[11px] text-gray-600 leading-relaxed">{issue.text}</p>
            </div>
          </div>
        ))}
        {analysis.length === 0 && (
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 text-xs font-medium text-green-700 border border-green-100">
            <CheckCircleIcon className="h-4 w-4 shrink-0 text-green-500" />
            <span>Your writing style is professional and concise!</span>
          </div>
        )}
      </div>
    </div>
  );
};
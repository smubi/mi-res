"use client";

import { useMemo } from "react";
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  NoSymbolIcon,
  ColumnsIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import type { TextItems, Lines } from "lib/parse-resume-from-pdf/types";

interface RedFlag {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  icon: any;
}

export const ATSDiagnosticPanel = ({ 
  textItems, 
  lines 
}: { 
  textItems: TextItems; 
  lines: Lines;
}) => {
  const redFlags = useMemo(() => {
    const flags: RedFlag[] = [];

    // 1. Detect Multi-column Layout
    // Heuristic: Check if many lines have text items with large horizontal gaps
    let multiColumnLines = 0;
    lines.forEach(line => {
      if (line.length > 1) {
        for (let i = 1; i < line.length; i++) {
          const gap = line[i].x - (line[i-1].x + line[i-1].width);
          if (gap > 100) { // Significant horizontal gap
            multiColumnLines++;
            break;
          }
        }
      }
    });

    if (multiColumnLines > lines.length * 0.2) {
      flags.push({
        id: "multi-column",
        title: "Multi-column Layout Detected",
        description: "ATS systems often read left-to-right across the whole page, which can scramble text in multiple columns. Use a single-column layout for best results.",
        severity: "critical",
        icon: ColumnsIcon
      });
    }

    // 2. Detect Potential Unparseable Icons/Graphics
    // Heuristic: Look for very small text items or non-standard characters
    const suspiciousItems = textItems.filter(item => {
      const isSmall = item.width < 5 && item.text.trim().length > 0;
      const isNonStandard = /[^\x20-\x7E]/.test(item.text); // Non-ASCII
      return isSmall || isNonStandard;
    });

    if (suspiciousItems.length > 5) {
      flags.push({
        id: "unparseable-icons",
        title: "Unparseable Elements",
        description: "We detected icons or special characters that might not be readable by older ATS. Stick to standard text for contact info and section headers.",
        severity: "warning",
        icon: NoSymbolIcon
      });
    }

    // 3. Detect "Invisible Text" or Keyword Stuffing
    // Heuristic: Look for lines with extremely high word density or repetitive keywords
    let keywordStuffingDetected = false;
    lines.forEach(line => {
      const text = line.map(i => i.text).join(" ");
      const words = text.split(/\s+/);
      if (words.length > 30 && line.length === 1) { // Unusually long single-item line
        keywordStuffingDetected = true;
      }
    });

    if (keywordStuffingDetected) {
      flags.push({
        id: "keyword-stuffing",
        title: "Potential Keyword Stuffing",
        description: "Hidden text or long lists of keywords without context can be flagged as 'gaming the system' by modern ATS. Ensure all keywords are integrated into your experience.",
        severity: "warning",
        icon: EyeSlashIcon
      });
    }

    return flags;
  }, [textItems, lines]);

  return (
    <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-red-700">ATS Diagnostic Scan</h3>
        </div>
        <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-black text-red-600">
          {redFlags.length} ISSUES FOUND
        </span>
      </div>

      <div className="space-y-4">
        {redFlags.length > 0 ? (
          redFlags.map((flag) => (
            <div key={flag.id} className="flex gap-4 rounded-xl border border-gray-50 bg-gray-50/50 p-4 transition-colors hover:border-red-100 hover:bg-red-50/30">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                flag.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              }`}>
                <flag.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{flag.title}</h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">{flag.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">No Red Flags Detected</h4>
            <p className="mt-1 text-xs text-gray-500 px-8">Your resume structure appears to be highly compatible with modern ATS systems.</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="text-[10px] font-medium text-gray-400 text-center uppercase tracking-tighter">
          Scan powered by OpenResume Readability Engine v2.0
        </p>
      </div>
    </div>
  );
};
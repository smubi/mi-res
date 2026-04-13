"use client";

import { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";

export const PlainTextPreview = ({ textItems }: { textItems: TextItems }) => {
  const lines = groupTextItemsIntoLines(textItems);
  const plainText = lines.map(line => line.map(item => item.text).join(" ")).join("\n");

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-900 p-6 shadow-inner">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">ATS Plain Text View</h3>
        <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-gray-400">RAW OUTPUT</span>
      </div>
      <pre className="max-h-[500px] overflow-y-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-green-400/90 scrollbar-thin scrollbar-thumb-gray-700">
        {plainText || "No text detected..."}
      </pre>
    </div>
  );
};
"use client";

import { useState } from "react";
import { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

export const PlainTextPreview = ({ textItems }: { textItems: TextItems }) => {
  const [copied, setCopied] = useState(false);
  const lines = groupTextItemsIntoLines(textItems);
  const plainText = lines.map(line => line.map(item => item.text).join(" ")).join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-900 p-6 shadow-inner h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">ATS Plain Text View</h3>
          <span className="rounded bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-gray-400">RAW OUTPUT</span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-400 hover:bg-gray-700 hover:text-white transition-all"
        >
          {copied ? <CheckIcon className="h-3 w-3 text-green-500" /> : <ClipboardIcon className="h-3 w-3" />}
          {copied ? "Copied!" : "Copy Text"}
        </button>
      </div>
      <pre className="flex-1 overflow-y-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-green-400/90 scrollbar-thin scrollbar-thumb-gray-700 pr-2">
        {plainText || "No text detected..."}
      </pre>
    </div>
  );
};
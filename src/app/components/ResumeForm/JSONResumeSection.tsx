"use client";
import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectResume, setResume } from "lib/redux/resumeSlice";
import { mapResumeToJsonResume, mapJsonResumeToResume, type JsonResume } from "lib/json-resume";
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export const JSONResumeSection = () => {
  const resume = useAppSelector(selectResume);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const jsonResume = mapResumeToJsonResume(resume);
    const blob = new Blob([JSON.stringify(jsonResume, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const json = JSON.parse(content) as JsonResume;
        const newResume = mapJsonResumeToResume(json);
        dispatch(setResume(newResume));
      } catch (err) {
        alert("Invalid JSON format. Please check your file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          JSON Resume Schema
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Import or export your resume data using the standardized JSON Resume format.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export JSON
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowUpTrayIcon className="h-4 w-4" />
          Import JSON
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleImport}
        />
      </div>
    </div>
  );
};

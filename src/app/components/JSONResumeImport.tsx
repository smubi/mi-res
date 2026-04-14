"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { mapJsonResumeToResume, type JsonResume } from "lib/json-resume";
import {
  saveStateToLocalStorage,
  getHasUsedAppBefore,
} from "lib/redux/local-storage";
import { initialSettings, type ShowForm } from "lib/redux/settingsSlice";
import { initialAIState } from "lib/redux/aiSlice";
import { initialSnapshotState } from "lib/redux/snapshotSlice";
import { initialJobState } from "lib/redux/jobSlice";
import { deepClone } from "lib/deep-clone";
import { LockClosedIcon, DocumentArrowUpIcon } from "@heroicons/react/24/solid";
import type { FeaturedSkill } from "lib/redux/types";

export const JSONResumeImport = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImport = (jsonContent: string) => {
    try {
      const json = JSON.parse(jsonContent) as JsonResume;
      const resume = mapJsonResumeToResume(json);
      const settings = deepClone(initialSettings);

      if (getHasUsedAppBefore()) {
        const sections = Object.keys(settings.formToShow) as ShowForm[];
        const sectionToFormToShow: Record<ShowForm, boolean> = {
          workExperiences: resume.workExperiences.length > 0,
          educations: resume.educations.length > 0,
          projects: resume.projects.length > 0,
          skills:
            resume.skills.descriptions.length > 0 ||
            resume.skills.featuredSkills.some((s: FeaturedSkill) => s.skill),
          custom: resume.custom.descriptions.length > 0,
        };
        for (const section of sections) {
          settings.formToShow[section] = sectionToFormToShow[section];
        }
      }

      saveStateToLocalStorage({
        resume,
        settings,
        ai: initialAIState,
        snapshots: initialSnapshotState,
        jobs: initialJobState,
      });
      router.push("/resume-builder");
    } catch (err) {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  const onImportClick = () => {
    if (!text.trim()) {
      setError("Please paste your JSON Resume content.");
      return;
    }
    setIsLoading(true);
    setError(null);
    handleImport(text);
    setIsLoading(false);
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleImport(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="mt-8 text-left">
      <h2 className="text-lg font-semibold text-gray-900">
        Import from JSON Resume
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Upload a .json file or paste your JSON Resume content below.
      </p>
      
      <div className="mt-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-4 text-sm font-medium text-gray-600 hover:border-sky-500 hover:text-sky-500"
        >
          <DocumentArrowUpIcon className="mr-2 h-5 w-5" />
          Upload .json file
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={onFileUpload}
        />
      </div>

      <textarea
        className="mt-4 block w-full rounded-md border border-gray-300 p-4 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
        rows={6}
        placeholder='{ "basics": { "name": "John Doe", ... } }'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <div className="mt-4 flex items-center justify-between">
        <p className="flex text-xs text-gray-500">
          <LockClosedIcon className="mr-1 h-3 w-3 text-gray-400" />
          Data is processed locally in your browser
        </p>
        <button
          type="button"
          className="btn-primary disabled:opacity-50"
          onClick={onImportClick}
          disabled={isLoading || !text.trim()}
        >
          {isLoading ? "Importing..." : "Import and Continue"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

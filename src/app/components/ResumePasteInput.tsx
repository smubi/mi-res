"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseResumeFromText } from "lib/parse-resume-from-text";
import {
  saveStateToLocalStorage,
  getHasUsedAppBefore,
} from "lib/redux/local-storage";
import { initialSettings, type ShowForm } from "lib/redux/settingsSlice";
import { deepClone } from "lib/deep-clone";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import type { FeaturedSkill } from "lib/redux/types";

export const ResumePasteInput = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onImportClick = async () => {
    if (!text.trim()) {
      setError("Please paste your resume text.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const resume = await parseResumeFromText(text);
      const settings = deepClone(initialSettings);

      // Set formToShow settings based on uploaded resume if users have used the app before
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

      // Save to local storage. We provide the full state to satisfy the type.
      saveStateToLocalStorage({
        resume,
        settings,
        ai: { jobDescription: "", isAnalyzing: false, coverLetter: "" },
        snapshots: { snapshots: [] },
      });
      router.push("/resume-builder");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while parsing the resume."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 text-left">
      <h2 className="text-lg font-semibold text-gray-900">
        Paste Resume Text (AI-Powered)
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Paste your resume content below and our AI will try to parse it into the
        builder format.
      </p>
      <textarea
        className="mt-4 block w-full rounded-md border border-gray-300 p-4 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
        rows={10}
        placeholder="Paste your resume text here..."
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
          {isLoading ? "Parsing..." : "Import and Continue"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

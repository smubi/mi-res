"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import { DropzoneOverlay } from "resume-parser/DropzoneOverlay";
import { ResultCard } from "resume-parser/ResultCard";
import { ResumeGrade } from "resume-parser/ResumeGrade";
import { PlainTextPreview } from "resume-parser/PlainTextPreview";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { initialSettings } from "lib/redux/settingsSlice";
import { initialAIState } from "lib/redux/aiSlice";
import { initialSnapshotState } from "lib/redux/snapshotSlice";
import { initialJobState } from "lib/redux/jobSlice";
import {
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  FileText,
  Upload,
  Sparkles,
  Terminal,
  Eye
} from "lucide-react";

export default function ResumeParser() {
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState("resume-example/laverne-resume.pdf");
  const [textItems, setTextItems] = useState<TextItems>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "text">("preview");

  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);

  useEffect(() => {
    async function loadInitial() {
      setIsLoading(true);
      const items = await readPdf(fileUrl);
      setTextItems(items);
      setIsLoading(false);
    }
    loadInitial();
  }, [fileUrl]);

  const handleFileDrop = (file: File) => {
    const url = URL.createObjectURL(file);
    setFileUrl(url);
  };

  const handleTailorResume = () => {
    saveStateToLocalStorage({
      resume,
      settings: initialSettings,
      ai: initialAIState,
      snapshots: initialSnapshotState,
      jobs: initialJobState,
    });
    router.push("/resume-builder");
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 dark:bg-slate-950">
      <DropzoneOverlay onDrop={handleFileDrop} />
      
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            ATS <span className="text-indigo-600">Checker</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            See exactly how Applicant Tracking Systems parse your resume.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-white dark:text-slate-900 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:opacity-90 active:scale-95">
              <Upload size={18} />
              Upload Resume PDF
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && handleFileDrop(e.target.files[0])}
              />
            </label>
            <button
              onClick={handleTailorResume}
              className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-xl transition-all hover:bg-indigo-700 active:scale-95"
            >
              <Sparkles size={18} />
              Optimize this Resume
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          
          <div className="lg:col-span-5">
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-3">
                <div className="flex rounded-lg bg-slate-200 dark:bg-slate-800 p-1">
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                  >
                    <Eye size={14} />
                    Preview
                  </button>
                  <button
                    onClick={() => setViewMode("text")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase transition-all ${viewMode === 'text' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                  >
                    <Terminal size={14} />
                    ATS View
                  </button>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document View</span>
              </div>
              
              <div className="aspect-[1/1.4] w-full">
                {viewMode === "preview" ? (
                  <iframe
                    src={`${fileUrl}#navpanes=0&toolbar=0`}
                    className={isLoading ? "opacity-20 transition-opacity" : "h-full w-full transition-opacity"}
                  />
                ) : (
                  <div className="h-full p-4 overflow-auto">
                    <PlainTextPreview textItems={textItems} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ResumeGrade resume={resume} />
            
            <div className="grid gap-6 sm:grid-cols-2">
              <ResultCard title="Profile" icon={User}>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{resume.profile.name || "Not found"}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{resume.profile.email}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{resume.profile.phone}</p>
                <p className="mt-2 text-xs italic text-slate-400 line-clamp-2">{resume.profile.summary}</p>
              </ResultCard>

              <ResultCard title="Education" icon={GraduationCap}>
                {resume.educations.map((edu, i) => (
                  <div key={i} className={i > 0 ? "mt-4 border-t border-slate-100 dark:border-slate-800 pt-4" : ""}>
                    <p className="font-bold text-slate-900 dark:text-white">{edu.school}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{edu.degree}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{edu.date}</p>
                  </div>
                ))}
              </ResultCard>

              <div className="sm:col-span-2">
                <ResultCard title="Work Experience" icon={Briefcase}>
                  <div className="grid gap-6 md:grid-cols-2">
                    {resume.workExperiences.map((work, i) => (
                      <div key={i} className="space-y-1">
                        <p className="font-bold text-slate-900 dark:text-white">{work.company}</p>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{work.jobTitle}</p>
                        <p className="text-xs text-slate-400">{work.date}</p>
                        <ul className="mt-2 space-y-1">
                          {work.descriptions.slice(0, 2).map((desc, j) => (
                            <li key={j} className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">• {desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </div>

              <ResultCard title="Skills" icon={Wrench}>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.featuredSkills.filter(s => s.skill).map((s, i) => (
                    <span key={i} className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                      {s.skill}
                    </span>
                  ))}
                  {resume.skills.descriptions.map((desc, i) => (
                    <span key={i} className="rounded-lg bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {desc}
                    </span>
                  ))}
                </div>
              </ResultCard>

              <ResultCard title="Additional Info" icon={FileText}>
                <div className="space-y-2">
                  {resume.custom.descriptions.length > 0 ? (
                    resume.custom.descriptions.map((desc, i) => (
                      <p key={i} className="text-xs text-slate-600 dark:text-slate-400 border-l-2 border-indigo-200 dark:border-indigo-800 pl-2 py-1 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-r">
                        {desc}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No additional sections found (Certifications, Languages, etc.)</p>
                  )}
                </div>
              </ResultCard>

              <ResultCard title="Raw Sections" icon={Terminal}>
                <div className="max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                  {Object.keys(sections).map((section, i) => (
                    <div key={i} className="mb-2 flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 capitalize">{section}</span>
                      <span className="text-[10px] font-bold text-slate-400">{sections[section].length} lines</span>
                    </div>
                  ))}
                </div>
              </ResultCard>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
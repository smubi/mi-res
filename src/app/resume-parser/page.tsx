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
import { ATSDiagnosticPanel } from "resume-parser/ATSDiagnosticPanel";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { initialSettings } from "lib/redux/settingsSlice";
import { 
  UserIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  WrenchIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  CommandLineIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

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
      ai: { jobDescription: "", isAnalyzing: false }
    } as any);
    router.push("/resume-builder");
  };

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      <DropzoneOverlay onDrop={handleFileDrop} />
      
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            Resume <span className="text-sky-500">Parser</span>
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Drop a PDF anywhere to see how ATS systems read your data.
          </p>
          
          <div className="mt-8 flex justify-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-95">
              <ArrowUpTrayIcon className="h-4 w-4" />
              Upload PDF
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf" 
                onChange={(e) => e.target.files?.[0] && handleFileDrop(e.target.files[0])} 
              />
            </label>
            <button 
              onClick={handleTailorResume}
              className="flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-purple-700 active:scale-95"
            >
              <SparklesIcon className="h-4 w-4" />
              Tailor this Resume
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-6">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3">
                  <div className="flex rounded-lg bg-gray-200 p-1">
                    <button 
                      onClick={() => setViewMode("preview")}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold uppercase transition-all ${viewMode === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <EyeIcon className="h-3 w-3" />
                      Preview
                    </button>
                    <button 
                      onClick={() => setViewMode("text")}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-[10px] font-bold uppercase transition-all ${viewMode === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <CommandLineIcon className="h-3 w-3" />
                      ATS View
                    </button>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Document View</span>
                </div>
                
                <div className="aspect-[1/1.4] w-full">
                  {viewMode === "preview" ? (
                    <iframe 
                      src={`${fileUrl}#navpanes=0&toolbar=0`} 
                      className={isLoading ? "opacity-20 transition-opacity" : "h-full w-full transition-opacity"} 
                    />
                  ) : (
                    <div className="h-full p-4">
                      <PlainTextPreview textItems={textItems} />
                    </div>
                  )}
                </div>
              </div>
              
              <ATSDiagnosticPanel textItems={textItems} lines={lines} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ResumeGrade resume={resume} />
            
            <div className="grid gap-6 sm:grid-cols-2">
              <ResultCard title="Profile" icon={UserIcon}>
                <p className="text-xl font-bold">{resume.profile.name || "Not found"}</p>
                <p className="text-sm text-gray-500">{resume.profile.email}</p>
                <p className="text-sm text-gray-500">{resume.profile.phone}</p>
                <p className="mt-2 text-xs italic text-gray-400 line-clamp-2">{resume.profile.summary}</p>
              </ResultCard>

              <ResultCard title="Education" icon={AcademicCapIcon}>
                {resume.educations.map((edu, i) => (
                  <div key={i} className={i > 0 ? "mt-4 border-t border-gray-50 pt-4" : ""}>
                    <p className="font-bold">{edu.school}</p>
                    <p className="text-sm text-gray-500">{edu.degree}</p>
                    <p className="text-xs text-sky-500 font-medium">{edu.date}</p>
                  </div>
                ))}
              </ResultCard>

              <div className="sm:col-span-2">
                <ResultCard title="Work Experience" icon={BriefcaseIcon}>
                  <div className="grid gap-6 md:grid-cols-2">
                    {resume.workExperiences.map((work, i) => (
                      <div key={i} className="space-y-1">
                        <p className="font-bold">{work.company}</p>
                        <p className="text-sm font-medium text-gray-600">{work.jobTitle}</p>
                        <p className="text-xs text-gray-400">{work.date}</p>
                        <ul className="mt-2 space-y-1">
                          {work.descriptions.slice(0, 2).map((desc, j) => (
                            <li key={j} className="text-xs text-gray-500 line-clamp-1">• {desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </div>

              <ResultCard title="Skills" icon={WrenchIcon}>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.featuredSkills.filter(s => s.skill).map((s, i) => (
                    <span key={i} className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600">
                      {s.skill}
                    </span>
                  ))}
                  {resume.skills.descriptions.map((desc, i) => (
                    <span key={i} className="rounded-lg bg-sky-50 px-2 py-1 text-xs font-bold text-sky-600">
                      {desc}
                    </span>
                  ))}
                </div>
              </ResultCard>

              <ResultCard title="Raw Sections" icon={DocumentTextIcon}>
                <div className="max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                  {Object.keys(sections).map((section, i) => (
                    <div key={i} className="mb-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                      <span className="text-xs font-bold text-gray-600 capitalize">{section}</span>
                      <span className="text-[10px] font-bold text-gray-400">{sections[section].length} lines</span>
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
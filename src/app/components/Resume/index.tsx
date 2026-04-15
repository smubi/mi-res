"use client";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
const ResumePDF = dynamic(
  () => import("components/Resume/ResumePDF").then((mod) => mod.ResumePDF),
  { ssr: false }
);
import {
  ResumeControlBarCSR,
  ResumeControlBarBorder,
} from "components/Resume/ResumeControlBar";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { selectJobTitle } from "lib/redux/aiSlice";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import {
  useRegisterReactPDFFont,
  useRegisterReactPDFHyphenationCallback,
} from "components/fonts/hooks";
import { NonEnglishFontsCSSLazyLoader } from "components/fonts/NonEnglishFontsCSSLoader";
import { ATSScoreBadge } from "components/Resume/ATSScoreBadge";
import { ATSView } from "components/Resume/ATSView";
import { RecruiterThoughts } from "components/Resume/RecruiterThoughts";
import { EyeIcon, CommandLineIcon, ClockIcon } from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const [viewMode, setViewMode] = useState<"pdf" | "ats">("pdf");
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(6);
  
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  const jobTitle = useAppSelector(selectJobTitle);

  const document = useMemo(
    () => <ResumePDF resume={resume} settings={settings} isPDF={true} />,
    [resume, settings]
  );

  const fileName = useMemo(() => {
    const name = resume.profile.name || "Resume";
    return jobTitle ? `${name} - ${jobTitle}` : `${name} - Resume`;
  }, [resume.profile.name, jobTitle]);

  const scannabilityScore = useMemo(() => {
    const checks = [
      !!(resume.profile.name && resume.profile.email),
      resume.workExperiences.length > 0 && !!resume.workExperiences[0].jobTitle,
      resume.workExperiences.every(w => /\d{4}/.test(w.date)),
      resume.educations.length > 0,
      settings.formToHeading.workExperiences === settings.formToHeading.workExperiences.toUpperCase(),
      resume.workExperiences.every(w => w.descriptions.length <= 6)
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [resume, settings]);

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);

  const startSimulation = () => {
    setIsSimulating(true);
    setTimeLeft(6);
  };

  useEffect(() => {
    if (isSimulating && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsSimulating(false);
    }
  }, [isSimulating, timeLeft]);

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <div className="relative flex justify-center md:justify-start dark:bg-gray-900 transition-colors duration-300">
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div className="relative w-full max-w-[850px]">
          <div className="absolute -left-12 top-4 z-30 hidden flex-col gap-2 md:flex">
            <button 
              onClick={() => setViewMode("pdf")}
              className={cx(
                "flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-all",
                viewMode === 'pdf' 
                  ? 'bg-white text-sky-500 border-sky-100 ring-2 ring-sky-50 dark:bg-gray-800 dark:border-sky-900 dark:ring-sky-900/20' 
                  : 'bg-white text-gray-400 border-gray-100 hover:text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
              )}
              title="PDF Preview"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("ats")}
              className={cx(
                "flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-all",
                viewMode === 'ats'
                  ? 'bg-gray-900 text-green-400 border-gray-800 ring-2 ring-gray-800 dark:bg-black dark:border-green-900/30 dark:ring-green-900/10'
                  : 'bg-white text-gray-400 border-gray-100 hover:text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
              )}
              title="ATS View"
            >
              <CommandLineIcon className="h-5 w-5" />
            </button>
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className={cx(
                "flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-all",
                isSimulating
                  ? 'bg-purple-600 text-white border-purple-500 animate-pulse'
                  : 'bg-white text-gray-400 border-gray-100 hover:text-purple-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500 dark:hover:text-purple-400'
              )}
              title="Simulate 6-Second Scan"
            >
              <ClockIcon className="h-5 w-5" />
            </button>
          </div>

          <ATSScoreBadge />
          
          <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-sm border border-orange-100">
            <EyeIcon className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Scannability:</span>
            <span className={cx(
              "text-sm font-black",
              scannabilityScore > 80 ? "text-green-600" : scannabilityScore > 50 ? "text-orange-500" : "text-red-500"
            )}>
              {scannabilityScore}%
            </span>
          </div>
          
          {isSimulating && (
            <div className="absolute right-4 top-4 z-40 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/95 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <ClockIcon className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">
                    Scanning... {timeLeft}s
                  </span>
                </div>
                <div className="h-2 w-2 animate-ping rounded-full bg-purple-500" />
              </div>
              <p className="text-[10px] leading-tight text-gray-500 dark:text-gray-400 italic">
                Simulating a recruiter's rapid first impression.
              </p>
            </div>
          )}

          {isSimulating && <RecruiterThoughts timeLeft={timeLeft} />}

          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] overflow-hidden md:p-[var(--resume-padding)]">

            {viewMode === "pdf" ? (
              <ResumeIframeCSR
                documentSize={settings.documentSize}
                scale={scale}
                resume={resume}
                enablePDFViewer={DEBUG_RESUME_PDF_FLAG}
              >
                <ResumePDF
                  resume={resume}
                  settings={settings}
                  isPDF={DEBUG_RESUME_PDF_FLAG}
                />
              </ResumeIframeCSR>

            ) : (
              <div className="h-full w-full overflow-hidden rounded-xl border border-gray-200 shadow-2xl dark:border-gray-800">
                <ATSView />
              </div>
            )}
          </section>
          
          {viewMode === "pdf" && (
            <ResumeControlBarCSR
              scale={scale}
              setScale={setScale}
              documentSize={settings.documentSize}
              resumePDFDocument={document}
              fileName={fileName}
            />
          )}

        </div>
        <ResumeControlBarBorder />
      </div>
    </>
  );
};
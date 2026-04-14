"use client";
import { useState, useMemo } from "react";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { ResumePDF } from "components/Resume/ResumePDF";
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
import { EyeIcon, CommandLineIcon } from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

export const Resume = () => {
  const [scale, setScale] = useState(0.8);
  const [viewMode, setViewMode] = useState<"pdf" | "ats">("pdf");
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

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);

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
          </div>

          <ATSScoreBadge />
          
          <section className="h-[calc(100vh-var(--top-nav-bar-height)-var(--resume-control-bar-height))] overflow-hidden md:p-[var(--resume-padding)]">
            {viewMode === "pdf" ? (
              <ResumeIframeCSR
                documentSize={settings.documentSize}
                scale={scale}
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
              document={document}
              fileName={fileName}
            />
          )}
        </div>
        <ResumeControlBarBorder />
      </div>
    </>
  );
};

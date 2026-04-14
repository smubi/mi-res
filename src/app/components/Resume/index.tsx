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
      <div className="relative flex justify-center md:justify-start">
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
        <div className="relative w-full max-w-[850px]">
          <div className="absolute -left-12 top-4 z-30 hidden flex-col gap-2 md:flex">
            <button 
              onClick={() => setViewMode("pdf")}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-all ${viewMode === 'pdf' ? 'bg-white text-sky-500 border-sky-100 ring-2 ring-sky-50' : 'bg-white text-gray-400 border-gray-100 hover:text-gray-600'}`}
              title="PDF Preview"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setViewMode("ats")}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm transition-all ${viewMode === 'ats' ? 'bg-gray-900 text-green-400 border-gray-800 ring-2 ring-gray-800' : 'bg-white text-gray-400 border-gray-100 hover:text-gray-600'}`}
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
              <div className="h-full w-full overflow-hidden rounded-xl border border-gray-200 shadow-2xl">
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
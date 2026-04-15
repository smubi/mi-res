"use client";
import { useEffect } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  Search,
  Download,
  FileJson,
  FileText,
} from "lucide-react";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { mapResumeToJsonResume } from "lib/json-resume";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  resumePDFDocument,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  resumePDFDocument: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document: resumePDFDocument });

  useEffect(() => {
    update(resumePDFDocument);
  }, [update, resumePDFDocument]);

  const resume = useAppSelector(selectResume);

  const handleJSONExport = () => {
    const jsonResume = mapResumeToJsonResume(resume);
    const blob = new Blob([JSON.stringify(jsonResume, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.replace(".pdf", ".json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleMarkdownExport = () => {
    let md = `# ${resume.profile.name}\n\n`;
    md += `${resume.profile.email} | ${resume.profile.phone} | ${resume.profile.location}\n`;
    md += `${resume.profile.url}\n\n`;
    md += `## Summary\n${resume.profile.summary}\n\n`;
    
    md += `## Experience\n`;
    resume.workExperiences.forEach(exp => {
      md += `### ${exp.company}\n**${exp.jobTitle}** | ${exp.date}\n`;
      exp.descriptions.forEach(d => md += `- ${d}\n`);
      md += `\n`;
    });

    md += `## Education\n`;
    resume.educations.forEach(edu => {
      md += `### ${edu.school}\n**${edu.degree}** | ${edu.date}\n`;
      if (edu.gpa) md += `GPA: ${edu.gpa}\n`;
      edu.descriptions.forEach(d => md += `- ${d}\n`);
      md += `\n`;
    });

    md += `## Skills\n`;
    const featured = resume.skills.featuredSkills.map(s => s.skill).filter(Boolean).join(", ");
    if (featured) md += `**Featured:** ${featured}\n\n`;
    resume.skills.descriptions.forEach(d => md += `- ${d}\n`);

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName.replace(".pdf", ".md");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-center bg-white/90 px-[var(--resume-padding)] text-slate-600 backdrop-blur-md dark:bg-slate-900/90 dark:text-slate-400 lg:justify-between border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Search size={18} aria-hidden="true" />
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.01}
            value={scale}
            onChange={(e) => {
              setScaleOnResize(false);
              setScale(Number(e.target.value));
            }}
            className="accent-indigo-600"
          />
          <div className="w-12 text-sm font-medium">{`${Math.round(scale * 100)}%`}</div>
        </div>
        <label className="hidden items-center gap-2 lg:flex cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 accent-indigo-600"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none text-sm font-medium">Autoscale</span>
        </label>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleMarkdownExport}
          className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Export as Markdown"
        >
          <FileText size={14} />
          <span className="hidden sm:inline">MD</span>
        </button>
        <button
          onClick={handleJSONExport}
          className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Export as JSON Resume"
        >
          <FileJson size={14} />
          <span className="hidden sm:inline">JSON</span>
        </button>
        <a
          className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 dark:shadow-none"
          href={instance.url!}
          download={fileName}
        >
          <Download size={16} />
          <span className="whitespace-nowrap">Download PDF</span>
        </a>
      </div>
    </div>
  );
};

export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50 dark:border-gray-800 dark:bg-gray-900" />
);
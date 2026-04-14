"use client";
import { useEffect } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  Search,
  Download,
} from "lucide-react";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document });

  // Hook to update pdf when document changes
  useEffect(() => {
    update(document);
  }, [update, document]);

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
      <a
        className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 dark:shadow-none"
        href={instance.url!}
        download={fileName}
      >
        <Download size={16} />
        <span className="whitespace-nowrap">Download PDF</span>
      </a>
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50 dark:border-gray-800 dark:bg-gray-900" />
);

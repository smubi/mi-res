"use client";

import { 
  PencilSquareIcon, 
  SparklesIcon, 
  PaintBrushIcon 
} from "@heroicons/react/24/outline";
import { cx } from "lib/cx";

export type TabType = "content" | "optimize" | "design";

interface FormTabsProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export const FormTabs = ({ activeTab, onChange }: FormTabsProps) => {
  const tabs = [
    { id: "content", label: "Content", icon: PencilSquareIcon },
    { id: "optimize", label: "AI Optimize", icon: SparklesIcon },
    { id: "design", label: "Design", icon: PaintBrushIcon },
  ] as const;

  return (
    <div className="sticky top-0 z-30 flex w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cx(
              "flex flex-1 items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-all",
              isActive 
                ? "border-b-2 border-sky-500 text-sky-600" 
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            )}
          >
            <tab.icon className={cx("h-4 w-4", isActive ? "text-sky-500" : "text-gray-400")} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
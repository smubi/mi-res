"use client";

import { cx } from "lib/cx";
import { 
  PencilSquareIcon, 
  SparklesIcon, 
  PaintBrushIcon 
} from "@heroicons/react/24/outline";

export type TabType = "content" | "optimize" | "design";

interface FormTabsProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export const FormTabs = ({ activeTab, onChange }: FormTabsProps) => {
  const tabs = [
    { id: "content", label: "Content", icon: PencilSquareIcon, isNew: false },
    { id: "optimize", label: "Optimize", icon: SparklesIcon, isNew: true },
    { id: "design", label: "Design", icon: PaintBrushIcon, isNew: false },
  ] as const;

  return (
    <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <nav className="flex justify-center gap-4 px-4 lg:gap-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cx(
                "relative flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition-all",
                isActive
                  ? "border-sky-500 text-sky-600 dark:text-sky-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              <Icon className={cx("h-5 w-5", isActive ? "text-sky-500" : "text-gray-400")} />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.isNew && (
                <span className="absolute -right-2 top-3 flex h-2 w-2 sm:-right-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
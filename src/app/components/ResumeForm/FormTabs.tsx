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
      <nav className="flex justify-center p-2" aria-label="Tabs">
        <div className="flex w-full max-w-md items-center gap-1 rounded-xl bg-gray-100/50 p-1 dark:bg-gray-800/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={cx(
                  "relative flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all",
                  isActive
                    ? "bg-white text-sky-600 shadow-sm dark:bg-gray-700 dark:text-sky-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                )}
              >
                <Icon className={cx("h-4 w-4", isActive ? "text-sky-500" : "text-gray-400")} />
                {tab.label}
                {tab.isNew && (
                  <span className="absolute -right-1 -top-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

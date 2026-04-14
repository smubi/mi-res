"use client";

import { cx } from "lib/cx";
import {
  PencilLine,
  Sparkles,
  Palette,
  Target
} from "lucide-react";

export type TabType = "content" | "optimize" | "design" | "track";

interface FormTabsProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export const FormTabs = ({ activeTab, onChange }: FormTabsProps) => {
  const tabs = [
    { id: "content", label: "Content", icon: PencilLine },
    { id: "optimize", label: "Optimize", icon: Sparkles },
    { id: "design", label: "Design", icon: Palette },
    { id: "track", label: "Track", icon: Target },
  ] as const;

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <nav className="flex justify-center gap-1 px-2 lg:gap-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cx(
                "group relative flex items-center gap-2 border-b-2 py-4 px-4 text-sm font-bold transition-all",
                isActive
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              <Icon size={18} className={cx("transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
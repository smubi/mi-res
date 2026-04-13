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
    { id: "content", label: "Content", icon: PencilSquareIcon },
    { id: "optimize", label: "Optimize", icon: SparklesIcon },
    { id: "design", label: "Design", icon: PaintBrushIcon },
  ] as const;

  return (
    <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="flex justify-center gap-8 px-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cx(
                "flex items-center gap-2 border-b-2 py-4 text-sm font-bold transition-all",
                isActive
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
            >
              <Icon className={cx("h-5 w-5", isActive ? "text-sky-500" : "text-gray-400")} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
"use client";

import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeSettings, selectSettings } from "lib/redux/settingsSlice";
import { cx } from "lib/cx";
import { CheckIcon } from "@heroicons/react/24/outline";

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean layout with a top accent bar and bold headings.",
    preview: (color: string) => (
      <div className="flex h-full w-full flex-col bg-white p-2 shadow-sm">
        <div className="h-1 w-full" style={{ backgroundColor: color }} />
        <div className="mt-2 h-2 w-1/2 bg-gray-200" />
        <div className="mt-1 h-1 w-1/3 bg-gray-100" />
        <div className="mt-4 h-1 w-full bg-gray-200" />
        <div className="mt-1 h-1 w-full bg-gray-100" />
        <div className="mt-1 h-1 w-full bg-gray-100" />
      </div>
    ),
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional centered header with serif fonts and no accent bar.",
    preview: () => (
      <div className="flex h-full w-full flex-col items-center bg-white p-2 shadow-sm">
        <div className="mt-2 h-2 w-1/2 bg-gray-200" />
        <div className="mt-1 h-1 w-1/3 bg-gray-100" />
        <div className="mt-4 h-1 w-full bg-gray-200" />
        <div className="mt-1 h-1 w-full bg-gray-100" />
        <div className="mt-1 h-1 w-full bg-gray-100" />
      </div>
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Left-aligned header with compact margins and sans-serif focus.",
    preview: () => (
      <div className="flex h-full w-full flex-col bg-white p-2 shadow-sm">
        <div className="mt-2 h-2 w-1/3 bg-gray-200" />
        <div className="mt-1 h-1 w-1/4 bg-gray-100" />
        <div className="mt-4 h-1 w-full bg-gray-200" />
        <div className="mt-1 h-1 w-full bg-gray-100" />
        <div className="mt-1 h-1 w-full bg-gray-100" />
      </div>
    ),
  },
];

export const TemplateGallery = () => {
  const { templateId, themeColor } = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const handleSelect = (id: string) => {
    dispatch(changeSettings({ field: "templateId", value: id }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Template Gallery
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {templates.map((template) => {
          const isSelected = templateId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => handleSelect(template.id)}
              className={cx(
                "group relative flex flex-col overflow-hidden rounded-lg border-2 text-left transition-all",
                isSelected
                  ? "border-sky-500 ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-gray-900"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
              )}
            >
              <div className="aspect-[3/4] w-full bg-gray-50 p-4 dark:bg-gray-800">
                {template.preview(themeColor)}
              </div>
              <div className="bg-white p-3 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {template.name}
                  </span>
                  {isSelected && (
                    <CheckIcon className="h-4 w-4 text-sky-500" />
                  )}
                </div>
                <p className="mt-1 text-[10px] leading-tight text-gray-500 dark:text-gray-400">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

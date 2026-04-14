"use client";

import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeSettings, selectSettings } from "lib/redux/settingsSlice";
import { cx } from "lib/cx";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean layout with a bold accent bar.",
    preview: "bg-sky-500",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional centered header with serif fonts.",
    preview: "bg-gray-800",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Compact design focused on readability.",
    preview: "bg-gray-200",
  },
];

export const TemplateGallery = () => {
  const { templateId } = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const handleSelect = (id: string) => {
    dispatch(changeSettings({ field: "templateId", value: id }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Resume Template
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TEMPLATES.map((template) => {
          const isSelected = templateId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => handleSelect(template.id)}
              className={cx(
                "relative flex flex-col items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                isSelected
                  ? "border-sky-500 bg-sky-50/50 dark:bg-sky-900/10"
                  : "border-gray-100 bg-white hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
              )}
            >
              <div className={cx("h-12 w-full rounded-lg", template.preview)} />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {template.name}
                </p>
                <p className="text-[10px] leading-tight text-gray-500 dark:text-gray-400">
                  {template.description}
                </p>
              </div>
              {isSelected && (
                <CheckCircleIcon className="absolute right-2 top-2 h-5 w-5 text-sky-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

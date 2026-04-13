"use client";

import { useState } from "react";
import { BookOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const VERB_CATEGORIES = {
  Leadership: ["Spearheaded", "Orchestrated", "Chaired", "Coordinated", "Directed", "Guided", "Mentored", "Oversaw"],
  Technical: ["Architected", "Engineered", "Programmed", "Debugged", "Deployed", "Integrated", "Refactored", "Automated"],
  Results: ["Accelerated", "Boosted", "Maximized", "Outpaced", "Surpassed", "Yielded", "Generated", "Expanded"],
  Efficiency: ["Optimized", "Streamlined", "Consolidated", "Simplified", "Restructured", "Revitalized", "Modernized"],
};

export const VerbLibrary = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<keyof typeof VERB_CATEGORIES>("Leadership");

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5 text-sky-600" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Action Verb Library</h3>
        </div>
      </div>

      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search verbs..."
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-sky-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {Object.keys(VERB_CATEGORIES).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeCategory === cat ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {VERB_CATEGORIES[activeCategory]
          .filter((v) => v.toLowerCase().includes(search.toLowerCase()))
          .map((verb) => (
            <button
              key={verb}
              onClick={() => {
                navigator.clipboard.writeText(verb);
              }}
              className="rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 transition-all"
              title="Click to copy"
            >
              {verb}
            </button>
          ))}
      </div>
    </div>
  );
};
"use client";

import { ReactNode } from "react";

export const ResultCard = ({ 
  title, 
  children, 
  icon: Icon 
}: { 
  title: string; 
  children: ReactNode;
  icon?: any;
}) => {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-sky-50 group-hover:text-sky-500">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">{title}</h3>
      </div>
      <div className="space-y-2 text-gray-900">
        {children}
      </div>
    </div>
  );
};
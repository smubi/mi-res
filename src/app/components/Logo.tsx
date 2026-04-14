import { Briefcase } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
        <Briefcase size={20} strokeWidth={2.5} />
      </div>
      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Career<span className="text-indigo-600">Craft</span>
      </span>
    </div>
  );
};

import Link from "next/link";
import { AutoTypingResume } from "home/AutoTypingResume";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-600/20 mb-8 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Career Acceleration</span>
            </div>
            <h1 className="text-slate-900 dark:text-white text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Build a resume that <br />
              <span className="text-indigo-600">gets you hired.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              CareerCraft uses advanced AI to optimize your resume for modern ATS systems, ensuring you stand out to recruiters and land more interviews.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
              <Link href="/resume-builder" className="group flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none">
                Start Building Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/resume-parser" className="text-slate-600 dark:text-slate-400 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-6 py-4">
                Analyze Existing Resume
              </Link>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {[
                "No sign up required",
                "100% Private & Secure",
                "ATS Optimized"
              ].map((text) => (
                <div key={text} className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-2xl lg:max-w-none">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 blur-3xl rounded-full opacity-50" />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="h-12 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto text-xs font-medium text-slate-400">careercraft.io/editor</div>
              </div>
              <div className="p-4 lg:p-8">
                <AutoTypingResume />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
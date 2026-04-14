import { Sparkles, Search, ShieldCheck, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: <Sparkles className="h-8 w-8 text-indigo-600" />,
    title: "AI Optimization",
    text: "Automatically refine your bullet points with strong action verbs and impact-focused language that catches recruiter attention.",
  },
  {
    icon: <Search className="h-8 w-8 text-sky-600" />,
    title: "ATS Keyword Matching",
    text: "Analyze job descriptions in real-time to identify missing keywords and boost your match score for automated screening.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-emerald-600" />,
    title: "Privacy First",
    text: "Your data stays in your browser. We don't store your personal information on our servers, ensuring 100% privacy.",
  },
  {
    icon: <Zap className="h-8 w-8 text-amber-600" />,
    title: "Instant Export",
    text: "Generate perfectly formatted, professional PDF resumes in seconds. No more fighting with Word or Google Docs margins.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-20">
          <h2 className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-4">Powerful Features</h2>
          <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Everything you need to <br /> land the interview
          </p>
        </div>
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex flex-col items-start">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
                  {feature.icon}
                </div>
                <dt className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {feature.title}
                </dt>
                <dd className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
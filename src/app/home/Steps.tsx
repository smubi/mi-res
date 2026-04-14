import { Upload, Layout, Download } from "lucide-react";

const STEPS = [
  {
    title: "Import or Start Fresh",
    text: "Upload your existing PDF or start with a clean slate using our intuitive editor.",
    icon: Upload,
    color: "bg-blue-500"
  },
  {
    title: "Optimize with AI",
    text: "Real-time feedback and AI suggestions help you tailor your content for specific roles.",
    icon: Layout,
    color: "bg-indigo-500"
  },
  {
    title: "Download & Apply",
    text: "Export your ATS-ready resume in seconds and land your dream job.",
    icon: Download,
    color: "bg-emerald-500"
  },
];

export const Steps = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl my-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">How it works</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Three simple steps to a professional, high-impact resume.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {STEPS.map(({ title, text, icon: Icon, color }, idx) => (
            <div className="relative group" key={idx}>
              <div className="flex flex-col items-center text-center">
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${color} text-white shadow-lg transition-transform group-hover:-translate-y-1`}>
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-px bg-slate-200 dark:bg-slate-800" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

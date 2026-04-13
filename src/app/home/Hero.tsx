import Link from "next/link";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { AutoTypingResume } from "home/AutoTypingResume";
import { SparklesIcon } from "@heroicons/react/24/solid";

export const Hero = () => {
  return (
    <section className="lg:flex lg:h-[825px] lg:justify-center">
      <FlexboxSpacer maxWidth={75} minWidth={0} className="hidden lg:block" />
      <div className="mx-auto max-w-xl pt-8 text-center lg:mx-0 lg:grow lg:pt-32 lg:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-sm font-bold text-purple-700 ring-1 ring-inset ring-purple-700/10 mb-6">
          <SparklesIcon className="h-4 w-4" />
          <span>Now with AI-Powered Optimization</span>
        </div>
        <h1 className="text-primary pb-2 text-4xl font-bold lg:text-6xl leading-tight">
          Tailor your resume
          <br />
          with AI precision
        </h1>
        <p className="mt-3 text-lg lg:mt-5 lg:text-xl text-gray-600">
          The free, open-source builder that matches your skills to job descriptions using the latest ResumeFlow research.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 lg:mt-14 justify-center lg:justify-start">
          <Link href="/resume-import" className="btn-primary">
            Create Resume <span aria-hidden="true">→</span>
          </Link>
          <Link href="/resume-parser" className="text-sm font-semibold text-gray-900 hover:text-sky-600 transition-colors">
            Try Resume Parser
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-500">No sign up required • 100% Private</p>
        
        <div className="mt-12 lg:mt-24 grid grid-cols-2 gap-8 border-t border-gray-100 pt-8">
          <div>
            <p className="text-2xl font-bold text-gray-900">95%</p>
            <p className="text-sm text-gray-500 font-medium">ATS Pass Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">10k+</p>
            <p className="text-sm text-gray-500 font-medium">Resumes Created</p>
          </div>
        </div>
      </div>
      <FlexboxSpacer maxWidth={100} minWidth={50} className="hidden lg:block" />
      <div className="mt-6 flex justify-center lg:mt-4 lg:block lg:grow">
        <AutoTypingResume />
      </div>
    </section>
  );
};
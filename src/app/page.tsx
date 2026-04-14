import { Hero } from "home/Hero";
import { Steps } from "home/Steps";
import { Features } from "home/Features";
import { Testimonials } from "home/Testimonials";
import { QuestionsAndAnswers } from "home/QuestionsAndAnswers";
import { Logo } from "components/Logo";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white dark:bg-slate-950 transition-colors">
      <Hero />
      <div className="container mx-auto px-4">
        <Steps />
        <Features />
        <Testimonials />
        <QuestionsAndAnswers />
      </div>
      
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Logo />
            <div className="flex gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link href="/resume-builder" className="hover:text-indigo-600 transition-colors">Builder</Link>
              <Link href="/resume-parser" className="hover:text-indigo-600 transition-colors">ATS Checker</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
            </div>
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} CareerCraft. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

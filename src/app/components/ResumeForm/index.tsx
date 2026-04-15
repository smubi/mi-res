"use client";
import { useState, useMemo } from "react";
import {
  useAppSelector,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "lib/redux/hooks";
import { ShowForm, selectFormsOrder } from "lib/redux/settingsSlice";
import { selectResume } from "lib/redux/resumeSlice";
import { selectJobDescription } from "lib/redux/aiSlice";
import { ProfileForm } from "./ProfileForm";
import { WorkExperiencesForm } from "./WorkExperiencesForm";
import { EducationsForm } from "./EducationsForm";
import { ProjectsForm } from "./ProjectsForm";
import { SkillsForm } from "./SkillsForm";
import { ThemeForm } from "./ThemeForm";
import { CustomForm } from "./CustomForm";
import { JobDescriptionForm } from "./JobDescriptionForm";
import { ResumeAnalysis } from "./ResumeAnalysis";
import { SmartSuggestions } from "./SmartSuggestions";
import { SkillSuggestions } from "./SkillSuggestions";
import { CoverLetterGenerator } from "./CoverLetterGenerator";
import { ResumeChecklist } from "./ResumeChecklist";
import { ResumeSnapshots } from "./ResumeSnapshots";
import { ResumeComparison } from "./ResumeComparison";
import { JobTracker } from "./JobTracker";
import { InterviewPrep } from "./InterviewPrep";
import { VerbLibrary } from "./VerbLibrary";
import { QuantificationNudge } from "./QuantificationNudge";
import { LiveGrader } from "./LiveGrader";
import { JDAnalyzer } from "./JDAnalyzer";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { KeywordDensity } from "./KeywordDensity";
import { ToneStyleChecker } from "./ToneStyleChecker";
import { NetworkingAssistant } from "./NetworkingAssistant";
import { HealthDashboard } from "./HealthDashboard";
import { RecruiterInsights } from "./RecruiterInsights";
import { ATSCompatibilityReport } from "./ATSCompatibilityReport";
import { SkillMatchVisualizer } from "./SkillMatchVisualizer";
import { SkillGapVenn } from "./SkillGapVenn";
import { KeywordHeatmap } from "./KeywordHeatmap";
import { JDWordCloud } from "./JDWordCloud";
import { RoleBenchmarker } from "./RoleBenchmarker";
import { LinkedInOptimizer } from "./LinkedInOptimizer";
import { SalaryNegotiationCoach } from "./SalaryNegotiationCoach";
import { ResumeProgressChart } from "./ResumeProgressChart";
import { EmploymentGapFramer } from "./EmploymentGapFramer";
import { STARMethodAnalyzer } from "./STARMethodAnalyzer";
import { ATSMatchModal } from "./ATSMatchModal";
import { JSONResumeSection } from "./JSONResumeSection";
import { FlexboxSpacer } from "components/FlexboxSpacer";

import { FormTabs, TabType } from "./FormTabs";
import { Accordion, AccordionItem } from "./Form/Accordion";
import { cx } from "lib/cx";
import { Search, Trophy } from "lucide-react";

const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

const formTypeToTitle: { [type in ShowForm]: string } = {
  workExperiences: "Work Experience",
  educations: "Education",
  projects: "Projects",
  skills: "Skills",
  custom: "Custom Section",
};

export const ResumeForm = () => {
  useSetInitialStore();
  useSaveStateToLocalStorageOnChange();

  const formsOrder = useAppSelector(selectFormsOrder);
  const resume = useAppSelector(selectResume);
  const jobDescription = useAppSelector(selectJobDescription);
  const [isHover, setIsHover] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [isATSMatchModalOpen, setIsATSMatchModalOpen] = useState(false);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (resume.profile.name) score += 10;
    if (resume.profile.email) score += 10;
    const allBullets = [
      ...resume.workExperiences.flatMap(w => w.descriptions),
      ...resume.projects.flatMap(p => p.descriptions)
    ];
    score += Math.min(40, allBullets.length * 4);
    const metricsCount = allBullets.filter(b => /\d+%|\d+\s?percent|\$\d+|\d+\+/.test(b)).length;
    score += Math.round((metricsCount / Math.max(1, allBullets.length)) * 40);
    return Math.min(100, score);
  }, [resume]);

  return (
    <div
      className={cx(
        "flex flex-col scrollbar-thin scrollbar-track-gray-100 md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll transition-colors",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100",
        "dark:bg-gray-900 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-700"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Trophy className={cx("h-5 w-5", strengthScore > 80 ? "text-yellow-500" : "text-gray-400")} />
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Resume Strength</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div 
                className={cx("h-full transition-all duration-1000", strengthScore > 80 ? "bg-green-500" : strengthScore > 50 ? "bg-sky-500" : "bg-amber-500")}
                style={{ width: `${strengthScore}%` }}
              />
            </div>
            <span className="text-sm font-black text-gray-900 dark:text-white">{strengthScore}%</span>
          </div>
        </div>
        <FormTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>
      
      <div className="flex justify-center md:justify-end">
        <section className="flex w-full max-w-2xl flex-col gap-8 p-[var(--resume-padding)]">
          {activeTab === "content" && (
            <Accordion>
              <AccordionItem title="Profile">
                <ProfileForm />
              </AccordionItem>
              {formsOrder.map((form) => {
                const Component = formTypeToComponent[form];
                return (
                  <AccordionItem key={form} title={formTypeToTitle[form]}>
                    <Component />
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

          {activeTab === "optimize" && (
            <div className="flex flex-col gap-8">
              <HealthDashboard />
              
              <Accordion>
                <AccordionItem title="Resume Analysis">
                  <div className="flex flex-col gap-6">
                    <RecruiterInsights />
                    <LiveGrader />
                    <ScoreBreakdown />
                    <ToneStyleChecker />
                    <ResumeChecklist />
                  </div>
                </AccordionItem>
                <AccordionItem title="Job Matching">
                  <div className="flex flex-col gap-6">
                    <button
                      onClick={() => setIsATSMatchModalOpen(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98] dark:shadow-none"
                    >
                      <Search className="h-6 w-6" />
                      Check 20-Point ATS Match
                    </button>
                    <JobDescriptionForm />
                    <SkillGapVenn />
                    <KeywordHeatmap />
                    <JDWordCloud />
                    <RoleBenchmarker />
                    <SkillMatchVisualizer />
                    <JDAnalyzer />
                    <KeywordDensity />
                    <ResumeAnalysis />
                  </div>
                </AccordionItem>
                <AccordionItem title="Technical & Content">
                  <div className="flex flex-col gap-6">
                    <STARMethodAnalyzer />
                    <ATSCompatibilityReport />
                    <LinkedInOptimizer />
                    <EmploymentGapFramer />
                    <QuantificationNudge />
                    <SkillSuggestions />
                    <VerbLibrary />
                    <SmartSuggestions />
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {activeTab === "design" && (
            <div className="flex flex-col gap-8">
              <ThemeForm />
              <div className="border-t border-gray-100 pt-8 dark:border-gray-800">
                <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Data Management
                </h3>
                <JSONResumeSection />
              </div>
              <div className="border-t border-gray-100 pt-8 dark:border-gray-800">
                <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Version Control
                </h3>

                <div className="flex flex-col gap-6">
                  <ResumeProgressChart />
                  <ResumeSnapshots />
                  <ResumeComparison />
                </div>
              </div>
            </div>
          )}

          {activeTab === "track" && (
            <div className="flex flex-col gap-8">
              <JobTracker />
              <SalaryNegotiationCoach />
              <NetworkingAssistant />
              <InterviewPrep />
              <CoverLetterGenerator />
            </div>
          )}
          
          <br />
        </section>
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
      </div>

      <ATSMatchModal
        isOpen={isATSMatchModalOpen}
        onClose={() => setIsATSMatchModalOpen(false)}
        resume={resume}
        jobDescription={jobDescription}
      />
    </div>
  );
};
"use client";
import { useState } from "react";
import {
  useAppSelector,
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "lib/redux/hooks";
import { ShowForm, selectFormsOrder } from "lib/redux/settingsSlice";
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
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { FormTabs, TabType } from "./FormTabs";
import { cx } from "lib/cx";

import { Accordion, AccordionItem } from "./Form/Accordion";

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
  const [isHover, setIsHover] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("content");

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
      <FormTabs activeTab={activeTab} onChange={setActiveTab} />
      
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
              <LiveGrader />
              <ScoreBreakdown />
              <JobDescriptionForm />
              <NetworkingAssistant />
              <JDAnalyzer />
              <KeywordDensity />
              <ResumeAnalysis />
              <ToneStyleChecker />
              <QuantificationNudge />
              <SkillSuggestions />
              <VerbLibrary />
              <InterviewPrep />
              <ResumeChecklist />
              <CoverLetterGenerator />
              <SmartSuggestions />
            </div>
          )}

          {activeTab === "design" && (
            <div className="flex flex-col gap-8">
              <ThemeForm />
              <ResumeSnapshots />
              <ResumeComparison />
              <JobTracker />
            </div>
          )}
          
          <br />
        </section>
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
      </div>
    </div>
  );
};
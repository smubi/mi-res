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

const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
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
        "flex flex-col scrollbar-thin scrollbar-track-gray-100 md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100"
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <FormTabs activeTab={activeTab} onChange={setActiveTab} />
      
      <div className="flex justify-center md:justify-end">
        <section className="flex w-full max-w-2xl flex-col gap-8 p-[var(--resume-padding)]">
          {activeTab === "content" && (
            <>
              <ProfileForm />
              {formsOrder.map((form) => {
                const Component = formTypeToComponent[form];
                return <Component key={form} />;
              })}
            </>
          )}

          {activeTab === "optimize" && (
            <>
              <LiveGrader />
              <ScoreBreakdown />
              <JobDescriptionForm />
              <JDAnalyzer />
              <KeywordDensity />
              <ResumeAnalysis />
              <ToneStyleChecker />
              <QuantificationNudge />
              <SkillSuggestions />
              <VerbLibrary />
              <InterviewPrep />
              <NetworkingAssistant />
              <ResumeChecklist />
              <CoverLetterGenerator />
              <SmartSuggestions />
            </>
          )}

          {activeTab === "design" && (
            <>
              <ThemeForm />
              <ResumeSnapshots />
              <ResumeComparison />
              <JobTracker />
            </>
          )}
          
          <br />
        </section>
        <FlexboxSpacer maxWidth={50} className="hidden md:block" />
      </div>
    </div>
  );
};
import { BaseForm } from "components/ResumeForm/Form";
import { Textarea } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { setJobDescription, selectJobDescription } from "lib/redux/aiSlice";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { KeywordMatcher } from "components/ResumeForm/KeywordMatcher";

export const JobDescriptionForm = () => {
  const jobDescription = useAppSelector(selectJobDescription);
  const dispatch = useAppDispatch();

  const handleJDChange = (_: string, value: string) => {
    dispatch(setJobDescription(value));
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <h1 className="text-lg font-semibold tracking-wide text-gray-900">
            Target Job Description
          </h1>
        </div>
        <p className="text-sm text-gray-600">
          Paste the job description here to analyze keyword matches and tailor your resume.
        </p>
        <Textarea
          label="Job Description"
          labelClassName="col-span-full"
          name="jobDescription"
          placeholder="Paste the job requirements, responsibilities, and skills here..."
          value={jobDescription}
          onChange={handleJDChange}
        />
        {jobDescription && <KeywordMatcher />}
      </div>
    </BaseForm>
  );
};
import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { setJobDescription, selectJobDescription, setJobTitle, selectJobTitle } from "lib/redux/aiSlice";
import { BriefcaseIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { KeywordMatcher } from "components/ResumeForm/KeywordMatcher";

export const JobDescriptionForm = () => {
  const jobDescription = useAppSelector(selectJobDescription);
  const jobTitle = useAppSelector(selectJobTitle);
  const dispatch = useAppDispatch();

  const handleJDChange = (_: string, value: string) => {
    dispatch(setJobDescription(value));
  };

  const handleTitleChange = (_: string, value: string) => {
    dispatch(setJobTitle(value));
  };

  const handleClear = () => {
    dispatch(setJobDescription(""));
    dispatch(setJobTitle(""));
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
            <h1 className="text-lg font-semibold tracking-wide text-gray-900">
              Target Role
            </h1>
          </div>
          {(jobDescription || jobTitle) && (
            <button 
              onClick={handleClear}
              className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
            >
              <XMarkIcon className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Enter the job title and description to analyze keyword matches and tailor your resume.
        </p>
        
        <Input
          label="Job Title"
          name="jobTitle"
          placeholder="e.g. Senior Software Engineer"
          value={jobTitle}
          onChange={handleTitleChange}
        />

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
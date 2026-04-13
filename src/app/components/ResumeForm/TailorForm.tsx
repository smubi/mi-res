"use client";

import { BaseForm } from "components/ResumeForm/Form";
import { Textarea } from "components/ResumeForm/Form/InputGroup";
import { Target } from "lucide-react";
import { useState } from "react";

export const TailorForm = () => {
  const [jobDescription, setJobDescription] = useState("");

  return (
    <BaseForm>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-gray-600" />
          <h1 className="text-lg font-semibold tracking-wide text-gray-900">
            AI Job Tailoring
          </h1>
        </div>
        <p className="text-sm text-gray-600">
          Paste the job description here. Our AI will help you tailor your resume to match the specific requirements and keywords.
        </p>
        <Textarea
          label="Target Job Description"
          name="jobDescription"
          placeholder="Paste the job requirements, responsibilities, and qualifications here..."
          value={jobDescription}
          onChange={(_, value) => setJobDescription(value)}
        />
      </div>
    </BaseForm>
  );
};
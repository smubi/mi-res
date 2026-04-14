import { BaseForm } from "components/ResumeForm/Form";
import { Input, Textarea } from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { ResumeProfile } from "lib/redux/types";
import { AIOptimizer } from "components/ResumeForm/AIOptimizer";
import { selectJobDescription } from "lib/redux/aiSlice";
import { SparklesIcon } from "@heroicons/react/24/outline";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const jd = useAppSelector(selectJobDescription);
  const dispatch = useAppDispatch();
  const { name, email, phone, url, summary, location } = profile;

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    dispatch(changeProfile({ field, value }));
  };

  const handleAIOptimize = (newText: string) => {
    handleProfileChange("summary", newText);
  };

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label="Name"
          labelClassName="col-span-full"
          name="name"
          placeholder="Sal Khan"
          value={name}
          onChange={handleProfileChange}
        />
        <div className="col-span-full space-y-2">
          <Textarea
            label={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Professional Summary</span>
                  {jd && (
                    <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-600 ring-1 ring-purple-100">
                      <SparklesIcon className="h-3 w-3" />
                      Tailoring Active
                    </span>
                  )}
                </div>
                <AIOptimizer
                  currentText={summary}
                  onOptimize={handleAIOptimize}
                />
              </div>
            }
            name="summary"
            placeholder="Entrepreneur and educator obsessed with making education free for anyone"
            value={summary}
            onChange={handleProfileChange}
          />
        </div>
        <Input
          label="Email"
          labelClassName="col-span-4"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label="Phone"
          labelClassName="col-span-2"
          name="phone"
          placeholder="(123)456-7890"
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label="Website"
          labelClassName="col-span-4"
          name="url"
          placeholder="linkedin.com/in/khanacademy"
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label="Location"
          labelClassName="col-span-2"
          name="location"
          placeholder="NYC, NY"
          value={location}
          onChange={handleProfileChange}
        />
      </div>
    </BaseForm>
  );
};
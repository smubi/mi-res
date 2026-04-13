import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectProjects, changeProjects } from "lib/redux/resumeSlice";
import type { ResumeProject } from "lib/redux/types";
import { AIOptimizer } from "components/ResumeForm/AIOptimizer";

export const ProjectsForm = () => {
  const projects = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();
  const showDelete = projects.length > 1;

  return (
    <Form form="projects" addButtonText="Add Project">
      {projects.map(({ project, date, descriptions }, idx) => {
        const handleProjectChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeProject>
        ) => {
          dispatch(changeProjects({ idx, field, value } as any));
        };

        const handleAIOptimize = (newText: string) => {
          const newDescriptions = [...descriptions];
          if (newDescriptions.length > 0) {
            newDescriptions[newDescriptions.length - 1] = newText;
          } else {
            newDescriptions.push(newText);
          }
          handleProjectChange("descriptions", newDescriptions);
        };

        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== projects.length - 1;

        return (
          <FormSection
            key={idx}
            form="projects"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={"Delete project"}
          >
            <Input
              name="project"
              label="Project Name"
              placeholder="OpenResume"
              value={project}
              onChange={handleProjectChange}
              labelClassName="col-span-4"
            />
            <Input
              name="date"
              label="Date"
              placeholder="Winter 2022"
              value={date}
              onChange={handleProjectChange}
              labelClassName="col-span-2"
            />
            <div className="col-span-full space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-base font-medium text-gray-700">Description</label>
                <AIOptimizer 
                  currentText={descriptions[descriptions.length - 1] || ""} 
                  onOptimize={handleAIOptimize} 
                />
              </div>
              <BulletListTextarea
                name="descriptions"
                placeholder="Bullet points"
                value={descriptions}
                onChange={handleProjectChange}
              />
            </div>
          </FormSection>
        );
      })}
    </Form>
  );
};
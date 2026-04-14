import { ExpanderWithHeightTransition } from "components/ExpanderWithHeightTransition";
import {
  DeleteIconButton,
  MoveIconButton,
  ShowIconButton,
} from "components/ResumeForm/Form/IconButton";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeFormHeading,
  changeFormOrder,
  changeShowForm,
  selectHeadingByForm,
  selectIsFirstForm,
  selectIsLastForm,
  selectShowByForm,
  ShowForm,
} from "lib/redux/settingsSlice";
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  LightBulbIcon,
  WrenchIcon,
  PlusSmallIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  addSectionInForm,
  deleteSectionInFormByIdx,
  moveSectionInForm,
  changeSectionVisibility,
} from "lib/redux/resumeSlice";
import { cx } from "lib/cx";

/**
 * BaseForm is the bare bone form, i.e. just the outline with no title and no control buttons.
 * ProfileForm uses this to compose its outline.
 */
export const BaseForm = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={cx(
      "flex flex-col gap-3 rounded-xl bg-white p-6 pt-4 shadow-sm border border-gray-100 transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:shadow-none",
      className
    )}
  >
    {children}
  </section>
);

const FORM_TO_ICON: { [section in ShowForm]: typeof BuildingOfficeIcon } = {
  workExperiences: BuildingOfficeIcon,
  educations: AcademicCapIcon,
  projects: LightBulbIcon,
  skills: WrenchIcon,
  custom: WrenchIcon,
};

export const Form = ({
  form,
  addButtonText,
  children,
}: {
  form: ShowForm;
  addButtonText?: string;
  children: React.ReactNode;
}) => {
  const showForm = useAppSelector(selectShowByForm(form));
  const heading = useAppSelector(selectHeadingByForm(form));

  const dispatch = useAppDispatch();
  const setShowForm = (showForm: boolean) => {
    dispatch(changeShowForm({ field: form, value: showForm }));
  };
  const setHeading = (heading: string) => {
    dispatch(changeFormHeading({ field: form, value: heading }));
  };

  const isFirstForm = useAppSelector(selectIsFirstForm(form));
  const isLastForm = useAppSelector(selectIsLastForm(form));

  const handleMoveClick = (type: "up" | "down") => {
    dispatch(changeFormOrder({ form, type }));
  };

  const Icon = FORM_TO_ICON[form];

  return (
    <BaseForm
      className={cx(
        "transition-all duration-300",
        showForm ? "pb-6" : "pb-4 opacity-80 hover:opacity-100"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex grow items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full border-b border-transparent bg-transparent text-lg font-bold tracking-tight text-gray-900 outline-none hover:border-gray-300 focus:border-sky-500 dark:text-white dark:hover:border-gray-600"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center border-r border-gray-100 pr-1 mr-1 dark:border-gray-700">
            {!isFirstForm && (
              <MoveIconButton type="up" onClick={handleMoveClick} />
            )}
            {!isLastForm && (
              <MoveIconButton type="down" onClick={handleMoveClick} />
            )}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={cx(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-700",
              showForm ? "rotate-180 text-sky-500" : "text-gray-400"
            )}
          >
            <ChevronDownIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <ExpanderWithHeightTransition expanded={showForm}>
        <div className="pt-4">
          {children}
        </div>
      </ExpanderWithHeightTransition>
      {showForm && addButtonText && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              dispatch(addSectionInForm({ form }));
            }}
            className="flex items-center rounded-lg bg-sky-50 px-4 py-2 text-sm font-bold text-sky-600 transition-all hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:hover:bg-sky-900/30"
          >
            <PlusSmallIcon
              className="-ml-1 mr-1 h-5 w-5"
              aria-hidden="true"
            />
            {addButtonText}
          </button>
        </div>
      )}
    </BaseForm>
  );
};

export const FormSection = ({
  form,
  idx,
  showMoveUp,
  showMoveDown,
  showDelete,
  deleteButtonTooltipText,
  isHidden,
  children,
}: {
  form: ShowForm;
  idx: number;
  showMoveUp: boolean;
  showMoveDown: boolean;
  showDelete: boolean;
  deleteButtonTooltipText: string;
  isHidden?: boolean;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const handleDeleteClick = () => {
    dispatch(deleteSectionInFormByIdx({ form, idx }));
  };
  const handleMoveClick = (direction: "up" | "down") => {
    dispatch(moveSectionInForm({ form, direction, idx }));
  };
  const handleHideClick = (show: boolean) => {
    dispatch(changeSectionVisibility({ form, idx, isHidden: !show }));
  };

  return (
    <div className={cx(
      "group relative rounded-xl border border-transparent p-4 transition-all",
      idx !== 0 && "mt-4 border-t-gray-100 dark:border-t-gray-700 pt-8"
    )}>
      <div className="grid grid-cols-6 gap-4">
        {children}
      </div>
      
      <div className="absolute -right-2 -top-2 flex items-center gap-1 rounded-full bg-white p-1 shadow-sm border border-gray-100 opacity-0 transition-all group-hover:opacity-100 dark:bg-gray-800 dark:border-gray-700">
        {showMoveUp && (
          <MoveIconButton
            type="up"
            size="small"
            onClick={() => handleMoveClick("up")}
          />
        )}
        {showMoveDown && (
          <MoveIconButton
            type="down"
            size="small"
            onClick={() => handleMoveClick("down")}
          />
        )}
        {isHidden !== undefined && (
          <ShowIconButton
            show={!isHidden}
            setShow={handleHideClick}
            size="small"
          />
        )}
        {showDelete && (
          <DeleteIconButton
            onClick={handleDeleteClick}
            tooltipText={deleteButtonTooltipText}
          />
        )}
      </div>
    </div>
  );
};

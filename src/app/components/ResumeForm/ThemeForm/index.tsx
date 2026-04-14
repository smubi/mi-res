import { BaseForm } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { THEME_COLORS } from "components/ResumeForm/ThemeForm/constants";
import { InlineInput } from "components/ResumeForm/ThemeForm/InlineInput";
import {
  DocumentSizeSelections,
  FontFamilySelectionsCSR,
  FontSizeSelections,
} from "components/ResumeForm/ThemeForm/Selection";
import {
  changeSettings,
  DEFAULT_THEME_COLOR,
  selectSettings,
  type GeneralSetting,
} from "lib/redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import type { FontFamily } from "components/fonts/constants";
import { 
  Cog6ToothIcon, 
  TrashIcon, 
  ExclamationTriangleIcon, 
  ArrowsUpDownIcon, 
  ArrowsPointingOutIcon,
  SwatchIcon
} from "@heroicons/react/24/outline";
import { TemplateGallery } from "../TemplateGallery";

export const ThemeForm = () => {
  const settings = useAppSelector(selectSettings);
  const { fontSize, fontFamily, documentSize, margins = "40", lineHeight = "1.3" } = settings;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;
  const dispatch = useAppDispatch();

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    dispatch(changeSettings({ field, value }));
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This will clear your resume, settings, and saved versions. This action cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <BaseForm>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
              <SwatchIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Design & Layout
            </h1>
          </div>

          <TemplateGallery />
          
          <div className="space-y-4 border-t border-gray-100 pt-8 dark:border-gray-700">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Theme & Typography
            </h3>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <InlineInput
                  label="Theme Color"
                  name="themeColor"
                  value={settings.themeColor}
                  placeholder={DEFAULT_THEME_COLOR}
                  onChange={handleSettingsChange}
                  inputStyle={{ color: themeColor }}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {THEME_COLORS.map((color, idx) => (
                    <button
                      key={idx}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs text-white transition-transform hover:scale-110 active:scale-95"
                      style={{ backgroundColor: color }}
                      onClick={() => handleSettingsChange("themeColor", color)}
                    >
                      {settings.themeColor === color ? "✓" : ""}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <InputGroupWrapper label="Font Family" />
                <FontFamilySelectionsCSR
                  selectedFontFamily={fontFamily}
                  themeColor={themeColor}
                  handleSettingsChange={handleSettingsChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <InlineInput
                  label="Font Size (pt)"
                  name="fontSize"
                  value={fontSize}
                  placeholder="11"
                  onChange={handleSettingsChange}
                />
                <FontSizeSelections
                  fontFamily={fontFamily as FontFamily}
                  themeColor={themeColor}
                  selectedFontSize={fontSize}
                  handleSettingsChange={handleSettingsChange}
                />
              </div>
              <div>
                <InputGroupWrapper label="Document Size" />
                <DocumentSizeSelections
                  themeColor={themeColor}
                  selectedDocumentSize={documentSize}
                  handleSettingsChange={handleSettingsChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 border-t border-gray-100 pt-8 dark:border-gray-700">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Advanced Spacing</h3>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <ArrowsPointingOutIcon className="h-4 w-4" />
                    Side Margins
                  </label>
                  <span className="text-xs font-black text-sky-600 dark:text-sky-400">{margins}pt</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="1"
                  value={margins}
                  onChange={(e) => handleSettingsChange("margins", e.target.value)}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-100 accent-sky-500 dark:bg-gray-700"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <ArrowsUpDownIcon className="h-4 w-4" />
                    Line Spacing
                  </label>
                  <span className="text-xs font-black text-sky-600 dark:text-sky-400">{lineHeight}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => handleSettingsChange("lineHeight", e.target.value)}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-100 accent-sky-500 dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </BaseForm>

      <div className="rounded-xl border border-red-100 bg-red-50/30 p-6 dark:border-red-900/20 dark:bg-red-900/5">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <h2 className="text-sm font-bold uppercase tracking-widest">Danger Zone</h2>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Resetting will permanently delete all your data from this browser's local storage.
        </p>
        <button
          onClick={handleReset}
          className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 shadow-sm transition-all hover:bg-red-50 active:scale-95 dark:border-red-900/30 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-900/10"
        >
          <TrashIcon className="h-4 w-4" />
          Reset All Data
        </button>
      </div>
    </div>
  );
};

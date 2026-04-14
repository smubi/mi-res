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
import { Cog6ToothIcon, TrashIcon, ExclamationTriangleIcon, ArrowsUpDownIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline";

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
    <div className="space-y-8">
      <BaseForm>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Cog6ToothIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
            <h1 className="text-lg font-semibold tracking-wide text-gray-900 ">
              Resume Setting
            </h1>
          </div>
          
          <div>
            <InlineInput
              label="Theme Color"
              name="themeColor"
              value={settings.themeColor}
              placeholder={DEFAULT_THEME_COLOR}
              onChange={handleSettingsChange}
              inputStyle={{ color: themeColor }}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {THEME_COLORS.map((color, idx) => (
                <div
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-sm text-white"
                  style={{ backgroundColor: color }}
                  key={idx}
                  onClick={() => handleSettingsChange("themeColor", color)}
                  onKeyDown={(e) => {
                    if (["Enter", " "].includes(e.key))
                      handleSettingsChange("themeColor", color);
                  }}
                  tabIndex={0}
                >
                  {settings.themeColor === color ? "✓" : ""}
                </div>
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

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Advanced Layout</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ArrowsPointingOutIcon className="h-4 w-4 text-gray-400" />
                  Side Margins
                </label>
                <span className="text-xs font-bold text-sky-600">{margins}pt</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="1"
                value={margins}
                onChange={(e) => handleSettingsChange("margins", e.target.value)}
                className="w-full accent-sky-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ArrowsUpDownIcon className="h-4 w-4 text-gray-400" />
                  Line Spacing
                </label>
                <span className="text-xs font-bold text-sky-600">{lineHeight}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.1"
                value={lineHeight}
                onChange={(e) => handleSettingsChange("lineHeight", e.target.value)}
                className="w-full accent-sky-500"
              />
            </div>
          </div>
        </div>
      </BaseForm>

      <div className="rounded-md border border-red-100 bg-red-50/30 p-6">
        <div className="flex items-center gap-2 text-red-600">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <h2 className="text-sm font-bold uppercase tracking-widest">Danger Zone</h2>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Resetting will permanently delete all your data from this browser's local storage.
        </p>
        <button
          onClick={handleReset}
          className="mt-4 flex items-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 shadow-sm hover:bg-red-50 transition-colors"
        >
          <TrashIcon className="h-4 w-4" />
          Reset All Data
        </button>
      </div>
    </div>
  );
};
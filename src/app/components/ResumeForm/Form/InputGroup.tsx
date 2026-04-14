import { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { useAutosizeTextareaHeight } from "lib/hooks/useAutosizeTextareaHeight";
import { cx } from "lib/cx";

interface InputProps<K extends string, V extends string | string[]> {
  label: React.ReactNode;
  labelClassName?: string;
  name: K;
  value?: V;
  placeholder: string;
  onChange: (name: K, value: V) => void;
}

export const InputGroupWrapper = ({
  label,
  className,
  children,
}: {
  label: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) => (
  <label className={cx("flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400", className)}>
    {label}
    {children}
  </label>
);

export const INPUT_CLASS_NAME =
  "px-3 py-2.5 block w-full rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 shadow-sm outline-none font-medium text-sm transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:focus:border-sky-500 dark:focus:bg-gray-900 dark:focus:ring-sky-500/5";

export const Input = <K extends string>({
  name,
  value = "",
  placeholder,
  onChange,
  label,
  labelClassName,
}: InputProps<K, string>) => {
  return (
    <InputGroupWrapper label={label} className={labelClassName}>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className={INPUT_CLASS_NAME}
      />
    </InputGroupWrapper>
  );
};

export const Textarea = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value = "",
  placeholder,
  onChange,
}: InputProps<T, string>) => {
  const textareaRef = useAutosizeTextareaHeight({ value });

  return (
    <InputGroupWrapper label={label} className={wrapperClassName}>
      <textarea
        ref={textareaRef}
        name={name}
        className={cx(INPUT_CLASS_NAME, "resize-none overflow-hidden min-h-[80px]")}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </InputGroupWrapper>
  );
};

export const BulletListTextarea = <T extends string>(
  props: InputProps<T, string[]> & { showBulletPoints?: boolean }
) => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const isFirefox = navigator.userAgent.includes("Firefox");
    const isSafari =
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome");
    if (isFirefox || isSafari) {
      setShowFallback(true);
    }
  }, []);

  if (showFallback) {
    return <BulletListTextareaFallback {...props} />;
  }
  return <BulletListTextareaGeneral {...props} />;
};

const BulletListTextareaGeneral = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showBulletPoints = true,
}: InputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  const html = getHTMLFromBulletListStrings(bulletListStrings);
  return (
    <InputGroupWrapper label={label} className={wrapperClassName}>
      <ContentEditable
        contentEditable={true}
        className={cx(
          INPUT_CLASS_NAME,
          "cursor-text [&>div]:list-item min-h-[120px]",
          showBulletPoints ? "pl-8" : "[&>div]:list-['']"
        )}
        placeholder={placeholder}
        onChange={(e) => {
          if (e.type === "input") {
            const { innerText } = e.currentTarget as HTMLDivElement;
            const newBulletListStrings =
              getBulletListStringsFromInnerText(innerText);
            onChange(name, newBulletListStrings);
          }
        }}
        html={html}
      />
    </InputGroupWrapper>
  );
};

const NORMALIZED_LINE_BREAK = "\n";
const normalizeLineBreak = (str: string) =>
  str.replace(/\r?\n/g, NORMALIZED_LINE_BREAK);
const dedupeLineBreak = (str: string) =>
  str.replace(/\n\n/g, NORMALIZED_LINE_BREAK);
const getStringsByLineBreak = (str: string) => str.split(NORMALIZED_LINE_BREAK);

const getBulletListStringsFromInnerText = (innerText: string) => {
  const innerTextWithNormalizedLineBreak = normalizeLineBreak(innerText);
  let newInnerText = dedupeLineBreak(innerTextWithNormalizedLineBreak);
  if (newInnerText === NORMALIZED_LINE_BREAK) {
    newInnerText = "";
  }
  return getStringsByLineBreak(newInnerText);
};

const escapeHTML = (str: string) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const getHTMLFromBulletListStrings = (bulletListStrings: string[]) => {
  if (bulletListStrings.length === 0) {
    return "<div></div>";
  }
  return bulletListStrings
    .map((text) => `<div>${escapeHTML(text)}</div>`)
    .join("");
};

const BulletListTextareaFallback = <T extends string>({
  label,
  labelClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showBulletPoints = true,
}: InputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  const textareaValue = getTextareaValueFromBulletListStrings(
    bulletListStrings,
    showBulletPoints
  );

  return (
    <Textarea
      label={label}
      labelClassName={labelClassName}
      name={name}
      value={textareaValue}
      placeholder={placeholder}
      onChange={(name, value) => {
        onChange(
          name,
          getBulletListStringsFromTextareaValue(value, showBulletPoints)
        );
      }}
    />
  );
};

const getTextareaValueFromBulletListStrings = (
  bulletListStrings: string[],
  showBulletPoints: boolean
) => {
  const prefix = showBulletPoints ? "• " : "";
  if (bulletListStrings.length === 0) {
    return prefix;
  }
  let value = "";
  for (let i = 0; i < bulletListStrings.length; i++) {
    const string = bulletListStrings[i];
    const isLastItem = i === bulletListStrings.length - 1;
    value += `${prefix}${string}${isLastItem ? "" : "\r\n"}`;
  }
  return value;
};

const getBulletListStringsFromTextareaValue = (
  textareaValue: string,
  showBulletPoints: boolean
) => {
  const textareaValueWithNormalizedLineBreak =
    normalizeLineBreak(textareaValue);
  const strings = getStringsByLineBreak(textareaValueWithNormalizedLineBreak);
  if (showBulletPoints) {
    const nonEmptyStrings = strings.filter((s) => s !== "•");
    let newStrings: string[] = [];
    for (let string of nonEmptyStrings) {
      if (string.startsWith("• ")) {
        newStrings.push(string.slice(2));
      } else if (string.startsWith("•")) {
        const lastItemIdx = newStrings.length - 1;
        if (lastItemIdx >= 0) {
          const lastItem = newStrings[lastItemIdx];
          newStrings[lastItemIdx] = `${lastItem}${string.slice(1)}`;
        } else {
          newStrings.push(string.slice(1));
        }
      } else {
        newStrings.push(string);
      }
    }
    return newStrings;
  }
  return strings;
};

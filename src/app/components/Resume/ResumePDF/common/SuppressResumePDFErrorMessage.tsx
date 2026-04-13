"use client";

/**
 * Suppress ResumePDF development errors.
 * See ResumePDF doc string for context.
 */
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  const consoleError = console.error;
  const SUPPRESSED_WARNINGS = ["DOCUMENT", "PAGE", "TEXT", "VIEW"];
  console.error = function filterWarnings(msg, ...args) {
    const isSuppressed =
      (typeof msg === "string" &&
        SUPPRESSED_WARNINGS.some((entry) => msg.includes(entry))) ||
      (typeof args[0] === "string" &&
        SUPPRESSED_WARNINGS.some((entry) => args[0].includes(entry)));

    if (!isSuppressed) {
      consoleError(msg, ...args);
    }
  };
}

export const SuppressResumePDFErrorMessage = () => {
  return <></>;
};

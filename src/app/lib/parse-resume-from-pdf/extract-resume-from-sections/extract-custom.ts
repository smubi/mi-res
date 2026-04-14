import type { ResumeCustom } from "lib/redux/types";
import type { ResumeSectionToLines } from "lib/parse-resume-from-pdf/types";
import { getSectionLinesByKeywords } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/get-section-lines";
import { getBulletPointsFromLines } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/bullet-points";

const CUSTOM_SECTION_KEYWORDS = [
  "certification",
  "language",
  "award",
  "honor",
  "publication",
  "interest",
  "volunteer",
];

export const extractCustom = (sections: ResumeSectionToLines) => {
  const descriptions: string[] = [];

  for (const keyword of CUSTOM_SECTION_KEYWORDS) {
    const lines = getSectionLinesByKeywords(sections, [keyword]);
    if (lines.length > 0) {
      const bulletPoints = getBulletPointsFromLines(lines);
      if (bulletPoints.length > 0) {
        // Add a header for the custom section if it's not already there
        const header = keyword.charAt(0).toUpperCase() + keyword.slice(1) + "s";
        descriptions.push(`${header}: ${bulletPoints.join(", ")}`);
      }
    }
  }

  const custom: ResumeCustom = {
    descriptions,
  };

  return { custom };
};

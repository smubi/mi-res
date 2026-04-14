import type {
  Resume,
  ResumeWorkExperience,
  ResumeEducation,
  ResumeProject,
  FeaturedSkill,
} from "./redux/types";

export interface JsonResume {
  basics?: {
    name?: string;
    label?: string;
    image?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: {
      address?: string;
      postalCode?: string;
      city?: string;
      countryCode?: string;
      region?: string;
    };
    profiles?: Array<{
      network?: string;
      username?: string;
      url?: string;
    }>;
  };
  work?: Array<{
    name?: string;
    position?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }>;
  volunteer?: Array<{
    organization?: string;
    position?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    summary?: string;
    highlights?: string[];
  }>;
  education?: Array<{
    institution?: string;
    url?: string;
    area?: string;
    studyType?: string;
    startDate?: string;
    endDate?: string;
    score?: string;
    courses?: string[];
  }>;
  awards?: Array<{
    title?: string;
    date?: string;
    awarder?: string;
    summary?: string;
  }>;
  certificates?: Array<{
    name?: string;
    date?: string;
    issuer?: string;
    url?: string;
  }>;
  publications?: Array<{
    name?: string;
    publisher?: string;
    releaseDate?: string;
    url?: string;
    summary?: string;
  }>;
  skills?: Array<{
    name?: string;
    level?: string;
    keywords?: string[];
  }>;
  languages?: Array<{
    language?: string;
    fluency?: string;
  }>;
  interests?: Array<{
    name?: string;
    keywords?: string[];
  }>;
  references?: Array<{
    name?: string;
    reference?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    highlights?: string[];
    keywords?: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
    roles?: string[];
    entity?: string;
    type?: string;
  }>;
}

export const mapJsonResumeToResume = (json: JsonResume): Resume => {
  const profile = {
    name: json.basics?.name || "",
    email: json.basics?.email || "",
    phone: json.basics?.phone || "",
    url: json.basics?.url || "",
    summary: json.basics?.summary || "",
    location: json.basics?.location?.city || "",
  };

  const workExperiences: ResumeWorkExperience[] = (json.work || []).map(
    (w) => ({
      company: w.name || "",
      jobTitle: w.position || "",
      date: formatDateRange(w.startDate, w.endDate),
      descriptions: w.highlights || (w.summary ? [w.summary] : []),
    })
  );

  const educations: ResumeEducation[] = (json.education || []).map((e) => ({
    school: e.institution || "",
    degree: e.studyType ? `${e.studyType} in ${e.area}` : e.area || "",
    date: formatDateRange(e.startDate, e.endDate),
    gpa: e.score || "",
    descriptions: e.courses || [],
  }));

  const projects: ResumeProject[] = (json.projects || []).map((p) => ({
    project: p.name || "",
    date: formatDateRange(p.startDate, p.endDate),
    descriptions: p.highlights || (p.description ? [p.description] : []),
  }));

  const featuredSkills: FeaturedSkill[] = (json.skills || [])
    .slice(0, 6)
    .map((s) => ({
      skill: s.name || "",
      rating: mapSkillLevelToRating(s.level),
    }));

  // Fill up to 6 featured skills if needed
  while (featuredSkills.length < 6) {
    featuredSkills.push({ skill: "", rating: 4 });
  }

  const skillsDescriptions = (json.skills || [])
    .flatMap((s) => s.keywords || [])
    .filter(Boolean);

  const skills = {
    featuredSkills,
    descriptions: skillsDescriptions,
  };

  const custom = {
    descriptions: [],
  };

  return {
    profile,
    workExperiences:
      workExperiences.length > 0
        ? workExperiences
        : [{ company: "", jobTitle: "", date: "", descriptions: [] }],
    educations:
      educations.length > 0
        ? educations
        : [{ school: "", degree: "", gpa: "", date: "", descriptions: [] }],
    projects:
      projects.length > 0
        ? projects
        : [{ project: "", date: "", descriptions: [] }],
    skills,
    custom,
  };
};

export const mapResumeToJsonResume = (resume: Resume): JsonResume => {
  const basics = {
    name: resume.profile.name,
    email: resume.profile.email,
    phone: resume.profile.phone,
    url: resume.profile.url,
    summary: resume.profile.summary,
    location: {
      city: resume.profile.location,
    },
  };

  const work = resume.workExperiences.map((w) => {
    const { startDate, endDate } = parseDateRange(w.date);
    return {
      name: w.company,
      position: w.jobTitle,
      startDate,
      endDate,
      highlights: w.descriptions,
    };
  });

  const education = resume.educations.map((e) => {
    const { startDate, endDate } = parseDateRange(e.date);
    return {
      institution: e.school,
      area: e.degree,
      startDate,
      endDate,
      score: e.gpa,
      courses: e.descriptions,
    };
  });

  const projects = resume.projects.map((p) => {
    const { startDate, endDate } = parseDateRange(p.date);
    return {
      name: p.project,
      startDate,
      endDate,
      highlights: p.descriptions,
    };
  });

  const skills = resume.skills.featuredSkills
    .filter((s) => s.skill)
    .map((s) => ({
      name: s.skill,
      level: mapRatingToSkillLevel(s.rating),
      keywords: resume.skills.descriptions,
    }));

  return {
    basics,
    work,
    education,
    projects,
    skills,
  };
};

function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return "";
  if (start && !end) return `${start} - Present`;
  if (!start && end) return end;
  return `${start} - ${end}`;
}

function parseDateRange(dateStr: string) {
  if (!dateStr) return { startDate: "", endDate: "" };
  const parts = dateStr.split("-").map((s) => s.trim());
  if (parts.length === 2) {
    return {
      startDate: parts[0],
      endDate: parts[1].toLowerCase() === "present" ? "" : parts[1],
    };
  }
  return { startDate: dateStr, endDate: "" };
}

function mapSkillLevelToRating(level?: string): number {
  if (!level) return 4;
  const l = level.toLowerCase();
  if (l.includes("expert") || l.includes("master")) return 5;
  if (l.includes("advanced") || l.includes("senior")) return 4;
  if (l.includes("intermediate") || l.includes("mid")) return 3;
  if (l.includes("beginner") || l.includes("junior")) return 2;
  return 4;
}

function mapRatingToSkillLevel(rating: number): string {
  if (rating >= 5) return "Expert";
  if (rating >= 4) return "Advanced";
  if (rating >= 3) return "Intermediate";
  return "Beginner";
}

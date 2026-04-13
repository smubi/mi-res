import { initialResumeState } from "./redux/resumeSlice";
import type { Resume } from "./redux/types";

/**
 * Mock AI response type based on the prompt's expected output.
 * Note: Some fields are slightly different from our internal Resume type.
 */
interface AIResumeResponse {
  profile?: {
    name?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: string;
  };
  workExperiences?: {
    company?: string;
    jobTitle?: string;
    date?: string;
    description?: string;
  }[];
  educations?: {
    school?: string;
    degree?: string;
    date?: string;
    gpa?: string;
    description?: string;
  }[];
  projects?: {
    project?: string;
    date?: string;
    description?: string;
  }[];
  skills?: {
    featuredSkills?: { skill: string; rating: number }[];
    descriptions?: string[];
  };
}

/**
 * Maps the AI's JSON output to our internal Resume type.
 * Handles differences like 'description' (string) vs 'descriptions' (string[]).
 */
const mapAIResponseToResume = (aiResponse: AIResumeResponse): Resume => {
  const resume: Resume = JSON.parse(JSON.stringify(initialResumeState));

  if (aiResponse.profile) {
    resume.profile = {
      ...resume.profile,
      ...aiResponse.profile,
    };
  }

  if (aiResponse.workExperiences && aiResponse.workExperiences.length > 0) {
    resume.workExperiences = aiResponse.workExperiences.map((exp) => ({
      company: exp.company || "",
      jobTitle: exp.jobTitle || "",
      date: exp.date || "",
      descriptions: exp.description
        ? exp.description
            .split("\n")
            .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
            .filter((line) => line !== "")
        : [],
    }));
  }

  if (aiResponse.educations && aiResponse.educations.length > 0) {
    resume.educations = aiResponse.educations.map((edu) => ({
      school: edu.school || "",
      degree: edu.degree || "",
      date: edu.date || "",
      gpa: edu.gpa || "",
      descriptions: edu.description
        ? edu.description
            .split("\n")
            .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
            .filter((line) => line !== "")
        : [],
    }));
  }

  if (aiResponse.projects && aiResponse.projects.length > 0) {
    resume.projects = aiResponse.projects.map((proj) => ({
      project: proj.project || "",
      date: proj.date || "",
      descriptions: proj.description
        ? proj.description
            .split("\n")
            .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
            .filter((line) => line !== "")
        : [],
    }));
  }

  if (aiResponse.skills) {
    if (aiResponse.skills.featuredSkills) {
      // Fill up to 6 featured skills as per initialResumeState
      const featuredSkills = [...resume.skills.featuredSkills];
      aiResponse.skills.featuredSkills.forEach((skill, index) => {
        if (index < featuredSkills.length) {
          featuredSkills[index] = skill;
        }
      });
      resume.skills.featuredSkills = featuredSkills;
    }
    if (aiResponse.skills.descriptions) {
      resume.skills.descriptions = aiResponse.skills.descriptions;
    }
  }

  return resume;
};

/**
 * Simulates an AI call to parse resume text.
 * In a real app, this would call an LLM API with a specific prompt.
 */
export const parseResumeFromText = async (text: string): Promise<Resume> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (!text || text.trim().length < 10) {
    throw new Error("Please provide more resume content to parse.");
  }

  // Mock AI logic: try to extract some basic info if present in text
  // This is a very simple heuristic for the mock
  const lines = text.split("\n").map((l) => l.trim());
  const name = lines[0] || "John Doe";
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : "";

  // Simulated AI JSON response
  const mockAIResponse: AIResumeResponse = {
    profile: {
      name: name,
      email: email,
      summary: "Professional with experience in software development and project management.",
    },
    workExperiences: [
      {
        company: "Example Corp",
        jobTitle: "Senior Developer",
        date: "2020 - Present",
        description: "• Led a team of 5 developers\n• Improved system performance by 30%\n• Implemented new CI/CD pipeline",
      },
    ],
    educations: [
      {
        school: "University of Technology",
        degree: "B.S. in Computer Science",
        date: "2016 - 2020",
        gpa: "3.8",
      },
    ],
    skills: {
      featuredSkills: [
        { skill: "React", rating: 5 },
        { skill: "TypeScript", rating: 4 },
        { skill: "Node.js", rating: 4 },
      ],
      descriptions: ["Agile Methodologies", "Cloud Computing", "System Design"],
    },
  };

  return mapAIResponseToResume(mockAIResponse);
};

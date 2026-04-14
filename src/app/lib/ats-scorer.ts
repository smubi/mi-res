import { Resume } from "./redux/types";

export interface ATSCriterion {
  id: string;
  name: string;
  category: "Content" | "Technical" | "Formatting";
  score: number; // 0 to 100
  status: "pass" | "fail" | "warning";
  message: string;
  tip: string;
}

export interface ATSReport {
  overallScore: number;
  criteria: ATSCriterion[];
  jobTitle: string;
}

const ACTION_VERBS = [
  "achieved", "acquired", "adapted", "addressed", "administered", "advised", "allocated", "analyzed", "anticipated", "applied", "approved", "arranged", "assessed", "assigned", "assisted", "attained", "audited", "authored", "automated", "balanced", "budgeted", "built", "calculated", "captured", "cataloged", "centralized", "chaired", "changed", "checked", "clarified", "classified", "closed", "coached", "collaborated", "collected", "combined", "communicated", "compared", "compiled", "completed", "composed", "computed", "conceptualized", "conducted", "concluded", "consolidated", "constructed", "consulted", "contracted", "contributed", "controlled", "converted", "coordinated", "corrected", "counseled", "created", "critiqued", "cultivated", "customized", "debugged", "decided", "defined", "delegated", "delivered", "demonstrated", "designed", "detected", "determined", "developed", "devised", "directed", "discovered", "displayed", "distributed", "documented", "doubled", "drafted", "drove", "edited", "educated", "effected", "eliminated", "enabled", "enacted", "encouraged", "engineered", "enhanced", "enlarged", "enlisted", "ensured", "established", "estimated", "evaluated", "examined", "executed", "expanded", "expedited", "experimented", "explained", "explored", "facilitated", "finalized", "financed", "forecasted", "formed", "formulated", "fostered", "founded", "generated", "governed", "graduated", "guided", "halted", "handled", "headed", "helped", "identified", "illustrated", "implemented", "improved", "increased", "influenced", "informed", "initiated", "inspected", "inspired", "installed", "instituted", "instructed", "integrated", "intensified", "interpreted", "introduced", "invented", "investigated", "launched", "lectured", "led", "licensed", "listened", "located", "maintained", "managed", "mapped", "marketed", "maximized", "measured", "mediated", "mentored", "merged", "minimized", "modeled", "moderated", "modernized", "modified", "monitored", "motivated", "negotiated", "observed", "obtained", "operated", "optimized", "orchestrated", "organized", "oriented", "outlined", "overhauled", "oversaw", "participated", "performed", "persuaded", "pioneered", "planned", "prepared", "presented", "prioritized", "processed", "produced", "programmed", "projected", "promoted", "proposed", "provided", "published", "purchased", "qualified", "quantified", "raised", "ranked", "reached", "received", "recommended", "reconciled", "recorded", "recruited", "redesigned", "reduced", "referred", "regulated", "rehabilitated", "remodeled", "rendered", "reorganized", "repaired", "replaced", "reported", "represented", "researched", "resolved", "responded", "restored", "restructured", "retrieved", "reviewed", "revised", "revitalized", "routed", "saved", "scheduled", "screened", "searched", "secured", "selected", "served", "serviced", "settled", "shaped", "simplified", "simulated", "sketched", "sold", "solved", "sorted", "spearheaded", "specialized", "specified", "spoke", "sponsored", "staffed", "standardized", "started", "stimulated", "strategized", "streamlined", "strengthened", "structured", "studied", "submitted", "suggested", "summarized", "supervised", "supplied", "supported", "surpassed", "surveyed", "synthesized", "systematized", "tabulated", "taught", "tested", "thrived", "tracked", "trained", "transferred", "transformed", "translated", "transmitted", "tutored", "updated", "upgraded", "utilized", "validated", "valued", "verified", "visited", "vitalized", "wrote"
];

const COMMON_SKILLS = [
  "python", "javascript", "typescript", "react", "node.js", "java", "c++", "sql", "aws", "azure", "docker", "kubernetes", "git", "agile", "scrum", "project management", "communication", "leadership", "problem solving", "analytical", "teamwork", "customer service", "sales", "marketing", "design", "ui/ux", "figma", "adobe creative suite", "excel", "data analysis", "machine learning", "ai", "cloud computing", "devops", "security", "networking", "linux", "windows", "macos", "mobile development", "ios", "android", "web development", "frontend", "backend", "fullstack"
];

export function calculateATSScore(resume: Resume, jobDescription: string): ATSReport {
  const criteria: ATSCriterion[] = [];
  const jdLower = jobDescription.toLowerCase();
  const resumeText = JSON.stringify(resume).toLowerCase();

  // 1. Keyword Match
  const jdWords = new Set(jdLower.match(/\w+/g) || []);
  const resumeWords = new Set(resumeText.match(/\w+/g) || []);
  let matchCount = 0;
  jdWords.forEach(word => {
    if (resumeWords.has(word)) matchCount++;
  });
  const keywordScore = jdWords.size > 0 ? Math.min(100, Math.round((matchCount / jdWords.size) * 100)) : 0;
  criteria.push({
    id: "keyword-match",
    name: "Keyword Match",
    category: "Content",
    score: keywordScore,
    status: keywordScore > 70 ? "pass" : keywordScore > 40 ? "warning" : "fail",
    message: `Matched ${matchCount} out of ${jdWords.size} unique keywords from the job description.`,
    tip: "Incorporate more specific keywords and phrases from the job description into your resume."
  });

  // 2. Hard Skills Match
  const foundSkills = COMMON_SKILLS.filter(skill => jdLower.includes(skill));
  const matchedSkills = foundSkills.filter(skill => resumeText.includes(skill));
  const skillsScore = foundSkills.length > 0 ? Math.min(100, Math.round((matchedSkills.length / foundSkills.length) * 100)) : 100;
  criteria.push({
    id: "hard-skills",
    name: "Hard Skills Match",
    category: "Technical",
    score: skillsScore,
    status: skillsScore > 80 ? "pass" : skillsScore > 50 ? "warning" : "fail",
    message: `Matched ${matchedSkills.length} out of ${foundSkills.length} identified technical skills.`,
    tip: "Ensure all technical skills mentioned in the job description are explicitly listed in your skills section."
  });

  // 3. Job Title Match
  const jdTitleMatch = jdLower.match(/title[:\s]+([^\n,]+)/i) || [null, ""];
  const targetTitle = jdTitleMatch[1]?.trim() || "";
  const hasTitle = targetTitle && resumeText.includes(targetTitle.toLowerCase());
  criteria.push({
    id: "job-title",
    name: "Job Title Match",
    category: "Content",
    score: hasTitle ? 100 : 0,
    status: hasTitle ? "pass" : "fail",
    message: hasTitle ? "Target job title found in resume." : "Target job title not explicitly found in resume.",
    tip: "Include the exact job title you are applying for in your professional summary or as a headline."
  });

  // 4. Action Verbs
  const resumeActionVerbs = ACTION_VERBS.filter(verb => resumeText.includes(verb));
  const verbScore = Math.min(100, Math.round((resumeActionVerbs.length / 20) * 100));
  criteria.push({
    id: "action-verbs",
    name: "Action Verbs",
    category: "Content",
    score: verbScore,
    status: verbScore > 70 ? "pass" : verbScore > 40 ? "warning" : "fail",
    message: `Used ${resumeActionVerbs.length} strong action verbs.`,
    tip: "Start your bullet points with strong action verbs like 'Led', 'Developed', or 'Optimized'."
  });

  // 5. Quantification (Metrics)
  const metricsRegex = /\d+%|\$\d+|\d+\s*(?:percent|dollars|users|customers|clients|projects|years)/g;
  const metricsMatches = resumeText.match(metricsRegex) || [];
  const metricsScore = Math.min(100, Math.round((metricsMatches.length / 10) * 100));
  criteria.push({
    id: "quantification",
    name: "Quantifiable Results",
    category: "Content",
    score: metricsScore,
    status: metricsScore > 60 ? "pass" : metricsScore > 30 ? "warning" : "fail",
    message: `Found ${metricsMatches.length} instances of quantifiable metrics.`,
    tip: "Use numbers, percentages, and dollar amounts to demonstrate the impact of your work."
  });

  // 6. Email Presence
  const hasEmail = !!resume.profile.email;
  criteria.push({
    id: "email-presence",
    name: "Email Address",
    category: "Technical",
    score: hasEmail ? 100 : 0,
    status: hasEmail ? "pass" : "fail",
    message: hasEmail ? "Email address is present." : "Email address is missing.",
    tip: "Ensure your professional email address is clearly visible in the contact section."
  });

  // 7. Phone Presence
  const hasPhone = !!resume.profile.phone;
  criteria.push({
    id: "phone-presence",
    name: "Phone Number",
    category: "Technical",
    score: hasPhone ? 100 : 0,
    status: hasPhone ? "pass" : "fail",
    message: hasPhone ? "Phone number is present." : "Phone number is missing.",
    tip: "Include a valid phone number so recruiters can easily reach you."
  });

  // 8. URL Presence
  const hasUrl = !!resume.profile.url;
  criteria.push({
    id: "url-presence",
    name: "Online Profile",
    category: "Technical",
    score: hasUrl ? 100 : 0,
    status: hasUrl ? "pass" : "warning",
    message: hasUrl ? "LinkedIn or portfolio URL is present." : "No LinkedIn or portfolio URL found.",
    tip: "Add a link to your LinkedIn profile or personal portfolio to provide more context."
  });

  // 9. Summary Presence
  const hasSummary = !!resume.profile.summary;
  criteria.push({
    id: "summary-presence",
    name: "Professional Summary",
    category: "Content",
    score: hasSummary ? 100 : 0,
    status: hasSummary ? "pass" : "warning",
    message: hasSummary ? "Professional summary is present." : "Professional summary is missing.",
    tip: "A brief summary helps recruiters quickly understand your value proposition."
  });

  // 10. Education Presence
  const hasEducation = resume.educations.length > 0;
  criteria.push({
    id: "education-presence",
    name: "Education Section",
    category: "Formatting",
    score: hasEducation ? 100 : 0,
    status: hasEducation ? "pass" : "fail",
    message: hasEducation ? "Education section is present." : "Education section is missing.",
    tip: "Always include your educational background, even if it's just relevant certifications."
  });

  // 11. Work Experience Presence
  const hasWork = resume.workExperiences.length > 0;
  criteria.push({
    id: "work-presence",
    name: "Work Experience",
    category: "Formatting",
    score: hasWork ? 100 : 0,
    status: hasWork ? "pass" : "fail",
    message: hasWork ? "Work experience section is present." : "Work experience section is missing.",
    tip: "The work experience section is the core of your resume. Ensure it's well-detailed."
  });

  // 12. Skills Presence
  const hasSkills = resume.skills.featuredSkills.length > 0 || resume.skills.descriptions.length > 0;
  criteria.push({
    id: "skills-presence",
    name: "Skills Section",
    category: "Formatting",
    score: hasSkills ? 100 : 0,
    status: hasSkills ? "pass" : "fail",
    message: hasSkills ? "Skills section is present." : "Skills section is missing.",
    tip: "A dedicated skills section helps ATS and recruiters quickly scan your capabilities."
  });

  // 13. Projects Presence
  const hasProjects = resume.projects.length > 0;
  criteria.push({
    id: "projects-presence",
    name: "Projects Section",
    category: "Formatting",
    score: hasProjects ? 100 : 0,
    status: hasProjects ? "pass" : "warning",
    message: hasProjects ? "Projects section is present." : "No projects section found.",
    tip: "Including projects can demonstrate practical application of your skills, especially for junior roles."
  });

  // 14. Bullet Point Density
  const totalBullets = resume.workExperiences.reduce((acc, exp) => acc + exp.descriptions.length, 0);
  const avgBullets = resume.workExperiences.length > 0 ? totalBullets / resume.workExperiences.length : 0;
  const bulletScore = avgBullets >= 3 && avgBullets <= 6 ? 100 : avgBullets > 0 ? 50 : 0;
  criteria.push({
    id: "bullet-density",
    name: "Bullet Point Density",
    category: "Formatting",
    score: bulletScore,
    status: bulletScore === 100 ? "pass" : "warning",
    message: `Average of ${avgBullets.toFixed(1)} bullet points per role.`,
    tip: "Aim for 3-6 bullet points per work experience to provide enough detail without being overwhelming."
  });

  // 15. Summary Length
  const summaryWords = resume.profile.summary.split(/\s+/).filter(Boolean).length;
  const summaryLengthScore = summaryWords >= 30 && summaryWords <= 100 ? 100 : summaryWords > 0 ? 50 : 0;
  criteria.push({
    id: "summary-length",
    name: "Summary Length",
    category: "Content",
    score: summaryLengthScore,
    status: summaryLengthScore === 100 ? "pass" : "warning",
    message: `Summary is ${summaryWords} words long.`,
    tip: "Keep your professional summary between 30 and 100 words for maximum impact."
  });

  // 16. Recent Experience
  const currentYear = new Date().getFullYear();
  const hasRecent = resume.workExperiences.some(exp => {
    const yearMatch = exp.date.match(/\d{4}/);
    return yearMatch && (currentYear - parseInt(yearMatch[0])) <= 3;
  });
  criteria.push({
    id: "recent-experience",
    name: "Recent Experience",
    category: "Content",
    score: hasRecent ? 100 : 0,
    status: hasRecent ? "pass" : "warning",
    message: hasRecent ? "Found experience within the last 3 years." : "No recent experience (last 3 years) detected.",
    tip: "Highlight your most recent roles to show you are active in the field."
  });

  // 17. Skill Variety
  const totalSkills = resume.skills.featuredSkills.length + resume.skills.descriptions.length;
  const varietyScore = Math.min(100, Math.round((totalSkills / 15) * 100));
  criteria.push({
    id: "skill-variety",
    name: "Skill Variety",
    category: "Technical",
    score: varietyScore,
    status: varietyScore > 70 ? "pass" : varietyScore > 40 ? "warning" : "fail",
    message: `Listed ${totalSkills} distinct skills.`,
    tip: "Aim to list 10-20 relevant skills to show a broad yet focused expertise."
  });

  // 18. Contact Info Completeness
  const contactFields = [resume.profile.name, resume.profile.email, resume.profile.phone, resume.profile.location];
  const filledFields = contactFields.filter(Boolean).length;
  const contactScore = Math.round((filledFields / contactFields.length) * 100);
  criteria.push({
    id: "contact-completeness",
    name: "Contact Completeness",
    category: "Technical",
    score: contactScore,
    status: contactScore === 100 ? "pass" : contactScore > 50 ? "warning" : "fail",
    message: `Filled ${filledFields} out of ${contactFields.length} essential contact fields.`,
    tip: "Ensure Name, Email, Phone, and Location are all present in your profile."
  });

  // 19. Soft Skills Match
  const SOFT_SKILLS = ["communication", "leadership", "teamwork", "problem solving", "analytical", "adaptability", "time management"];
  const foundSoftSkills = SOFT_SKILLS.filter(skill => jdLower.includes(skill));
  const matchedSoftSkills = foundSoftSkills.filter(skill => resumeText.includes(skill));
  const softSkillsScore = foundSoftSkills.length > 0 ? Math.min(100, Math.round((matchedSoftSkills.length / foundSoftSkills.length) * 100)) : 100;
  criteria.push({
    id: "soft-skills",
    name: "Soft Skills Match",
    category: "Content",
    score: softSkillsScore,
    status: softSkillsScore > 70 ? "pass" : softSkillsScore > 40 ? "warning" : "fail",
    message: `Matched ${matchedSoftSkills.length} out of ${foundSoftSkills.length} identified soft skills.`,
    tip: "Don't forget to weave soft skills like 'leadership' or 'communication' into your experience descriptions."
  });

  // 20. Experience Duration
  const yearsRegex = /(\d+)\+?\s*years?/g;
  const jdYearsMatches = jdLower.match(yearsRegex) || [];
  const requiredYears = jdYearsMatches.length > 0 ? Math.max(...jdYearsMatches.map(m => parseInt(m))) : 0;
  
  // Simple heuristic for resume years: sum of differences in dates if they look like years
  let resumeYears = 0;
  resume.workExperiences.forEach(exp => {
    const years = exp.date.match(/\d{4}/g);
    if (years && years.length === 2) {
      resumeYears += Math.abs(parseInt(years[1]) - parseInt(years[0]));
    } else if (years && years.length === 1 && exp.date.toLowerCase().includes("present")) {
      resumeYears += currentYear - parseInt(years[0]);
    }
  });

  const expScore = requiredYears === 0 ? 100 : Math.min(100, Math.round((resumeYears / requiredYears) * 100));
  criteria.push({
    id: "experience-duration",
    name: "Experience Duration",
    category: "Content",
    score: expScore,
    status: expScore >= 100 ? "pass" : expScore > 50 ? "warning" : "fail",
    message: `Estimated ${resumeYears} years of experience vs ~${requiredYears} years mentioned in JD.`,
    tip: "Ensure your work history dates are clear so ATS can accurately calculate your years of experience."
  });

  const overallScore = Math.round(criteria.reduce((acc, c) => acc + c.score, 0) / criteria.length);

  return {
    overallScore,
    criteria,
    jobTitle: targetTitle || "Target Position"
  };
}

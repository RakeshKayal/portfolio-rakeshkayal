import type { ReactNode } from 'react';

export interface ResumeExperience {
  company: string;
  subName?: string;
  role: string;
  duration: string;
  location?: string;
  bullets: string[];
  tags: string[];
}

export interface ResumeProject {
  id?: string;
  title: string;
  category?: string;
  technologies?: string[];
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  link?: string;
  summary?: string;
  description?: string;
  highlights?: string[];
  metrics?: string;
  featured?: boolean;
}

export interface SkillCategory {
  category: string;
  color: string;
  skills: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  specialization: string;
  duration: string;
  grade: string;
  location: string;
}

export interface ResumeCertification {
  title: string;
  issuer: string;
  year: string;
  credentialUrl?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  status: string;
  phone: string;
  email: string;
  location: string;
  socials: {
    linkedin: string;
    github: string;
    leetcode: string;
  };
  summary: string;
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: SkillCategory[];
  coreCS: string[];
  tools: string[];
  education: ResumeEducation;
  certifications: ResumeCertification[];
  stats: {
    leetcodeSolved: string;
    concurrentUsersTested: string;
    throughputTested: string;
    cgpa: string;
  };
}

export type WindowId = 'safari' | 'terminal' | 'finder' | 'mail' | 'siri' | 'settings' | 'whatsapp';

export type UserRole = 'admin' | 'visitor';

export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface TerminalOutputItem {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'system';
  content: string | ReactNode;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

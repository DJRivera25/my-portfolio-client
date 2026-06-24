export interface Project {
  _id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  featured?: boolean;
  tags?: string[];
  year?: number;
  role?: string;
  mobileImage?: string;
  /** Case-study fields ("The Build Log" presentation) */
  tagline?: string;
  kind?: string;
  problem?: string;
  solution?: string;
  highlights?: string[];
}

/** Presentation view-model for the "Selected Work" cinematic track + case-study drawer. */
export interface CaseStudy {
  id: string;
  no: string;
  year: string;
  kind: string;
  dot: string;
  title: string;
  tagline: string;
  image: string;
  stack: string[];
  role: string;
  problem: string;
  solution: string;
  highlights: string[];
  link: string;
  statusLabel: string;
}

export interface Tool {
  _id: string;
  name: string;
  category: string;
  icon: string;
  description?: string;
}

export interface Social {
  _id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface ResumeDoc {
  _id: string;
  url: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  content: string;
  subject?: string;
  hasViewed?: boolean;
  createdAt?: string;
}

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
}

export interface Tool {
  _id: string;
  name: string;
  category: string;
  icon: string;
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

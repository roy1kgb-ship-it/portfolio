export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  challenge?: string; // New field for case study
  solution?: string;  // New field for case study
  specs: string[];
  tech: string[];
  status: 'DEPLOYED' | 'PROTOTYPE' | 'RESEARCH' | 'ACADEMIC' | 'CLASSIFIED';
  imageUrl?: string;
  date?: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Software' | 'Hardware' | 'Firmware' | 'Tools';
}

export interface Article {
  id: string;
  title: string;
  date: string;
  readTime: string;
  tag: string;
  excerpt: string;
  content: string[]; // Array of paragraphs for the full article
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}
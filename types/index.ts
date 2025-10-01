export interface ResumeData {
  id: string;
  originalText: string;
  enhancedText: string;
  originalScore: number;
  enhancedScore: number;
  fileName: string;
  uploadDate: Date;
  status: 'processing' | 'completed' | 'error';
}

export interface ATSScore {
  overall: number;
  keywords: number;
  formatting: number;
  readability: number;
  structure: number;
  suggestions: string[];
}

export interface ParsedResume {
  text: string;
  sections: {
    personalInfo?: PersonalInfo;
    summary?: string;
    experience?: Experience[];
    education?: Education[];
    skills?: string[];
    certifications?: string[];
  };
  atsScore: ATSScore;
}

export interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
  achievements?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

export interface EnhancementRequest {
  originalText: string;
  targetRole?: string;
  industry?: string;
  keywords?: string[];
  atsScore: ATSScore;
}

export interface EnhancementResponse {
  enhancedText: string;
  improvements: string[];
  newScore: ATSScore;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadProgress {
  stage: 'uploading' | 'parsing' | 'analyzing' | 'enhancing' | 'generating' | 'completed';
  progress: number;
  message: string;
}

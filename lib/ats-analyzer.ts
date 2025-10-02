import { ATSScore, ParsedResume } from '@/types';
import { ResumeParser } from './resume-parser';

export class ATSAnalyzer {
  private static readonly INDUSTRY_KEYWORDS = {
    technology: [
      'software', 'development', 'programming', 'coding', 'javascript', 'python', 'java',
      'react', 'node.js', 'database', 'api', 'cloud', 'aws', 'docker', 'kubernetes',
      'agile', 'scrum', 'git', 'ci/cd', 'microservices', 'full-stack', 'frontend', 'backend'
    ],
    marketing: [
      'marketing', 'digital marketing', 'seo', 'sem', 'social media', 'content marketing',
      'brand management', 'campaign', 'analytics', 'conversion', 'lead generation',
      'email marketing', 'ppc', 'roi', 'kpi', 'customer acquisition', 'retention'
    ],
    finance: [
      'financial analysis', 'accounting', 'budgeting', 'forecasting', 'investment',
      'portfolio management', 'risk management', 'compliance', 'audit', 'taxation',
      'financial modeling', 'valuation', 'excel', 'quickbooks', 'gaap', 'ifrs'
    ],
    healthcare: [
      'patient care', 'medical', 'clinical', 'healthcare', 'nursing', 'diagnosis',
      'treatment', 'medical records', 'hipaa', 'patient safety', 'quality improvement',
      'healthcare administration', 'medical terminology', 'pharmacology'
    ],
    sales: [
      'sales', 'business development', 'lead generation', 'client relationship',
      'negotiation', 'closing', 'quota', 'pipeline', 'crm', 'prospecting',
      'account management', 'revenue growth', 'customer retention', 'b2b', 'b2c'
    ],
    general: [
      'leadership', 'management', 'communication', 'problem-solving', 'teamwork',
      'project management', 'strategic planning', 'process improvement', 'training',
      'mentoring', 'collaboration', 'innovation', 'analytical', 'detail-oriented'
    ]
  };

  private static readonly POWER_WORDS = [
    'achieved', 'improved', 'increased', 'decreased', 'managed', 'led', 'developed',
    'implemented', 'created', 'designed', 'optimized', 'streamlined', 'delivered',
    'exceeded', 'generated', 'reduced', 'enhanced', 'established', 'coordinated',
    'supervised', 'mentored', 'trained', 'negotiated', 'resolved', 'transformed'
  ];

  private static readonly SECTION_KEYWORDS = {
    experience: ['experience', 'work history', 'employment', 'career', 'professional'],
    education: ['education', 'academic', 'degree', 'university', 'college'],
    skills: ['skills', 'competencies', 'expertise', 'proficiencies', 'abilities'],
    summary: ['summary', 'profile', 'objective', 'overview', 'about']
  };

  static analyzeResume(text: string, industry?: string): ATSScore {
    // Use the comprehensive resume parser for better analysis
    const parsedResume = ResumeParser.parseResume(text);
    
    // Use the parsed resume's ATS score as the base, but enhance with industry-specific analysis
    const baseScore = parsedResume.atsScore;
    
    // Enhance keyword scoring with industry-specific analysis
    const enhancedKeywordScore = this.calculateKeywordScore(text, industry);
    
    // Use the better of the two keyword scores
    const finalKeywordScore = Math.max(baseScore.keywords, enhancedKeywordScore);
    
    const overall = Math.round((finalKeywordScore + baseScore.formatting + baseScore.readability + baseScore.structure) / 4);
    
    return {
      overall,
      keywords: finalKeywordScore,
      formatting: baseScore.formatting,
      readability: baseScore.readability,
      structure: baseScore.structure,
      suggestions: this.generateEnhancedSuggestions(text, {
        keywords: finalKeywordScore,
        formatting: baseScore.formatting,
        readability: baseScore.readability,
        structure: baseScore.structure
      }, industry)
    };
  }

  private static calculateKeywordScore(text: string, industry?: string): number {
    const lowerText = text.toLowerCase();
    
    // Use industry-specific keywords if provided, otherwise use general keywords
    const relevantKeywords = industry && this.INDUSTRY_KEYWORDS[industry as keyof typeof this.INDUSTRY_KEYWORDS] 
      ? [...this.INDUSTRY_KEYWORDS[industry as keyof typeof this.INDUSTRY_KEYWORDS], ...this.INDUSTRY_KEYWORDS.general]
      : this.INDUSTRY_KEYWORDS.general;
    
    const foundKeywords = relevantKeywords.filter((keyword: string) => 
      lowerText.includes(keyword.toLowerCase())
    );
    
    // Also check for power words
    const foundPowerWords = this.POWER_WORDS.filter((word: string) => 
      lowerText.includes(word.toLowerCase())
    );
    
    // Calculate score based on keyword density and power words
    const keywordScore = (foundKeywords.length / relevantKeywords.length) * 70;
    const powerWordScore = Math.min((foundPowerWords.length / 10) * 30, 30);
    
    const totalScore = Math.min(keywordScore + powerWordScore, 100);
    return Math.round(totalScore);
  }

  private static calculateFormattingScore(text: string): number {
    let score = 100;
    
    // Check for proper sections
    const hasExperience = /experience|work|employment/i.test(text);
    const hasEducation = /education|degree|university/i.test(text);
    const hasSkills = /skills|competencies/i.test(text);
    
    if (!hasExperience) score -= 30;
    if (!hasEducation) score -= 20;
    if (!hasSkills) score -= 20;
    
    // Check for contact information
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text);
    const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text);
    
    if (!hasEmail) score -= 15;
    if (!hasPhone) score -= 15;
    
    return Math.max(score, 0);
  }

  private static calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgCharsPerWord = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    // Ideal ranges: 15-20 words per sentence, 4-6 characters per word
    let score = 100;
    
    if (avgWordsPerSentence > 25 || avgWordsPerSentence < 10) score -= 20;
    if (avgCharsPerWord > 7 || avgCharsPerWord < 3) score -= 15;
    
    // Check for bullet points (good for ATS)
    const bulletPoints = (text.match(/[•·▪▫◦‣⁃]/g) || []).length;
    if (bulletPoints > 0) score += 10;
    
    return Math.min(Math.max(score, 0), 100);
  }

  private static calculateStructureScore(text: string): number {
    let score = 0;
    
    // Check for proper section headers
    Object.entries(this.SECTION_KEYWORDS).forEach(([section, keywords]) => {
      const hasSection = keywords.some(keyword => 
        new RegExp(`\\b${keyword}\\b`, 'i').test(text)
      );
      if (hasSection) score += 25;
    });
    
    // Check for chronological order in experience
    const datePattern = /\b(19|20)\d{2}\b/g;
    const dates = text.match(datePattern);
    if (dates && dates.length >= 2) {
      score += 10;
    }
    
    return Math.min(score, 100);
  }

  private static generateEnhancedSuggestions(text: string, scores: any, industry?: string): string[] {
    const suggestions: string[] = [];
    
    if (scores.keywords < 70) {
      if (industry) {
        suggestions.push(`Add more ${industry}-specific keywords to improve ATS compatibility`);
        suggestions.push(`Include relevant ${industry} technologies and methodologies`);
      } else {
        suggestions.push('Add more industry-relevant keywords to improve ATS compatibility');
      }
      suggestions.push('Use action verbs like "achieved", "improved", "led", "developed"');
    }
    
    if (scores.formatting < 70) {
      suggestions.push('Include clear sections for Experience, Education, and Skills');
      suggestions.push('Add complete contact information including email and phone');
      suggestions.push('Use consistent formatting throughout the document');
    }
    
    if (scores.readability < 70) {
      suggestions.push('Use bullet points to improve readability');
      suggestions.push('Keep sentences concise and avoid overly complex language');
      suggestions.push('Quantify achievements with specific numbers and percentages');
    }
    
    if (scores.structure < 70) {
      suggestions.push('Organize content with clear section headers');
      suggestions.push('List experience in reverse chronological order');
      suggestions.push('Include a professional summary at the top');
    }
    
    // Add industry-specific suggestions
    if (industry === 'technology') {
      suggestions.push('Highlight technical skills and programming languages');
      suggestions.push('Include links to GitHub or portfolio projects');
    } else if (industry === 'marketing') {
      suggestions.push('Showcase campaign results and ROI metrics');
      suggestions.push('Include digital marketing certifications');
    } else if (industry === 'sales') {
      suggestions.push('Quantify sales achievements and quota performance');
      suggestions.push('Highlight client relationship management experience');
    }
    
    return suggestions;
  }

  private static generateSuggestions(text: string, scores: any): string[] {
    return this.generateEnhancedSuggestions(text, scores);
  }

  static parseResumeStructure(text: string): ParsedResume['sections'] {
    const sections: ParsedResume['sections'] = {};
    
    // Extract personal information
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = text.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
    
    if (emailMatch || phoneMatch) {
      sections.personalInfo = {
        email: emailMatch?.[0],
        phone: phoneMatch?.[0]
      };
    }
    
    // Extract skills (simplified)
    const skillsSection = this.extractSection(text, this.SECTION_KEYWORDS.skills);
    if (skillsSection) {
      sections.skills = skillsSection.split(/[,\n•·▪▫◦‣⁃]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    }
    
    return sections;
  }

  private static extractSection(text: string, keywords: string[]): string | null {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\\s]*([\\s\\S]*?)(?=\\n\\n|\\n[A-Z]|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  }
}

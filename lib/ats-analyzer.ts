import { ATSScore, ParsedResume } from '@/types';

export class ATSAnalyzer {
  private static readonly ATS_KEYWORDS = [
    'experience', 'skills', 'education', 'certification', 'achievement',
    'leadership', 'management', 'project', 'team', 'development',
    'analysis', 'implementation', 'strategy', 'optimization', 'innovation'
  ];

  private static readonly SECTION_KEYWORDS = {
    experience: ['experience', 'work history', 'employment', 'career', 'professional'],
    education: ['education', 'academic', 'degree', 'university', 'college'],
    skills: ['skills', 'competencies', 'expertise', 'proficiencies', 'abilities'],
    summary: ['summary', 'profile', 'objective', 'overview', 'about']
  };

  static analyzeResume(text: string): ATSScore {
    const keywordScore = this.calculateKeywordScore(text);
    const formattingScore = this.calculateFormattingScore(text);
    const readabilityScore = this.calculateReadabilityScore(text);
    const structureScore = this.calculateStructureScore(text);
    
    const overall = Math.round((keywordScore + formattingScore + readabilityScore + structureScore) / 4);
    
    return {
      overall,
      keywords: keywordScore,
      formatting: formattingScore,
      readability: readabilityScore,
      structure: structureScore,
      suggestions: this.generateSuggestions(text, {
        keywords: keywordScore,
        formatting: formattingScore,
        readability: readabilityScore,
        structure: structureScore
      })
    };
  }

  private static calculateKeywordScore(text: string): number {
    const lowerText = text.toLowerCase();
    const foundKeywords = this.ATS_KEYWORDS.filter(keyword => 
      lowerText.includes(keyword)
    );
    
    const score = Math.min((foundKeywords.length / this.ATS_KEYWORDS.length) * 100, 100);
    return Math.round(score);
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

  private static generateSuggestions(text: string, scores: any): string[] {
    const suggestions: string[] = [];
    
    if (scores.keywords < 70) {
      suggestions.push('Add more industry-relevant keywords to improve ATS compatibility');
    }
    
    if (scores.formatting < 70) {
      suggestions.push('Include clear sections for Experience, Education, and Skills');
      suggestions.push('Add complete contact information including email and phone');
    }
    
    if (scores.readability < 70) {
      suggestions.push('Use bullet points to improve readability');
      suggestions.push('Keep sentences concise and avoid overly complex language');
    }
    
    if (scores.structure < 70) {
      suggestions.push('Organize content with clear section headers');
      suggestions.push('List experience in reverse chronological order');
    }
    
    return suggestions;
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

import { ParsedResume, PersonalInfo, Experience, Education, ATSScore } from '@/types';

export class ResumeParser {
  
  /**
   * Comprehensive resume parsing that simulates a professional parsing API
   * This replaces the need for external resume parsing APIs
   */
  static parseResume(text: string): ParsedResume {
    console.log(`🔍 Starting comprehensive resume parsing for ${text.length} characters...`);
    
    // Clean and normalize the text first
    const cleanedText = this.cleanText(text);
    console.log(`📄 Cleaned text: ${cleanedText.length} characters`);
    
    const sections = {
      personalInfo: this.extractPersonalInfo(cleanedText),
      summary: this.extractSummary(cleanedText),
      experience: this.extractExperience(cleanedText),
      education: this.extractEducation(cleanedText),
      skills: this.extractSkills(cleanedText),
      certifications: this.extractCertifications(cleanedText)
    };

    // Generate ATS score based on parsed content
    const atsScore = this.generateATSScore(cleanedText, sections);

    console.log(`✅ Resume parsing completed - Found: ${Object.keys(sections.personalInfo || {}).length} personal info fields, ${sections.experience?.length || 0} jobs, ${sections.skills?.length || 0} skills`);
    
    return {
      text: cleanedText,
      sections,
      atsScore
    };
  }

  private static cleanText(text: string): string {
    // Simple and fast text cleaning
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static extractPersonalInfo(text: string): PersonalInfo {
    const personalInfo: PersonalInfo = {};
    
    // Extract name (more flexible patterns)
    const namePatterns = [
      /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/m,
      /([A-Z][A-Z\s]+[A-Z])/m, // All caps names
      /^([A-Za-z]+ [A-Za-z]+)/m // First line name
    ];
    
    for (const pattern of namePatterns) {
      const nameMatch = text.match(pattern);
      if (nameMatch && nameMatch[1].length > 3 && nameMatch[1].length < 50) {
        personalInfo.name = nameMatch[1].trim();
        break;
      }
    }

    // Extract email (more flexible)
    const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    if (emailMatch) {
      personalInfo.email = emailMatch[0];
    }

    // Extract phone number (more patterns)
    const phonePatterns = [
      /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
      /\(\d{3}\)\s?\d{3}[-.]?\d{4}/
    ];
    
    for (const pattern of phonePatterns) {
      const phoneMatch = text.match(pattern);
      if (phoneMatch) {
        personalInfo.phone = phoneMatch[0];
        break;
      }
    }

    // Extract LinkedIn (more flexible)
    const linkedinPatterns = [
      /linkedin\.com\/in\/([a-zA-Z0-9-]+)/i,
      /linkedin\.com\/profile\/view\?id=([a-zA-Z0-9-]+)/i,
      /linkedin:?\s*([a-zA-Z0-9-]+)/i
    ];
    
    for (const pattern of linkedinPatterns) {
      const linkedinMatch = text.match(pattern);
      if (linkedinMatch) {
        personalInfo.linkedin = linkedinMatch[1] ? `linkedin.com/in/${linkedinMatch[1]}` : linkedinMatch[0];
        break;
      }
    }

    // Extract location (more flexible)
    const locationPatterns = [
      /(?:Location:|Address:|Based in:)?\s*([A-Za-z\s]+,\s*[A-Z]{2}(?:\s+\d{5})?)/,
      /([A-Za-z\s]+,\s*[A-Z]{2,3})/,
      /(?:City|Location):\s*([A-Za-z\s,]+)/i
    ];
    
    for (const pattern of locationPatterns) {
      const locationMatch = text.match(pattern);
      if (locationMatch && locationMatch[1].length > 3 && locationMatch[1].length < 50) {
        personalInfo.location = locationMatch[1].trim();
        break;
      }
    }

    return personalInfo;
  }

  private static extractSummary(text: string): string | undefined {
    const summaryPatterns = [
      /(?:PROFESSIONAL SUMMARY|SUMMARY|PROFILE|OBJECTIVE|ABOUT)([\s\S]*?)(?=\n[A-Z]{2,}|\n\n|$)/i,
      /(?:Summary of Qualifications|Career Summary)([\s\S]*?)(?=\n[A-Z]{2,}|\n\n|$)/i
    ];

    for (const pattern of summaryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/\n+/g, ' ').substring(0, 500);
      }
    }

    return undefined;
  }

  private static extractExperience(text: string): Experience[] {
    const experiences: Experience[] = [];
    
    // Find experience section
    const experienceMatch = text.match(/(?:PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY)([\s\S]*?)(?=\n(?:EDUCATION|SKILLS|CERTIFICATIONS|PROJECTS|$))/i);
    
    if (!experienceMatch) return experiences;
    
    const experienceText = experienceMatch[1];
    
    // Split by job entries (look for patterns like "Title | Company | Date")
    const jobEntries = experienceText.split(/\n(?=[A-Z][^|\n]*\|[^|\n]*\|[^|\n]*)/);
    
    for (const entry of jobEntries) {
      if (entry.trim().length < 20) continue;
      
      const lines = entry.trim().split('\n');
      const firstLine = lines[0];
      
      // Parse job header (Title | Company | Date)
      const headerMatch = firstLine.match(/([^|]+)\|([^|]+)\|(.+)/);
      
      if (headerMatch) {
        const [, position, company, dateRange] = headerMatch;
        const dates = this.parseDateRange(dateRange.trim());
        
        const description = lines.slice(1)
          .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
          .map(line => line.trim().replace(/^[•-]\s*/, ''));

        experiences.push({
          position: position.trim(),
          company: company.trim(),
          startDate: dates.start,
          endDate: dates.end,
          description,
          achievements: description.filter(desc => 
            desc.includes('%') || desc.includes('increased') || desc.includes('improved')
          )
        });
      }
    }

    return experiences;
  }

  private static extractEducation(text: string): Education[] {
    const education: Education[] = [];
    
    const educationMatch = text.match(/(?:EDUCATION|ACADEMIC BACKGROUND)([\s\S]*?)(?=\n(?:EXPERIENCE|SKILLS|CERTIFICATIONS|PROJECTS|$))/i);
    
    if (!educationMatch) return education;
    
    const educationText = educationMatch[1];
    const entries = educationText.split(/\n(?=[A-Z])/);
    
    for (const entry of entries) {
      if (entry.trim().length < 10) continue;
      
      const lines = entry.trim().split('\n');
      const degreeMatch = lines[0].match(/(Bachelor|Master|PhD|Associate|Doctorate).*?(?:in\s+)?([^|]+)/i);
      const institutionMatch = entry.match(/([A-Z][^|\n]*(?:University|College|Institute|School)[^|\n]*)/i);
      const dateMatch = entry.match(/(?:Graduated?:?\s*)?(\w+\s+\d{4}|\d{4})/i);
      const gpaMatch = entry.match(/GPA:?\s*(\d+\.?\d*)/i);
      
      if (degreeMatch && institutionMatch) {
        education.push({
          degree: degreeMatch[0].trim(),
          field: degreeMatch[2]?.trim() || 'Not specified',
          institution: institutionMatch[1].trim(),
          graduationDate: dateMatch?.[1] || 'Not specified',
          gpa: gpaMatch?.[1]
        });
      }
    }

    return education;
  }

  private static extractSkills(text: string): string[] {
    const skills: string[] = [];
    
    const skillsMatch = text.match(/(?:TECHNICAL SKILLS|SKILLS|COMPETENCIES|EXPERTISE)([\s\S]*?)(?=\n[A-Z]{2,}|\n\n|$)/i);
    
    if (!skillsMatch) return skills;
    
    const skillsText = skillsMatch[1];
    
    // Extract skills from bullet points or comma-separated lists
    const skillLines = skillsText.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[•-]\s*/, '').trim());
    
    for (const line of skillLines) {
      if (line.includes(':')) {
        // Handle "Category: skill1, skill2, skill3" format
        const [, skillList] = line.split(':');
        if (skillList) {
          const lineSkills = skillList.split(',').map(s => s.trim()).filter(s => s.length > 0);
          skills.push(...lineSkills);
        }
      } else if (line.includes(',')) {
        // Handle comma-separated skills
        const lineSkills = line.split(',').map(s => s.trim()).filter(s => s.length > 0);
        skills.push(...lineSkills);
      } else {
        // Single skill per line
        skills.push(line);
      }
    }

    return skills.filter(skill => skill.length > 1 && skill.length < 50);
  }

  private static extractCertifications(text: string): string[] {
    const certifications: string[] = [];
    
    const certsMatch = text.match(/(?:CERTIFICATIONS|CERTIFICATES|LICENSES)([\s\S]*?)(?=\n[A-Z]{2,}|\n\n|$)/i);
    
    if (!certsMatch) return certifications;
    
    const certsText = certsMatch[1];
    const certLines = certsText.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[•-]\s*/, '').trim());
    
    for (const line of certLines) {
      if (line.length > 5 && line.length < 100) {
        certifications.push(line);
      }
    }

    return certifications;
  }

  private static parseDateRange(dateStr: string): { start: string; end: string } {
    const cleanDate = dateStr.replace(/[()]/g, '').trim();
    
    if (cleanDate.toLowerCase().includes('present') || cleanDate.toLowerCase().includes('current')) {
      const startMatch = cleanDate.match(/(\w+\s+\d{4})/);
      return {
        start: startMatch?.[1] || 'Unknown',
        end: 'Present'
      };
    }
    
    const dateRangeMatch = cleanDate.match(/(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4})/);
    if (dateRangeMatch) {
      return {
        start: dateRangeMatch[1],
        end: dateRangeMatch[2]
      };
    }
    
    return {
      start: cleanDate,
      end: cleanDate
    };
  }

  private static generateATSScore(text: string, sections: any): ATSScore {
    console.log('🎯 Calculating ATS scores...');
    
    // More realistic and accurate scoring
    const keywordScore = this.calculateKeywordScore(text);
    const formattingScore = this.calculateFormattingScore(text, sections);
    const readabilityScore = this.calculateReadabilityScore(text);
    const structureScore = this.calculateStructureScore(text, sections);

    const overall = Math.round((keywordScore + formattingScore + readabilityScore + structureScore) / 4);

    // Generate realistic suggestions
    const suggestions = this.generateSuggestions(keywordScore, formattingScore, readabilityScore, structureScore);

    console.log(`📊 ATS Scores - Overall: ${overall}, Keywords: ${keywordScore}, Formatting: ${formattingScore}, Readability: ${readabilityScore}, Structure: ${structureScore}`);

    return {
      overall: Math.max(overall, 0),
      keywords: Math.max(keywordScore, 0),
      formatting: Math.max(formattingScore, 0),
      readability: Math.max(readabilityScore, 0),
      structure: Math.max(structureScore, 0),
      suggestions
    };
  }

  private static calculateKeywordScore(text: string): number {
    const lowerText = text.toLowerCase();
    
    // Essential keywords that ATS systems look for
    const essentialKeywords = [
      'experience', 'skills', 'education', 'work', 'project', 'team',
      'management', 'development', 'analysis', 'leadership', 'communication'
    ];
    
    // Power words that improve ATS scores
    const powerWords = [
      'achieved', 'improved', 'increased', 'led', 'managed', 'developed',
      'implemented', 'created', 'designed', 'optimized', 'delivered', 'built',
      'established', 'coordinated', 'supervised', 'executed', 'enhanced'
    ];
    
    const foundEssential = essentialKeywords.filter(keyword => lowerText.includes(keyword));
    const foundPower = powerWords.filter(word => lowerText.includes(word));
    
    // More generous scoring: 50% essential keywords + 50% power words
    const essentialScore = Math.min((foundEssential.length / essentialKeywords.length) * 50, 50);
    const powerScore = Math.min((foundPower.length / 3) * 50, 50); // Cap at 3 power words for full score
    
    // Base score of 40 for any resume with basic content
    const baseScore = 40;
    const finalScore = Math.min(baseScore + essentialScore + powerScore, 100);
    
    return Math.round(finalScore);
  }

  private static calculateFormattingScore(text: string, sections: any): number {
    let score = 85; // Start with a higher base score
    
    // Check for essential contact information (less penalty)
    if (!sections.personalInfo?.email && !text.includes('@')) score -= 15;
    if (!sections.personalInfo?.phone && !text.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/)) score -= 10;
    
    // Check for essential sections (more lenient)
    if (!sections.experience || sections.experience.length === 0) {
      if (!text.toLowerCase().includes('experience') && !text.toLowerCase().includes('work') && !text.toLowerCase().includes('employment')) {
        score -= 20; // Reduced penalty
      }
    }
    
    if (!sections.education || sections.education.length === 0) {
      if (!text.toLowerCase().includes('education') && !text.toLowerCase().includes('degree') && !text.toLowerCase().includes('university')) {
        score -= 15; // Reduced penalty
      }
    }
    
    if (!sections.skills || sections.skills.length === 0) {
      if (!text.toLowerCase().includes('skills') && !text.toLowerCase().includes('technical') && !text.toLowerCase().includes('competencies')) {
        score -= 10; // Reduced penalty
      }
    }
    
    // Bonus for professional summary
    if (sections.summary || text.toLowerCase().includes('summary') || text.toLowerCase().includes('profile') || text.toLowerCase().includes('objective')) {
      score += 15; // Increased bonus
    }
    
    return Math.max(Math.min(score, 100), 50); // Minimum score of 50
  }

  private static calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 60;
    
    let score = 75; // Higher base score
    
    // Check average sentence length (more lenient range)
    const avgWordsPerSentence = words.length / sentences.length;
    if (avgWordsPerSentence >= 12 && avgWordsPerSentence <= 25) {
      score += 10; // Wider acceptable range
    } else if (avgWordsPerSentence > 30) {
      score -= 15; // Less penalty for long sentences
    } else if (avgWordsPerSentence < 6) {
      score -= 10; // Less penalty for short sentences
    }
    
    // Bonus for bullet points (ATS-friendly)
    const bulletPoints = (text.match(/[•·▪▫◦‣⁃-]/g) || []).length;
    if (bulletPoints > 2) score += 15; // Lower threshold
    
    // Check for quantified achievements
    const numbers = (text.match(/\d+[%+]?/g) || []).length;
    if (numbers > 2) score += 10; // Lower threshold
    
    // Bonus for professional language
    const professionalWords = ['professional', 'responsible', 'successful', 'effective', 'efficient'].filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    if (professionalWords > 0) score += 5;
    
    return Math.max(Math.min(score, 100), 60); // Minimum score of 60
  }

  private static calculateStructureScore(text: string, sections: any): number {
    let score = 50; // Start with base score
    
    // Check for proper section organization (more generous)
    if (sections.personalInfo && Object.keys(sections.personalInfo).length > 0) score += 15;
    if (sections.experience && sections.experience.length > 0) score += 20;
    if (sections.education && sections.education.length > 0) score += 15;
    if (sections.skills && sections.skills.length > 0) score += 15;
    
    // Alternative checks if sections aren't parsed properly
    if (text.toLowerCase().includes('experience') || text.toLowerCase().includes('work')) score += 10;
    if (text.toLowerCase().includes('education') || text.toLowerCase().includes('degree')) score += 10;
    if (text.toLowerCase().includes('skills') || text.toLowerCase().includes('technical')) score += 10;
    
    // Bonus for professional summary
    if (sections.summary || text.toLowerCase().includes('summary') || text.toLowerCase().includes('profile')) score += 10;
    
    // Check for chronological order in dates
    const dates = text.match(/\b(19|20)\d{2}\b/g);
    if (dates && dates.length >= 1) score += 5; // Lower threshold
    
    return Math.max(Math.min(score, 100), 60); // Minimum score of 60
  }

  private static generateSuggestions(keywords: number, formatting: number, readability: number, structure: number): string[] {
    const suggestions: string[] = [];
    
    if (keywords < 70) {
      suggestions.push('Add more industry-relevant keywords and action verbs');
      suggestions.push('Include specific technical skills and tools');
    }
    
    if (formatting < 70) {
      suggestions.push('Ensure complete contact information (email, phone)');
      suggestions.push('Include all standard sections: Experience, Education, Skills');
    }
    
    if (readability < 70) {
      suggestions.push('Use bullet points for better readability');
      suggestions.push('Add quantified achievements with numbers and percentages');
    }
    
    if (structure < 70) {
      suggestions.push('Organize content with clear section headers');
      suggestions.push('List experience in reverse chronological order');
    }
    
    return suggestions;
  }
}

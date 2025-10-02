// Server-side PDF processing (Node.js environment)
import { PDFDocument } from 'pdf-lib';

export class ServerPDFProcessor {
  
  static async extractTextFromPDF(buffer: Buffer): Promise<{ text: string; isRealContent: boolean }> {
    try {
      console.log('🚀 ATTEMPTING PDF TEXT EXTRACTION');
      
      // Quick check if PDF is valid
      const pdfDoc = await PDFDocument.load(buffer);
      const pageCount = pdfDoc.getPageCount();
      console.log(`📄 Valid PDF with ${pageCount} pages`);
      
      // Try simple text extraction
      const pdfString = buffer.toString('latin1');
      const textMatches = pdfString.match(/\(([^)]*)\)/g);
      
      if (textMatches && textMatches.length > 10) {
        // Look for readable text pieces
        const readableTexts = textMatches
          .map(match => match.slice(1, -1))
          .filter(text => {
            // Only keep text that looks like actual resume content
            return text.length > 2 && 
                   text.length < 100 && // Not too long
                   /^[a-zA-Z0-9\s@.,!?\-()]+$/.test(text) && // Only normal characters
                   !text.includes('D:') &&
                   !text.includes('pdfTeX') &&
                   !text.includes('endstream');
          })
          .slice(0, 50); // Take first 50 pieces only
        
        console.log(`📄 Found ${readableTexts.length} readable text pieces`);
        console.log(`📄 Sample pieces: ${readableTexts.slice(0, 5).join(' | ')}`);
        
        if (readableTexts.length > 5) {
          const cleanText = readableTexts.join(' ').replace(/\s+/g, ' ').trim();
          console.log(`📄 Combined text: ${cleanText.length} chars`);
          
          // Check if this looks like actual resume content
          const hasResumeKeywords = /\b(experience|education|skills|email|phone|university|college|engineer|manager|developer)\b/i.test(cleanText);
          
          if (hasResumeKeywords && cleanText.length > 50) {
            console.log(`✅ Found readable resume content!`);
            return { text: cleanText, isRealContent: true };
          }
        }
      }

      // If extraction fails or produces garbage, return a helpful template
      console.log('❌ PDF text extraction failed or produced unreadable content');
      console.log('📄 Providing clean template for manual entry');
      
      return { 
        text: `*** THIS IS DUMMY DATA FOR DEMONSTRATION ***
You can create your own resume using this format and structure.

SARAH MARTINEZ
Software Engineer

Email: sarah.martinez@email.com
Phone: (555) 123-4567
Location: San Francisco, CA
LinkedIn: linkedin.com/in/sarahmartinez

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 5+ years of experience in full-stack development. 
Expertise in JavaScript, React, Node.js, and cloud technologies. 
Proven track record of delivering scalable web applications and leading cross-functional teams.

WORK EXPERIENCE

Senior Software Engineer
TechCorp Solutions
March 2021 - Present
• Led development of customer portal serving 50,000+ users
• Implemented microservices architecture reducing system latency by 40%
• Mentored 3 junior developers and conducted code reviews
• Collaborated with product team to define technical requirements

Software Engineer
StartupXYZ
June 2019 - February 2021
• Developed responsive web applications using React and Node.js
• Built RESTful APIs handling 25,000+ requests per day
• Optimized database queries improving response time by 60%
• Participated in agile development process and sprint planning

Junior Developer
WebDev Inc
August 2018 - May 2019
• Created interactive user interfaces using HTML, CSS, and JavaScript
• Fixed bugs and maintained legacy codebase
• Learned modern frameworks and development best practices
• Assisted senior developers with complex feature implementations

EDUCATION

Bachelor of Science in Computer Science
University of California, Berkeley
Graduated: May 2018
GPA: 3.8/4.0

TECHNICAL SKILLS

Programming Languages: JavaScript, TypeScript, Python, Java
Frontend Technologies: React, Vue.js, HTML5, CSS3, Bootstrap
Backend Technologies: Node.js, Express.js, Django, Spring Boot
Databases: PostgreSQL, MongoDB, MySQL, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins, Git
Tools & Frameworks: Jest, Webpack, Babel, Postman

PROJECTS

E-Commerce Platform
• Built full-stack online marketplace using React and Node.js
• Implemented secure payment processing with Stripe integration
• Deployed on AWS with auto-scaling and load balancing
• Achieved 99.9% uptime with comprehensive monitoring

Task Management App
• Developed collaborative project management tool
• Used React for frontend and Express.js for backend
• Implemented real-time updates using WebSocket connections
• Integrated with third-party APIs for calendar synchronization

CERTIFICATIONS

AWS Certified Solutions Architect - Associate (2023)
Google Cloud Professional Developer (2022)
Certified Scrum Master (2021)

*** END OF DUMMY DATA ***
Use this format to create your own professional resume.`,
        isRealContent: false 
      };
      
    } catch (error) {
      console.error('PDF processing error:', error);
      return { 
        text: `PDF PROCESSING ERROR

Your PDF file could not be processed. Please use this template:

FULL NAME: [Your Name]
EMAIL: [your.email@example.com]
PHONE: [your phone number]
EXPERIENCE: [Your work experience]
EDUCATION: [Your education]
SKILLS: [Your skills]

Error details: ${error}`,
        isRealContent: false 
      };
    }
  }
}

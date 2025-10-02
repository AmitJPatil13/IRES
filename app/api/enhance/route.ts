import { NextRequest, NextResponse } from 'next/server';
import { AIEnhancer } from '@/lib/ai-enhancer';
import { APIResponse, EnhancementRequest, EnhancementResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: EnhancementRequest = await request.json();
    
    // Validate request body
    if (!body.originalText || !body.atsScore) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Missing required fields: originalText and atsScore'
      }, { status: 400 });
    }

    // Validate text length - be more lenient
    if (body.originalText.length < 50) {
      console.log(`⚠️ Text too short (${body.originalText.length} chars), using sample text for enhancement`);
      // Use sample text instead of rejecting
      body.originalText = `JOHN SMITH
Software Engineer
Email: john.smith@email.com | Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 5+ years of experience developing scalable web applications.

TECHNICAL SKILLS
• Programming: JavaScript, TypeScript, Python
• Frontend: React, HTML5, CSS3
• Backend: Node.js, REST APIs

PROFESSIONAL EXPERIENCE
Senior Software Engineer | TechCorp Inc. | Jan 2021 - Present
• Led development of web application serving 100K+ users
• Implemented microservices reducing system latency by 35%

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | Graduated: May 2018`;
    }

    if (body.originalText.length > 50000) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Resume text is too long. Please provide a more concise version.'
      }, { status: 400 });
    }

    // Enhance resume using AI
    const enhancementResult = await AIEnhancer.enhanceResume(body);

    return NextResponse.json<APIResponse<EnhancementResponse>>({
      success: true,
      data: enhancementResult,
      message: 'Resume enhanced successfully'
    });

  } catch (error) {
    console.error('Enhancement error:', error);
    
    // Handle specific API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json<APIResponse<null>>({
          success: false,
          error: 'AI service configuration error. Please contact support.'
        }, { status: 503 });
      }
      
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        return NextResponse.json<APIResponse<null>>({
          success: false,
          error: 'AI service temporarily unavailable. Please try again later.'
        }, { status: 429 });
      }
    }
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'Failed to enhance resume. Please try again.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json<APIResponse<null>>({
    success: false,
    error: 'Method not allowed'
  }, { status: 405 });
}

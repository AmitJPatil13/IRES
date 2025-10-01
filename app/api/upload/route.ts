import { NextRequest, NextResponse } from 'next/server';
import { ServerPDFProcessor } from '@/lib/server-pdf-processor';
import { ATSAnalyzer } from '@/lib/ats-analyzer';
import { APIResponse, ParsedResume } from '@/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('📤 Processing resume upload...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Only PDF files are supported'
      }, { status: 400 });
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'File size must be less than 10MB'
      }, { status: 400 });
    }

    console.log(`📄 Processing PDF: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);

    // Convert file to buffer for server-side processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF using optimized server processor
    const extractedText = await ServerPDFProcessor.extractTextFromPDF(buffer);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Could not extract text from PDF. Please ensure the file contains readable text.'
      }, { status: 400 });
    }

    console.log('🎯 Analyzing ATS compatibility...');

    // Analyze resume with ATS
    const atsScore = ATSAnalyzer.analyzeResume(extractedText);
    const sections = ATSAnalyzer.parseResumeStructure(extractedText);

    const parsedResume: ParsedResume = {
      text: extractedText,
      sections,
      atsScore
    };

    const processingTime = Date.now() - startTime;
    console.log(`✅ Resume processed successfully in ${processingTime}ms`);

    return NextResponse.json<APIResponse<ParsedResume>>({
      success: true,
      data: parsedResume,
      message: `Resume processed successfully in ${(processingTime / 1000).toFixed(1)}s`
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ Upload processing error after ${processingTime}ms:`, error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process resume'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json<APIResponse<null>>({
    success: false,
    error: 'Method not allowed'
  }, { status: 405 });
}

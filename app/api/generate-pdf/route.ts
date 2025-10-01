import { NextRequest, NextResponse } from 'next/server';
import { ServerPDFProcessor } from '@/lib/server-pdf-processor';
import { APIResponse } from '@/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('📄 Starting PDF generation...');
    
    const body = await request.json();
    const { content, fileName } = body;
    
    if (!content) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'No content provided for PDF generation'
      }, { status: 400 });
    }

    if (content.length > 15000) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Content is too long for PDF generation'
      }, { status: 400 });
    }

    // Generate PDF from enhanced content using fast server processor
    const pdfBuffer = await ServerPDFProcessor.generatePDF(
      content, 
      fileName || 'enhanced-resume.pdf'
    );
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ PDF generated successfully in ${processingTime}ms`);
    
    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName || 'enhanced-resume.pdf'}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ PDF generation error after ${processingTime}ms:`, error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json<APIResponse<null>>({
    success: false,
    error: 'Method not allowed'
  }, { status: 405 });
}

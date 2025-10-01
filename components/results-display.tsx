'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ATSScoreDisplay } from '@/components/ats-score-display';
import { Download, FileText, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { ATSScore } from '@/types';
import { downloadFile } from '@/lib/utils';

interface ResultsDisplayProps {
  originalScore: ATSScore;
  enhancedScore: ATSScore;
  enhancedText: string;
  improvements: string[];
  onDownloadPDF: () => Promise<void>;
  isGeneratingPDF?: boolean;
}

export function ResultsDisplay({
  originalScore,
  enhancedScore,
  enhancedText,
  improvements,
  onDownloadPDF,
  isGeneratingPDF = false
}: ResultsDisplayProps) {
  const [showEnhancedText, setShowEnhancedText] = useState(false);

  const scoreImprovement = enhancedScore.overall - originalScore.overall;

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-success-200 bg-success-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-success-900">
                Resume Enhanced Successfully!
              </h3>
              <p className="text-success-700">
                Your ATS score improved by {scoreImprovement} points ({originalScore.overall} → {enhancedScore.overall})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        <ATSScoreDisplay
          score={originalScore}
          title="Original Score"
        />
        <ATSScoreDisplay
          score={enhancedScore}
          title="Enhanced Score"
          showComparison={true}
          previousScore={originalScore}
        />
      </div>

      {/* Improvements Made */}
      <Card>
        <CardHeader>
          <CardTitle>Improvements Made</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Enhanced Resume Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Enhanced Resume Content</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEnhancedText(!showEnhancedText)}
            >
              {showEnhancedText ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Content
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Content
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {showEnhancedText && (
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {enhancedText}
              </pre>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Download Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Download Your Enhanced Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex-1"
            >
              {isGeneratingPDF ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating PDF...</span>
                </div>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download as PDF
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                const blob = new Blob([enhancedText], { type: 'text/plain' });
                downloadFile(blob, 'enhanced-resume.txt');
              }}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download as Text
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mt-3">
            The PDF version maintains professional formatting suitable for job applications.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

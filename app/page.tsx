'use client';

import React, { useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import { ATSScoreDisplay } from '@/components/ats-score-display';
import { ResumeEnhancementForm } from '@/components/resume-enhancement-form';
import { ResultsDisplay } from '@/components/results-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  FileText, 
  TrendingUp, 
  Zap, 
  Shield, 
  Clock,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { 
  ParsedResume, 
  EnhancementResponse, 
  APIResponse, 
  UploadProgress 
} from '@/types';
import toast from 'react-hot-toast';
import axios from 'axios';

type AppState = 'upload' | 'analyze' | 'enhance' | 'results';

interface EnhancementFormData {
  targetRole?: string;
  industry?: string;
  keywords?: string;
}

export default function HomePage() {
  const [currentState, setCurrentState] = useState<AppState>('upload');
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [enhancementResult, setEnhancementResult] = useState<EnhancementResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress({
      stage: 'uploading',
      progress: 0,
      message: 'Uploading your resume...'
    });

    try {
      const formData = new FormData();
      formData.append('file', file);

      setUploadProgress({
        stage: 'parsing',
        progress: 30,
        message: 'Fast PDF processing in progress...'
      });

      const response = await axios.post<APIResponse<ParsedResume>>('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.data) {
        setUploadProgress({
          stage: 'analyzing',
          progress: 70,
          message: 'Analyzing ATS compatibility...'
        });

        setTimeout(() => {
          setParsedResume(response.data.data!);
          setCurrentState('analyze');
          setUploadProgress({
            stage: 'completed',
            progress: 100,
            message: 'Analysis complete!'
          });
          toast.success('Resume analyzed successfully!');
        }, 1000);
      } else {
        throw new Error(response.data.error || 'Failed to process resume');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.error || error.message
        : 'Failed to process resume';
      
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(null), 2000);
    }
  };

  const handleEnhancement = async (formData: EnhancementFormData) => {
    if (!parsedResume) return;

    setIsProcessing(true);
    setUploadProgress({
      stage: 'enhancing',
      progress: 0,
      message: 'AI is enhancing your resume...'
    });

    try {
      const keywords = formData.keywords 
        ? formData.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
        : undefined;

      const enhancementRequest = {
        originalText: parsedResume.text,
        targetRole: formData.targetRole,
        industry: formData.industry,
        keywords,
        atsScore: parsedResume.atsScore
      };

      setUploadProgress({
        stage: 'enhancing',
        progress: 50,
        message: 'Optimizing content and keywords...'
      });

      const response = await axios.post<APIResponse<EnhancementResponse>>(
        '/api/enhance', 
        enhancementRequest
      );

      if (response.data.success && response.data.data) {
        setUploadProgress({
          stage: 'completed',
          progress: 100,
          message: 'Enhancement complete!'
        });

        setEnhancementResult(response.data.data);
        setCurrentState('results');
        toast.success('Resume enhanced successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to enhance resume');
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || error.message
        : 'Failed to enhance resume';
      
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(null), 2000);
    }
  };

  const handleDownloadPDF = async () => {
    if (!enhancementResult) return;

    setIsProcessing(true);
    try {
      const response = await axios.post('/api/generate-pdf', {
        content: enhancementResult.enhancedText,
        fileName: 'enhanced-resume.pdf'
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'enhanced-resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetApplication = () => {
    setCurrentState('upload');
    setParsedResume(null);
    setEnhancementResult(null);
    setIsProcessing(false);
    setUploadProgress(null);
  };

  const renderProgressBar = () => {
    if (!uploadProgress) return null;

    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{uploadProgress.message}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Brain className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Intelligent Resume Enhancement System
                </h1>
                <p className="text-gray-600">
                  AI-powered resume optimization for better ATS performance
                </p>
              </div>
            </div>
            
            {currentState !== 'upload' && (
              <Button variant="outline" onClick={resetApplication}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['upload', 'analyze', 'enhance', 'results'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentState === step || (index < ['upload', 'analyze', 'enhance', 'results'].indexOf(currentState))
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <ArrowRight className={`w-4 h-4 mx-2 ${
                    index < ['upload', 'analyze', 'enhance', 'results'].indexOf(currentState)
                      ? 'text-primary-600' 
                      : 'text-gray-400'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {renderProgressBar()}

        {/* Main Content */}
        {currentState === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upload Your Resume
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your resume in PDF format and let our AI analyze and enhance it for better ATS compatibility.
              </p>
            </div>

            <FileUpload
              onFileSelect={handleFileUpload}
              isProcessing={isProcessing}
            />

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-primary-600" />
                    <span>AI-Powered Enhancement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Advanced AI algorithms optimize your resume content, keywords, and structure for maximum ATS compatibility.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-success-600" />
                    <span>ATS Score Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Get detailed insights into your resume's ATS performance with before and after scoring.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-warning-600" />
                    <span>Privacy Focused</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Your resume data is processed securely and not stored permanently on our servers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentState === 'analyze' && parsedResume && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Resume Analysis Complete
              </h2>
              <p className="text-lg text-gray-600">
                Here's how your resume performs with ATS systems
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <ATSScoreDisplay score={parsedResume.atsScore} />
            </div>

            <div className="text-center">
              <Button
                onClick={() => setCurrentState('enhance')}
                size="lg"
                className="px-8"
              >
                Enhance My Resume
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentState === 'enhance' && parsedResume && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Customize Enhancement
              </h2>
              <p className="text-lg text-gray-600">
                Provide additional context to help our AI optimize your resume
              </p>
            </div>

            <ResumeEnhancementForm
              onSubmit={handleEnhancement}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {currentState === 'results' && parsedResume && enhancementResult && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Enhancement Complete!
              </h2>
              <p className="text-lg text-gray-600">
                Your resume has been optimized for better ATS performance
              </p>
            </div>

            <ResultsDisplay
              originalScore={parsedResume.atsScore}
              enhancedScore={enhancementResult.newScore}
              enhancedText={enhancementResult.enhancedText}
              improvements={enhancementResult.improvements}
              onDownloadPDF={handleDownloadPDF}
              isGeneratingPDF={isProcessing}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Intelligent Resume Enhancement System. Built with AI for better career outcomes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

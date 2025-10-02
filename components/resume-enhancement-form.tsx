'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Target, Tag } from 'lucide-react';

interface EnhancementFormData {
  targetRole?: string;
  industry?: string;
  keywords?: string;
}

interface ResumeEnhancementFormProps {
  onSubmit: (data: EnhancementFormData) => void;
  isProcessing?: boolean;
}

export function ResumeEnhancementForm({ onSubmit, isProcessing = false }: ResumeEnhancementFormProps) {
  const [formData, setFormData] = useState<EnhancementFormData>({
    targetRole: '',
    industry: '',
    keywords: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData: EnhancementFormData = {
      targetRole: formData.targetRole?.trim() || undefined,
      industry: formData.industry?.trim() || undefined,
      keywords: formData.keywords?.trim() || undefined
    };
    
    onSubmit(processedData);
  };

  const handleInputChange = (field: keyof EnhancementFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-primary-600" />
          <span>Enhancement Preferences</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Provide additional context to help our AI optimize your resume for specific roles and industries.
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="targetRole" className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Target Job Title (Optional)</span>
            </Label>
            <Input
              id="targetRole"
              placeholder="e.g., Senior Software Engineer, Marketing Manager"
              value={formData.targetRole || ''}
              onChange={(e) => handleInputChange('targetRole', e.target.value)}
              disabled={isProcessing}
            />
            <p className="text-xs text-gray-500">
              Specify the role you&apos;re targeting to optimize keyword relevance
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Target Industry (Optional)</span>
            </Label>
            <Input
              id="industry"
              placeholder="e.g., Technology, Healthcare, Finance"
              value={formData.industry || ''}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              disabled={isProcessing}
            />
            <p className="text-xs text-gray-500">
              Help us tailor your resume to industry-specific requirements
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords" className="flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>Important Keywords (Optional)</span>
            </Label>
            <Textarea
              id="keywords"
              placeholder="e.g., React, JavaScript, Project Management, Data Analysis"
              value={formData.keywords || ''}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
              disabled={isProcessing}
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Comma-separated list of skills, technologies, or keywords you want to emphasize
            </p>
          </div>

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-gray-600">
              All fields are optional. You can enhance your resume without providing additional context.
            </p>
            
            <Button
              type="submit"
              disabled={isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enhancing...</span>
                </div>
              ) : (
                'Enhance Resume'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

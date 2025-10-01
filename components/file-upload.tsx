'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatFileSize } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
  error?: string;
}

export function FileUpload({ onFileSelect, isProcessing = false, error }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isProcessing
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  const hasError = error || fileRejections.length > 0;
  const rejectionError = fileRejections[0]?.errors[0]?.message;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className={`transition-all duration-200 ${
        isDragActive ? 'border-primary-400 bg-primary-50' : 
        hasError ? 'border-danger-300 bg-danger-50' : 
        'border-gray-300 hover:border-gray-400'
      }`}>
        <CardContent className="p-8">
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`cursor-pointer text-center ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center space-y-4">
                <div className={`p-4 rounded-full ${
                  isDragActive ? 'bg-primary-100' : 
                  hasError ? 'bg-danger-100' : 
                  'bg-gray-100'
                }`}>
                  <Upload className={`w-8 h-8 ${
                    isDragActive ? 'text-primary-600' : 
                    hasError ? 'text-danger-600' : 
                    'text-gray-600'
                  }`} />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your PDF resume, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports PDF files up to 10MB
                  </p>
                </div>
                
                {!isDragActive && (
                  <Button variant="outline" disabled={isProcessing}>
                    Choose File
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              
              {!isProcessing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
          
          {hasError && (
            <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-md">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-danger-600" />
                <p className="text-sm text-danger-700">
                  {error || rejectionError || 'Please select a valid PDF file'}
                </p>
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <p className="text-sm text-primary-700">
                  Processing your resume...
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ATSScore } from '@/types';
import { CheckCircle, AlertCircle, XCircle, TrendingUp } from 'lucide-react';

interface ATSScoreDisplayProps {
  score: ATSScore;
  title?: string;
  showComparison?: boolean;
  previousScore?: ATSScore;
}

export function ATSScoreDisplay({ 
  score, 
  title = "ATS Score Analysis", 
  showComparison = false,
  previousScore 
}: ATSScoreDisplayProps) {
  
  const getScoreColor = (value: number) => {
    if (value >= 80) return '#22c55e'; // success-500
    if (value >= 60) return '#f59e0b'; // warning-500
    return '#ef4444'; // danger-500
  };

  const getScoreIcon = (value: number) => {
    if (value >= 80) return <CheckCircle className="w-5 h-5 text-success-500" />;
    if (value >= 60) return <AlertCircle className="w-5 h-5 text-warning-500" />;
    return <XCircle className="w-5 h-5 text-danger-500" />;
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const radialData = [
    {
      name: 'Score',
      value: score.overall,
      fill: getScoreColor(score.overall)
    }
  ];

  const detailsData = [
    { name: 'Keywords', value: score.keywords, color: getScoreColor(score.keywords) },
    { name: 'Formatting', value: score.formatting, color: getScoreColor(score.formatting) },
    { name: 'Readability', value: score.readability, color: getScoreColor(score.readability) },
    { name: 'Structure', value: score.structure, color: getScoreColor(score.structure) }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          {showComparison && previousScore && (
            <div className="flex items-center space-x-2 text-sm">
              <TrendingUp className="w-4 h-4 text-success-500" />
              <span className="text-success-600 font-medium">
                +{score.overall - previousScore.overall} points
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <ResponsiveContainer width={200} height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={getScoreColor(score.overall)}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-gray-900">
                {score.overall}
              </div>
              <div className="text-sm text-gray-500">out of 100</div>
              <div className="flex items-center space-x-1 mt-1">
                {getScoreIcon(score.overall)}
                <span className="text-sm font-medium">
                  {getScoreLabel(score.overall)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="grid grid-cols-2 gap-4">
          {detailsData.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                <div className="flex items-center space-x-1">
                  {getScoreIcon(item.value)}
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              
              {showComparison && previousScore && (
                <div className="text-xs text-gray-500">
                  {item.name === 'Keywords' && `+${item.value - previousScore.keywords}`}
                  {item.name === 'Formatting' && `+${item.value - previousScore.formatting}`}
                  {item.name === 'Readability' && `+${item.value - previousScore.readability}`}
                  {item.name === 'Structure' && `+${item.value - previousScore.structure}`}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {score.suggestions && score.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Recommendations</h4>
            <ul className="space-y-2">
              {score.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

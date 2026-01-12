'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface SkinAnalysisResult {
  skinType: string;
  concerns: Array<{ name: string; severity: 'low' | 'medium' | 'high' }>;
  recommendations: string[];
  overallScore: number;
  details: {
    hydration: number;
    oiliness: number;
    sensitivity: number;
    texture: number;
    pores: number;
  };
}

type AnalysisStep = 'upload' | 'analyzing' | 'results';

export function SkinAnalyzerClient() {
  const [step, setStep] = useState<AnalysisStep>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [results, setResults] = useState<SkinAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const analyzeImage = async () => {
    if (!image) return;

    setStep('analyzing');
    setError(null);

    try {
      // Simulate AI analysis (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock results
      const mockResults: SkinAnalysisResult = {
        skinType: 'Combination',
        concerns: [
          { name: 'Mild Dehydration', severity: 'medium' },
          { name: 'Enlarged Pores (T-zone)', severity: 'low' },
          { name: 'Uneven Skin Tone', severity: 'low' },
        ],
        recommendations: [
          'Use a gentle, hydrating cleanser twice daily',
          'Apply a lightweight hyaluronic acid serum',
          'Use a niacinamide product to minimize pores',
          'Always apply SPF 50 sunscreen in the morning',
          'Consider adding vitamin C for brightening',
        ],
        overallScore: 78,
        details: {
          hydration: 65,
          oiliness: 45,
          sensitivity: 30,
          texture: 70,
          pores: 55,
        },
      };

      setResults(mockResults);
      setStep('results');
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      setStep('upload');
    }
  };

  const resetAnalysis = () => {
    setStep('upload');
    setImage(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <AnimatePresence mode="wait">
        {/* Upload Step */}
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-8">
                <div
                  {...getRootProps()}
                  className={cn(
                    'cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors',
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
                    image && 'border-primary'
                  )}
                >
                  <input {...getInputProps()} />
                  
                  {image ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto aspect-square max-w-[300px] overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt="Uploaded selfie"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Click or drag to replace image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Drop your photo here or click to upload</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          For best results, use a clear selfie in natural lighting
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-4 flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  <Button
                    size="lg"
                    disabled={!image}
                    onClick={analyzeImage}
                  >
                    Analyze My Skin
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Tips */}
                <div className="mt-8 rounded-lg bg-secondary/50 p-4">
                  <h4 className="font-medium">Photo Tips:</h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Use natural daylight (avoid harsh shadows)</li>
                    <li>• Remove makeup for accurate results</li>
                    <li>• Face the camera directly</li>
                    <li>• Ensure your face is clearly visible</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="mt-6 font-heading text-xl font-semibold">Analyzing Your Skin...</h3>
                <p className="mt-2 text-muted-foreground">
                  Our AI is examining your skin type, concerns, and conditions
                </p>
                <div className="mt-8 w-full max-w-xs">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Detecting skin type...
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing skin concerns...
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Step */}
        {step === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Skin Analysis Results</span>
                  <Button variant="outline" size="sm" onClick={resetAnalysis}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Analysis
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="text-center">
                    <div className="relative mx-auto h-40 w-40">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-muted"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeDasharray={`${results.overallScore * 2.51} 251`}
                          className="text-primary"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">{results.overallScore}</span>
                        <span className="text-sm text-muted-foreground">Skin Score</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Skin Type</h4>
                    <p className="mt-1 text-2xl font-bold text-primary">{results.skinType}</p>
                    
                    <h4 className="mt-4 font-semibold">Key Concerns</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {results.concerns.map((concern, i) => (
                        <Badge
                          key={i}
                          variant={
                            concern.severity === 'high'
                              ? 'destructive'
                              : concern.severity === 'medium'
                              ? 'warning'
                              : 'secondary'
                          }
                        >
                          {concern.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Skin Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(results.details).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{key}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button className="w-full">
                    Shop Recommended Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { SkinAnalyzerClient } from './skin-analyzer-client';
import { Sparkles, Camera, FileText, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Skin Analysis',
  description: 'Get personalized skincare recommendations based on AI-powered analysis of your skin. Upload a photo and discover products tailored to your unique skin needs.',
};

const steps = [
  {
    icon: Camera,
    title: 'Upload Photo',
    description: 'Take or upload a clear selfie in natural lighting',
  },
  {
    icon: Sparkles,
    title: 'AI Analysis',
    description: 'Our AI analyzes your skin type, concerns, and conditions',
  },
  {
    icon: FileText,
    title: 'Get Results',
    description: 'Receive a detailed skin profile with recommendations',
  },
  {
    icon: ShoppingBag,
    title: 'Shop Products',
    description: 'Browse personalized product recommendations',
  },
];

export default function SkinAnalysisPage() {
  return (
    <div className="container-custom py-8 md:py-12">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          <Sparkles className="mr-2 h-4 w-4" />
          AI Powered
        </span>
        <h1 className="mt-4 font-heading text-4xl font-bold md:text-5xl">
          Discover Your Perfect Skincare Routine
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Our AI-powered skin analysis uses advanced image recognition to identify your
          skin type, concerns, and conditions. Get personalized product recommendations
          tailored to your unique skin needs.
        </p>
      </div>

      {/* How It Works */}
      <div className="mt-16">
        <h2 className="text-center font-heading text-2xl font-bold">How It Works</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analyzer */}
      <div className="mt-16">
        <SkinAnalyzerClient />
      </div>

      {/* Disclaimer */}
      <div className="mt-16 rounded-lg bg-secondary/50 p-6 text-center text-sm text-muted-foreground">
        <p>
          <strong>Disclaimer:</strong> This AI skin analysis tool is for informational
          purposes only and is not a substitute for professional medical advice. For
          serious skin concerns, please consult a dermatologist.
        </p>
      </div>
    </div>
  );
}

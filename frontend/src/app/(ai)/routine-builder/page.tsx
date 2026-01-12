'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sun,
  Moon,
  Plus,
  Check,
  ShoppingBag,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';

type Step = 'skin-type' | 'concerns' | 'preferences' | 'results';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  step: string;
  description: string;
  image: string;
}

const skinTypes = [
  { id: 'oily', label: 'Oily', description: 'Shiny, enlarged pores, prone to breakouts' },
  { id: 'dry', label: 'Dry', description: 'Tight, flaky, rough texture' },
  { id: 'combination', label: 'Combination', description: 'Oily T-zone, dry cheeks' },
  { id: 'normal', label: 'Normal', description: 'Balanced, few imperfections' },
  { id: 'sensitive', label: 'Sensitive', description: 'Easily irritated, reactive' },
];

const skinConcerns = [
  { id: 'acne', label: 'Acne & Breakouts' },
  { id: 'aging', label: 'Anti-Aging' },
  { id: 'pigmentation', label: 'Dark Spots' },
  { id: 'dryness', label: 'Dehydration' },
  { id: 'dullness', label: 'Dullness' },
  { id: 'sensitivity', label: 'Redness' },
  { id: 'pores', label: 'Large Pores' },
  { id: 'texture', label: 'Uneven Texture' },
];

const preferences = [
  { id: 'fragrance-free', label: 'Fragrance-Free' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'cruelty-free', label: 'Cruelty-Free' },
  { id: 'budget', label: 'Budget-Friendly' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'natural', label: 'Natural/Organic' },
];

export default function RoutineBuilderPage() {
  const [currentStep, setCurrentStep] = useState<Step>('skin-type');
  const [selectedSkinType, setSelectedSkinType] = useState<string | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [routine, setRoutine] = useState<{ morning: Product[]; evening: Product[] } | null>(null);
  const { addItem } = useCartStore();

  const toggleConcern = (id: string) => {
    setSelectedConcerns(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const togglePreference = (id: string) => {
    setSelectedPreferences(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const generateRoutine = () => {
    // Mock routine generation - in production, this would call the AI API
    const mockRoutine = {
      morning: [
        {
          id: '1',
          name: 'Gentle Foaming Cleanser',
          brand: 'Environ',
          price: 450,
          step: 'Cleanser',
          description: 'Start your day with a clean slate',
          image: '/products/cleanser.jpg',
        },
        {
          id: '2',
          name: 'Vita-Antioxidant AVST',
          brand: 'Environ',
          price: 1250,
          step: 'Treatment',
          description: 'Vitamin-rich treatment serum',
          image: '/products/serum.jpg',
        },
        {
          id: '3',
          name: 'Hydrating Gel Moisturizer',
          brand: 'Lamelle',
          price: 650,
          step: 'Moisturizer',
          description: 'Lightweight daily hydration',
          image: '/products/moisturizer.jpg',
        },
        {
          id: '4',
          name: 'Heliocare SPF 50',
          brand: 'Heliocare',
          price: 550,
          step: 'Sunscreen',
          description: 'Essential daily protection',
          image: '/products/sunscreen.jpg',
        },
      ],
      evening: [
        {
          id: '5',
          name: 'Oil Cleanser',
          brand: 'Dermalogica',
          price: 650,
          step: 'First Cleanse',
          description: 'Remove makeup and SPF',
          image: '/products/oil-cleanser.jpg',
        },
        {
          id: '6',
          name: 'Gentle Foaming Cleanser',
          brand: 'Environ',
          price: 450,
          step: 'Second Cleanse',
          description: 'Deep clean pores',
          image: '/products/cleanser.jpg',
        },
        {
          id: '7',
          name: 'Retinol Serum 0.5%',
          brand: 'SkinCeuticals',
          price: 1800,
          step: 'Treatment',
          description: 'Anti-aging powerhouse',
          image: '/products/retinol.jpg',
        },
        {
          id: '8',
          name: 'Rich Night Cream',
          brand: 'Lamelle',
          price: 890,
          step: 'Moisturizer',
          description: 'Nourish while you sleep',
          image: '/products/night-cream.jpg',
        },
      ],
    };
    setRoutine(mockRoutine);
    setCurrentStep('results');
  };

  const resetBuilder = () => {
    setCurrentStep('skin-type');
    setSelectedSkinType(null);
    setSelectedConcerns([]);
    setSelectedPreferences([]);
    setRoutine(null);
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'skin-type', label: 'Skin Type' },
    { id: 'concerns', label: 'Concerns' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'results', label: 'Your Routine' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case 'skin-type':
        return !!selectedSkinType;
      case 'concerns':
        return selectedConcerns.length > 0;
      case 'preferences':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 'preferences') {
      generateRoutine();
    } else {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].id);
      }
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const totalRoutinePrice = routine
    ? [...routine.morning, ...routine.evening].reduce((sum, p) => sum + p.price, 0)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Powered
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Build Your Perfect Routine
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Answer a few questions and our AI will create a personalized skincare routine
          tailored to your unique needs.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                index === currentStepIndex
                  ? 'bg-teal-600 text-white'
                  : index < currentStepIndex
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="w-5 h-5 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
              )}
              <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-2 ${
                  index < currentStepIndex ? 'bg-teal-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Skin Type Step */}
        {currentStep === 'skin-type' && (
          <motion.div
            key="skin-type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
              What's your skin type?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skinTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedSkinType(type.id)}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    selectedSkinType === type.id
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900 mb-1">{type.label}</p>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Concerns Step */}
        {currentStep === 'concerns' && (
          <motion.div
            key="concerns"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              What are your main skin concerns?
            </h2>
            <p className="text-gray-500 text-center mb-6">Select up to 4 concerns</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {skinConcerns.map((concern) => (
                <button
                  key={concern.id}
                  onClick={() => toggleConcern(concern.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedConcerns.includes(concern.id)
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">{concern.label}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Preferences Step */}
        {currentStep === 'preferences' && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Any product preferences?
            </h2>
            <p className="text-gray-500 text-center mb-6">Optional - select all that apply</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {preferences.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => togglePreference(pref.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedPreferences.includes(pref.id)
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">{pref.label}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Step */}
        {currentStep === 'results' && routine && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your Personalized Routine
              </h2>
              <p className="text-gray-500">
                Based on your {selectedSkinType} skin and selected concerns
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Morning Routine */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Sun className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Morning Routine</h3>
                    <p className="text-sm text-gray-500">4 steps</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {routine.morning.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </span>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand} • {product.step}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Evening Routine */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Moon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Evening Routine</h3>
                    <p className="text-sm text-gray-500">4 steps</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {routine.evening.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </span>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand} • {product.step}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Summary */}
            <Card className="p-6 mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-gray-500">Complete Routine Total</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(totalRoutinePrice)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={resetBuilder}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                  <Button>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add All to Cart
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {currentStep !== 'results' && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            {currentStep === 'preferences' ? 'Generate Routine' : 'Continue'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

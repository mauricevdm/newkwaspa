'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    title: 'Anthelios',
    subtitle: 'Industry leading UVA filters meet invisible formulas for every skin type.',
    brand: 'La Roche-Posay',
    description: 'La Roche-Posay offers peace of mind protection this summer.',
    image: '/images/hero/anthelios.jpg',
    bgColor: 'bg-sky-50',
    cta: { text: 'Shop now', href: '/brands/la-roche-posay/anthelios' },
  },
  {
    id: 2,
    title: 'Lamelle Festive Sets',
    subtitle: "Shop Lamelle's limited festive sets",
    brand: 'Lamelle',
    description: 'Address a variety of skin concerns with radiant confidence.',
    image: '/images/hero/lamelle-festive.jpg',
    bgColor: 'bg-pink-50',
    cta: { text: 'Shop now', href: '/brands/lamelle/specials' },
  },
  {
    id: 3,
    title: 'AI Skin Analysis',
    subtitle: 'Powered by advanced machine learning',
    brand: 'Dermastore AI',
    description: 'Get personalized product recommendations based on your unique skin profile.',
    image: '/images/hero/ai-analysis.jpg',
    bgColor: 'bg-violet-50',
    cta: { text: 'Analyze My Skin', href: '/skin-analysis' },
  },
  {
    id: 4,
    title: 'Video Consultations',
    subtitle: 'Chat with qualified skin therapists',
    brand: 'Expert Advice',
    description: 'Book a free consultation with our skincare specialists.',
    image: '/images/hero/consultation.jpg',
    bgColor: 'bg-emerald-50',
    cta: { text: 'Book Now', href: '/consultations' },
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className={`${slide.bgColor}`}
        >
          <div className="container-custom">
            <div className="grid min-h-[400px] items-center gap-8 py-12 md:min-h-[500px] md:grid-cols-2 md:py-16">
              {/* Content */}
              <div className="order-2 space-y-4 md:order-1">
                <span className="text-sm font-medium uppercase tracking-wider text-gray-500">
                  {slide.brand}
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {slide.subtitle}
                </p>
                <p className="text-gray-500">
                  {slide.description}
                </p>
                <div className="pt-4">
                  <Link
                    href={slide.cta.href}
                    className="inline-flex items-center gap-2 rounded-none border-b-2 border-gray-900 pb-1 font-medium text-gray-900 transition-colors hover:border-gray-600 hover:text-gray-600"
                  >
                    {slide.cta.text}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Image Placeholder */}
              <div className="order-1 md:order-2">
                <div className="relative mx-auto aspect-square max-w-[400px] overflow-hidden rounded-2xl bg-white/50 shadow-lg">
                  <div className="flex h-full items-center justify-center">
                    <span className="text-xl font-semibold text-gray-400">
                      {slide.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-6 bg-gray-900'
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

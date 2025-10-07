'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TestimonialCard {
  id: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  content: string;
  highlight: string;
  avatar: string;
}

interface TestimonialsPlaceholderCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showPauseButton?: boolean;
  className?: string;
  cardClassName?: string;
  maxCards?: number;
}

export default function TestimonialsPlaceholderCarousel({
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  showPauseButton = true,
  className = '',
  cardClassName = '',
  maxCards = 5
}: TestimonialsPlaceholderCarouselProps) {
  const t = useTranslations('TestimonialsPlaceholder');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isRTL, setIsRTL] = useState(false);

  // Detect RTL layout
  useEffect(() => {
    const checkRTL = () => {
      setIsRTL(document.documentElement.dir === 'rtl');
    };
    
    checkRTL();
    window.addEventListener('resize', checkRTL);
    return () => window.removeEventListener('resize', checkRTL);
  }, []);

  // Placeholder testimonials data
  const testimonials: TestimonialCard[] = [
    {
      id: '1',
      name: t('testimonial1Name'),
      city: t('testimonial1City'),
      country: t('testimonial1Country'),
      rating: 5,
      content: t('testimonial1Content'),
      highlight: t('testimonial1Highlight'),
      avatar: '/api/placeholder/80/80'
    },
    {
      id: '2',
      name: t('testimonial2Name'),
      city: t('testimonial2City'),
      country: t('testimonial2Country'),
      rating: 5,
      content: t('testimonial2Content'),
      highlight: t('testimonial2Highlight'),
      avatar: '/api/placeholder/80/80'
    },
    {
      id: '3',
      name: t('testimonial3Name'),
      city: t('testimonial3City'),
      country: t('testimonial3Country'),
      rating: 5,
      content: t('testimonial3Content'),
      highlight: t('testimonial3Highlight'),
      avatar: '/api/placeholder/80/80'
    },
    {
      id: '4',
      name: t('testimonial4Name'),
      city: t('testimonial4City'),
      country: t('testimonial4Country'),
      rating: 5,
      content: t('testimonial4Content'),
      highlight: t('testimonial4Highlight'),
      avatar: '/api/placeholder/80/80'
    },
    {
      id: '5',
      name: t('testimonial5Name'),
      city: t('testimonial5City'),
      country: t('testimonial5Country'),
      rating: 5,
      content: t('testimonial5Content'),
      highlight: t('testimonial5Highlight'),
      avatar: '/api/placeholder/80/80'
    }
  ].slice(0, maxCards);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, testimonials.length]);

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <motion.svg
        key={index}
        className="w-5 h-5 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 }}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </motion.svg>
    ));
  };

  // Animation variants
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  if (testimonials.length === 0) {
    return (
      <div className={`glass-card p-8 rounded-2xl text-center ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">
          {t('noTestimonials')}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('subtitle')}
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        {/* Main Testimonial Card */}
        <div className="relative h-96 flex items-center justify-center">
          <AnimatePresence mode="wait" custom={isRTL ? -1 : 1}>
            <motion.div
              key={currentIndex}
              custom={isRTL ? -1 : 1}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.3 }
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className={`glass-card p-8 rounded-2xl max-w-2xl mx-auto ${cardClassName}`}>
                {/* Quote Icon */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-primaryOrange to-orange-600 rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </motion.div>
                </div>

                {/* Testimonial Content */}
                <motion.blockquote
                  className="text-lg text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  &ldquo;{testimonials[currentIndex].content}&rdquo;
                </motion.blockquote>

                {/* Highlight */}
                <motion.div
                  className="text-center mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-primaryOrange/10 to-orange-600/10 text-primaryOrange font-semibold rounded-full border border-primaryOrange/20">
                    {testimonials[currentIndex].highlight}
                  </span>
                </motion.div>

                {/* Author Info */}
                <motion.div
                  className="flex items-center justify-center space-x-4 rtl:space-x-reverse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-primaryOrange to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {testimonials[currentIndex].name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-deepPurple to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Author Details */}
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonials[currentIndex].city}, {testimonials[currentIndex].country}
                    </p>
                    
                    {/* Star Rating */}
                    <div className="flex justify-center mt-2">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {showArrows && testimonials.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className={`absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 ${
                isRTL ? 'right-4' : 'left-4'
              }`}
              aria-label={t('previousTestimonial')}
            >
              <svg
                className={`w-6 h-6 text-gray-700 dark:text-gray-300 ${
                  isRTL ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className={`absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 ${
                isRTL ? 'left-4' : 'right-4'
              }`}
              aria-label={t('nextTestimonial')}
            >
              <svg
                className={`w-6 h-6 text-gray-700 dark:text-gray-300 ${
                  isRTL ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Navigation */}
        {showDots && testimonials.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2 rtl:space-x-reverse">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-primaryOrange scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={t('goToTestimonial', { number: index + 1 })}
              />
            ))}
          </div>
        )}

        {/* Play/Pause Button */}
        {showPauseButton && testimonials.length > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={togglePlayPause}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 rtl:space-x-reverse"
              aria-label={isPlaying ? t('pauseCarousel') : t('playCarousel')}
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {isPlaying ? t('pauseCarousel') : t('playCarousel')}
              </span>
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        {isPlaying && testimonials.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="h-full bg-gradient-to-r from-primaryOrange to-orange-600"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
              key={currentIndex}
            />
          </div>
        )}
      </div>

      {/* Testimonial Counter */}
      <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        {t('testimonialCounter', { 
          current: currentIndex + 1, 
          total: testimonials.length 
        })}
      </div>
    </div>
  );
}

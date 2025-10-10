'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface TestimonialsCarouselProps {
  locale: string;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

interface Testimonial {
  id: string;
  nameKey: string;
  cityKey: string;
  roleKey: string;
  contentKey: string;
  highlightKey: string;
  avatar: string;
  rating: number;
}

export default function TestimonialsCarousel({ 
  locale, 
  className = '',
  autoPlay = true,
  autoPlayInterval = 5000
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const t = useTranslations('TestimonialsCarousel');
  const isRTL = locale === 'ar';

  const testimonials: Testimonial[] = [
    {
      id: 'cairo-user-1',
      nameKey: 'testimonial1Name',
      cityKey: 'testimonial1City',
      roleKey: 'testimonial1Role',
      contentKey: 'testimonial1Content',
      highlightKey: 'testimonial1Highlight',
      avatar: '/api/placeholder/80/80',
      rating: 5
    },
    {
      id: 'dubai-user-1',
      nameKey: 'testimonial2Name',
      cityKey: 'testimonial2City',
      roleKey: 'testimonial2Role',
      contentKey: 'testimonial2Content',
      highlightKey: 'testimonial2Highlight',
      avatar: '/api/placeholder/80/80',
      rating: 5
    },
    {
      id: 'riyadh-user-1',
      nameKey: 'testimonial3Name',
      cityKey: 'testimonial3City',
      roleKey: 'testimonial3Role',
      contentKey: 'testimonial3Content',
      highlightKey: 'testimonial3Highlight',
      avatar: '/api/placeholder/80/80',
      rating: 5
    },
    {
      id: 'cairo-user-2',
      nameKey: 'testimonial4Name',
      cityKey: 'testimonial4City',
      roleKey: 'testimonial4Role',
      contentKey: 'testimonial4Content',
      highlightKey: 'testimonial4Highlight',
      avatar: '/api/placeholder/80/80',
      rating: 5
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false); // Stop auto-play when user manually navigates
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
    setIsPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
    setIsPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Icons
  const StarIcon = ({ filled = false }: { filled?: boolean }) => (
    <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );

  const ChevronLeftIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const PlayIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );

  const PauseIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      className={`py-20 px-4 ${className} ${
        isRTL ? 'rtl' : 'ltr'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('title')}
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Testimonial Card */}
          <div className="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-32 h-32 bg-primaryOrange rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-deepPurple rounded-full blur-2xl"></div>
            </div>

            {/* Testimonial Content */}
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* User Info */}
                <div className="flex-shrink-0 text-center lg:text-left rtl:lg:text-right">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-r from-primaryOrange to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto lg:mx-0">
                      {currentTestimonial.nameKey.charAt(0)}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {t(currentTestimonial.nameKey)}
                  </h3>
                  <p className="text-white/70 text-lg mb-2">
                    {t(currentTestimonial.roleKey)}
                  </p>
                  <p className="text-primaryOrange font-semibold text-lg">
                    {t(currentTestimonial.cityKey)}
                  </p>
                  
                  {/* Star Rating */}
                  <div className="flex items-center justify-center lg:justify-start rtl:lg:justify-end gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < currentTestimonial.rating} />
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <div className="flex-1 text-center lg:text-left rtl:lg:text-right">
                  <blockquote className="text-xl md:text-2xl text-white/90 leading-relaxed mb-6">
                    &ldquo;{t(currentTestimonial.contentKey)}&rdquo;
                  </blockquote>
                  
                  {/* Highlight */}
                  <div className="glass-card p-4 rounded-2xl bg-gradient-to-r from-primaryOrange/10 to-orange-500/10 border border-primaryOrange/20">
                    <p className="text-primaryOrange font-semibold text-lg">
                      {t(currentTestimonial.highlightKey)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="glass-card p-3 rounded-xl text-white hover:text-primaryOrange transition-colors duration-200 hover:scale-105"
              aria-label={t('previousTestimonial')}
            >
              <ChevronLeftIcon />
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-primaryOrange scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`${t('goToTestimonial')} ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="glass-card p-3 rounded-xl text-white hover:text-primaryOrange transition-colors duration-200 hover:scale-105"
              aria-label={t('nextTestimonial')}
            >
              <ChevronRightIcon />
            </button>

            {/* Auto-play Toggle */}
            <button
              onClick={toggleAutoPlay}
              className="glass-card p-3 rounded-xl text-white hover:text-primaryOrange transition-colors duration-200 hover:scale-105 ml-4"
              aria-label={isPlaying ? t('pauseCarousel') : t('playCarousel')}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>

          {/* Testimonial Counter */}
          <div className="text-center mt-6">
            <p className="text-white/60 text-sm">
              {currentIndex + 1} {t('of')} {testimonials.length} {t('testimonials')}
            </p>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-primaryOrange mb-2">500+</div>
            <div className="text-white/80">{t('happyUsers')}</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-primaryOrange mb-2">50K+</div>
            <div className="text-white/80">{t('downloads')}</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-primaryOrange mb-2">4.9/5</div>
            <div className="text-white/80">{t('averageRating')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

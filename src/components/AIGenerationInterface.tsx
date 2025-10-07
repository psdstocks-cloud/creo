/**
 * AI Generation Interface Component
 * 
 * A comprehensive AI image generation interface with glassmorphism design,
 * real-time updates, and full generation lifecycle management.
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface GenerationRequest {
  prompt: string;
  style?: string;
  size?: string;
  quality?: 'standard' | 'high' | 'premium' | 'ultra';
  count?: number;
}

interface GeneratedImage {
  id: string;
  url: string;
  thumbnail: string;
  prompt: string;
  style: string;
  size: string;
  quality: string;
  credits: number;
  createdAt: string;
  status: 'generating' | 'completed' | 'failed';
  progress?: number;
  error?: string;
}

interface GenerationHistory {
  id: string;
  prompt: string;
  style: string;
  images: GeneratedImage[];
  createdAt: string;
  totalCredits: number;
}

interface PromptSuggestion {
  id: string;
  text: string;
  category: string;
  credits: number;
}


// ============================================================================
// Prompt Suggestions Component
// ============================================================================

const PromptSuggestions = ({ 
  onSelect, 
  isVisible 
}: { 
  onSelect: (suggestion: PromptSuggestion) => void;
  isVisible: boolean;
}) => {
  const t = useTranslations('AIGenerationInterface');

  const suggestions: PromptSuggestion[] = [
    { id: '1', text: 'A futuristic city at sunset', category: 'Landscape', credits: 2 },
    { id: '2', text: 'Portrait of a cyberpunk character', category: 'Portrait', credits: 3 },
    { id: '3', text: 'Abstract geometric patterns', category: 'Abstract', credits: 1 },
    { id: '4', text: 'Vintage car in a garage', category: 'Vehicles', credits: 2 },
    { id: '5', text: 'Minimalist logo design', category: 'Design', credits: 1 },
    { id: '6', text: 'Fantasy castle in the clouds', category: 'Fantasy', credits: 4 },
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 z-10 mt-2 glass-card rounded-lg p-4"
    >
      <h4 className="text-sm font-semibold text-white mb-3">{t('suggestions.title')}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className="text-left p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white text-sm group-hover:text-primaryOrange-300 transition-colors">
                  {suggestion.text}
                </p>
                <p className="text-gray-400 text-xs mt-1">{suggestion.category}</p>
              </div>
              <span className="text-primaryOrange-500 text-xs font-medium">
                {suggestion.credits} {t('credits')}
              </span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// Generation Queue Component
// ============================================================================

const GenerationQueue = ({ 
  queue, 
  onRemove 
}: { 
  queue: GenerationRequest[];
  onRemove: (index: number) => void;
}) => {
  const t = useTranslations('AIGenerationInterface');

  if (queue.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 rounded-lg mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{t('queue.title')}</h3>
        <span className="text-sm text-gray-400">{queue.length} {t('queue.items')}</span>
      </div>
      <div className="space-y-2">
        {queue.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex-1">
              <p className="text-white text-sm line-clamp-1">{item.prompt}</p>
              <p className="text-gray-400 text-xs">
                {item.style} • {item.size} • {item.quality}
              </p>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// Generated Image Card Component
// ============================================================================

const GeneratedImageCard = ({ 
  image, 
  onDownload, 
  onVary, 
  onUpscale 
}: { 
  image: GeneratedImage;
  onDownload: (image: GeneratedImage) => void;
  onVary: (image: GeneratedImage) => void;
  onUpscale: (image: GeneratedImage) => void;
}) => {
  const t = useTranslations('AIGenerationInterface');

  const getStatusColor = (status: GeneratedImage['status']) => {
    switch (status) {
      case 'generating':
        return 'bg-primaryOrange-500/20 text-primaryOrange-300 border-primaryOrange-500/30';
      case 'completed':
        return 'bg-deepPurple-500/20 text-deepPurple-300 border-deepPurple-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card p-4 rounded-lg group"
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        <Image
          src={image.thumbnail}
          alt={image.prompt}
          width={300}
          height={300}
          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(image.status)}`}>
            {t(`status.${image.status}`)}
          </span>
        </div>
        {image.status === 'generating' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryOrange-500 mx-auto mb-2"></div>
              <p className="text-white text-sm">{image.progress}%</p>
            </div>
          </div>
        )}
        {image.status === 'generating' && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <motion.div
                className="bg-primaryOrange-500 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${image.progress || 0}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-white text-sm line-clamp-2 group-hover:text-primaryOrange-300 transition-colors">
          {image.prompt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{image.style} • {image.size}</span>
          <span className="text-primaryOrange-500">{image.credits} {t('credits')}</span>
        </div>
        
        {image.status === 'completed' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onDownload(image)}
              className="flex-1 bg-deepPurple-500 hover:bg-deepPurple-600 text-white px-3 py-2 rounded text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t('download')}</span>
            </button>
            <button
              onClick={() => onVary(image)}
              className="flex-1 bg-primaryOrange-500 hover:bg-primaryOrange-600 text-white px-3 py-2 rounded text-xs transition-colors"
            >
              {t('vary')}
            </button>
            <button
              onClick={() => onUpscale(image)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-xs transition-colors"
            >
              {t('upscale')}
            </button>
          </div>
        )}
        
        {image.error && (
          <div className="text-red-400 text-xs bg-red-500/20 p-2 rounded">
            {image.error}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// Cost Calculator Component
// ============================================================================

const CostCalculator = ({ 
  prompt, 
  style, 
  quality, 
  count 
}: { 
  prompt: string;
  style: string;
  quality: string;
  count: number;
}) => {
  const t = useTranslations('AIGenerationInterface');

  const calculateCost = useCallback(() => {
    const baseCost = 1;
    
    // Quality multiplier
    const qualityMultiplier = {
      'standard': 1,
      'high': 1.5,
      'premium': 2,
      'ultra': 3
    }[quality] || 1;
    
    // Style complexity
    const styleMultiplier = {
      'realistic': 1.2,
      'artistic': 1.5,
      'abstract': 1,
      'minimalist': 0.8
    }[style] || 1;
    
    // Prompt length factor
    const promptFactor = Math.min(prompt.length / 50, 2);
    
    return Math.ceil(baseCost * qualityMultiplier * styleMultiplier * promptFactor * count);
  }, [prompt, style, quality, count]);

  const totalCost = calculateCost();

  return (
    <div className="glass-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-3">{t('costCalculator.title')}</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{t('costCalculator.baseCost')}</span>
          <span className="text-white">1 {t('credits')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{t('costCalculator.quality')} ({quality})</span>
          <span className="text-white">×{quality === 'standard' ? 1 : quality === 'high' ? 1.5 : quality === 'premium' ? 2 : 3}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">{t('costCalculator.count')}</span>
          <span className="text-white">×{count}</span>
        </div>
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-white">{t('costCalculator.total')}</span>
            <span className="text-primaryOrange-500">{totalCost} {t('credits')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main AI Generation Interface Component
// ============================================================================

const AIGenerationInterface: React.FC = () => {
  const t = useTranslations('AIGenerationInterface');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [quality, setQuality] = useState<'standard' | 'high' | 'premium' | 'ultra'>('standard');
  const [count, setCount] = useState(1);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationHistory, setGenerationHistory] = useState<GenerationHistory[]>([]);
  const [queue, setQueue] = useState<GenerationRequest[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  
  const promptRef = useRef<HTMLTextAreaElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    const loadHistory = async () => {
      // Simulate loading generation history
      const mockHistory: GenerationHistory[] = Array.from({ length: 5 }, (_, index) => ({
        id: `history-${index + 1}`,
        prompt: `Generated image ${index + 1}`,
        style: 'realistic',
        images: Array.from({ length: 2 }, (_, imgIndex) => ({
          id: `img-${index}-${imgIndex}`,
          url: `https://picsum.photos/400/400?random=${index * 2 + imgIndex}`,
          thumbnail: `https://picsum.photos/200/200?random=${index * 2 + imgIndex}`,
          prompt: `Generated image ${index + 1}`,
          style: 'realistic',
          size: '1024x1024',
          quality: 'high',
          credits: 2,
          createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed' as const
        })),
        createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        totalCredits: 4
      }));
      
      setGenerationHistory(mockHistory);
    };

    loadHistory();
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    // Add to queue
    const request: GenerationRequest = { prompt, style, quality, count };
    setQueue(prev => [...prev, request]);

    // Simulate generation process
    const newImages: GeneratedImage[] = Array.from({ length: count }, (_, index) => ({
      id: `gen-${Date.now()}-${index}`,
      url: '',
      thumbnail: '',
      prompt,
      style,
      size: '1024x1024',
      quality,
      credits: 2,
      createdAt: new Date().toISOString(),
      status: 'generating',
      progress: 0
    }));

    setGeneratedImages(prev => [...prev, ...newImages]);

    // Simulate progress updates
    for (let i = 0; i < newImages.length; i++) {
      const imageId = newImages[i].id;
      
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setGeneratedImages(prev => prev.map(img => 
          img.id === imageId 
            ? { ...img, progress }
            : img
        ));
      }
      
      // Mark as completed
      setGeneratedImages(prev => prev.map(img => 
        img.id === imageId 
          ? { 
              ...img, 
              status: 'completed' as const,
              url: `https://picsum.photos/400/400?random=${Date.now()}`,
              thumbnail: `https://picsum.photos/200/200?random=${Date.now()}`
            }
          : img
      ));
    }

    // Remove from queue
    setQueue(prev => prev.slice(1));
    setIsGenerating(false);
  }, [prompt, style, quality, count]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            handleGenerate();
            break;
          case 'k':
            e.preventDefault();
            setShowSuggestions(!showSuggestions);
            break;
          case 'h':
            e.preventDefault();
            setSelectedHistory(selectedHistory ? null : generationHistory[0]?.id || null);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, selectedHistory, generationHistory, handleGenerate]);

  const handleSuggestionSelect = (suggestion: PromptSuggestion) => {
    setPrompt(suggestion.text);
    setShowSuggestions(false);
    promptRef.current?.focus();
  };

  const handleDownload = (image: GeneratedImage) => {
    if (image.url) {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `ai-generated-${image.id}.jpg`;
      link.click();
    }
  };

  const handleVary = (image: GeneratedImage) => {
    // Implement variation logic
    console.log('Vary image:', image);
  };

  const handleUpscale = (image: GeneratedImage) => {
    // Implement upscale logic
    console.log('Upscale image:', image);
  };

  const handleRemoveFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{t('title')}</h1>
          <p className="text-primaryOrange-200 text-lg">{t('subtitle')}</p>
        </div>

        {/* Generation Queue */}
        <GenerationQueue queue={queue} onRemove={handleRemoveFromQueue} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Input */}
            <div className="glass-card p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">{t('generationForm.title')}</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('generationForm.prompt')}
                  </label>
                  <textarea
                    ref={promptRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={t('generationForm.promptPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                  <PromptSuggestions 
                    isVisible={showSuggestions}
                    onSelect={handleSuggestionSelect}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('generationForm.style')}
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                    >
                      <option value="realistic">{t('generationForm.styles.realistic')}</option>
                      <option value="artistic">{t('generationForm.styles.artistic')}</option>
                      <option value="abstract">{t('generationForm.styles.abstract')}</option>
                      <option value="minimalist">{t('generationForm.styles.minimalist')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quality" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('generationForm.quality')}
                    </label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value as typeof quality)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                    >
                      <option value="standard">{t('generationForm.qualities.standard')}</option>
                      <option value="high">{t('generationForm.qualities.high')}</option>
                      <option value="premium">{t('generationForm.qualities.premium')}</option>
                      <option value="ultra">{t('generationForm.qualities.ultra')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="count" className="block text-sm font-medium text-gray-300 mb-2">
                      {t('generationForm.count')}
                    </label>
                    <input
                      type="number"
                      value={count}
                      onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-primaryOrange-500 hover:bg-primaryOrange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{t('generationForm.generating')}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{t('generationForm.generate')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Images */}
            <div className="glass-card p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">{t('results.title')}</h2>
              
              {generatedImages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('results.emptyTitle')}</h3>
                  <p className="text-gray-300">{t('results.emptyDescription')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedImages.map((image) => (
                    <GeneratedImageCard
                      key={image.id}
                      image={image}
                      onDownload={handleDownload}
                      onVary={handleVary}
                      onUpscale={handleUpscale}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cost Calculator */}
            <CostCalculator 
              prompt={prompt}
              style={style}
              quality={quality}
              count={count}
            />

            {/* Generation History */}
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">{t('history.title')}</h3>
              <div className="space-y-2">
                {generationHistory.map((history) => (
                  <button
                    key={history.id}
                    onClick={() => setSelectedHistory(history.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedHistory === history.id
                        ? 'bg-primaryOrange-500/20 text-primaryOrange-300'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <p className="text-sm line-clamp-2">{history.prompt}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(history.createdAt).toLocaleDateString()} • {history.totalCredits} {t('credits')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">{t('shortcuts.title')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('shortcuts.generate')}</span>
                  <span className="text-white">Ctrl+Enter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('shortcuts.suggestions')}</span>
                  <span className="text-white">Ctrl+K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('shortcuts.history')}</span>
                  <span className="text-white">Ctrl+H</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerationInterface;

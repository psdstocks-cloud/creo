/**
 * AI Generation Interface Component
 * 
 * Comprehensive AI image generation interface with prompt input,
 * style selection, generation history, image gallery, and progress tracking.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { 
  SparklesIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  CommandLineIcon,
  LightBulbIcon,
  PaintBrushIcon,
  CameraIcon,
  FilmIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

// ============================================================================
// Types and Interfaces
// ============================================================================

interface AIGenerationJob {
  id: string;
  prompt: string;
  style: string;
  quality: string;
  count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  images: GeneratedImage[];
  cost: number;
  errorMessage?: string;
}

interface GeneratedImage {
  id: string;
  url: string;
  thumbnail: string;
  prompt: string;
  style: string;
  quality: string;
  createdAt: string;
  isFavorite: boolean;
  isDownloaded: boolean;
  downloadUrl?: string;
  fileSize?: string;
  dimensions?: string;
}

interface PromptSuggestion {
  id: string;
  text: string;
  category: string;
  style: string;
  isPopular: boolean;
}

interface GenerationHistory {
  id: string;
  prompt: string;
  style: string;
  quality: string;
  count: number;
  createdAt: string;
  images: GeneratedImage[];
  isFavorite: boolean;
}

interface StyleOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  multiplier: number;
  color: string;
}

interface QualityOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  resolution: string;
}

interface CostBreakdown {
  baseCost: number;
  styleMultiplier: number;
  qualityMultiplier: number;
  count: number;
  total: number;
}

// ============================================================================
// Style Options Configuration
// ============================================================================

const styleOptions: StyleOption[] = [
  {
    id: 'realistic',
    name: 'Realistic',
    description: 'Photorealistic images with natural lighting',
    icon: CameraIcon,
    multiplier: 1.0,
    color: 'text-blue-400'
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative and stylized artwork',
    icon: PaintBrushIcon,
    multiplier: 1.2,
    color: 'text-purple-400'
  },
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Non-representational and conceptual art',
    icon: SparklesIcon,
    multiplier: 1.1,
    color: 'text-pink-400'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple, and focused design',
    icon: StarIcon,
    multiplier: 0.9,
    color: 'text-gray-400'
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Movie-like dramatic scenes',
    icon: FilmIcon,
    multiplier: 1.3,
    color: 'text-orange-400'
  },
  {
    id: 'portrait',
    name: 'Portrait',
    description: 'Professional portrait photography',
    icon: UserGroupIcon,
    multiplier: 1.1,
    color: 'text-green-400'
  }
];

const qualityOptions: QualityOption[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Good quality for general use',
    cost: 1,
    resolution: '1024x1024'
  },
  {
    id: 'high',
    name: 'High',
    description: 'High quality for professional use',
    cost: 2,
    resolution: '1536x1536'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Ultra high quality for print',
    cost: 4,
    resolution: '2048x2048'
  },
  {
    id: 'ultra',
    name: 'Ultra',
    description: 'Maximum quality for critical projects',
    cost: 8,
    resolution: '4096x4096'
  }
];

// ============================================================================
// Prompt Suggestions Component
// ============================================================================

const PromptSuggestions: React.FC<{
  suggestions: PromptSuggestion[];
  onSelect: (suggestion: PromptSuggestion) => void;
  isLoading: boolean;
}> = ({ suggestions, onSelect, isLoading }) => {
  const t = useTranslations('AIGenerationInterface');

  return (
    <div className="glass-card p-4">
      <div className="flex items-center space-x-2 mb-4">
        <LightBulbIcon className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">{t('suggestions.title')}</h3>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-700 h-4 rounded w-3/4 mb-2"></div>
              <div className="bg-gray-700 h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <motion.button
              key={suggestion.id}
              onClick={() => onSelect(suggestion)}
              className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white font-medium group-hover:text-primaryOrange-300 transition-colors">
                    {suggestion.text}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-400 capitalize">{suggestion.category}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400 capitalize">{suggestion.style}</span>
                    {suggestion.isPopular && (
                      <span className="text-xs bg-primaryOrange-500 text-white px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
                <PlusIcon className="w-4 h-4 text-gray-400 group-hover:text-primaryOrange-300 transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Cost Calculator Component
// ============================================================================

const CostCalculator: React.FC<{
  style: string;
  quality: string;
  count: number;
  onUpdate: (breakdown: CostBreakdown) => void;
}> = ({ style, quality, count, onUpdate }) => {
  const t = useTranslations('AIGenerationInterface');

  const breakdown = useMemo(() => {
    const selectedStyle = styleOptions.find(s => s.id === style) || styleOptions[0];
    const selectedQuality = qualityOptions.find(q => q.id === quality) || qualityOptions[0];
    
    const baseCost = selectedQuality.cost;
    const styleMultiplier = selectedStyle.multiplier;
    const qualityMultiplier = 1; // Quality cost is already in baseCost
    const total = Math.round(baseCost * styleMultiplier * count);

    return {
      baseCost,
      styleMultiplier,
      qualityMultiplier,
      count,
      total
    };
  }, [style, quality, count]);

  useEffect(() => {
    onUpdate(breakdown);
  }, [breakdown, onUpdate]);

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold text-white mb-4">{t('costCalculator.title')}</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">{t('costCalculator.baseCost')}</span>
          <span className="text-white font-medium">{breakdown.baseCost} credits</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">{t('costCalculator.quality')}</span>
          <span className="text-white font-medium">{qualityOptions.find(q => q.id === quality)?.name}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">{t('costCalculator.count')}</span>
          <span className="text-white font-medium">{count} images</span>
        </div>
        
        <div className="border-t border-gray-600 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">{t('costCalculator.total')}</span>
            <span className="text-2xl font-bold text-primaryOrange-400">{breakdown.total} credits</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Generation Queue Component
// ============================================================================

const GenerationQueue: React.FC<{
  jobs: AIGenerationJob[];
  onRemove: (jobId: string) => void;
  onView: (job: AIGenerationJob) => void;
}> = ({ jobs, onRemove, onView }) => {
  const t = useTranslations('AIGenerationInterface');

  if (jobs.length === 0) return null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{t('queue.title')}</h3>
        <span className="text-sm text-gray-400">{jobs.length} {t('queue.items')}</span>
      </div>
      
      <div className="space-y-3">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{job.prompt}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-400 capitalize">{job.style}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{job.count} images</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-primaryOrange-400">{job.cost} credits</span>
                </div>
                
                {job.status === 'processing' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{t('status.generating')}</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-primaryOrange-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${job.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
                
                {job.status === 'completed' && (
                  <div className="flex items-center space-x-1 mt-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">{t('status.completed')}</span>
                  </div>
                )}
                
                {job.status === 'failed' && (
                  <div className="flex items-center space-x-1 mt-2">
                    <XCircleIcon className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400">{t('status.failed')}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {job.status === 'completed' && (
                  <button
                    onClick={() => onView(job)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={t('viewResults')}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                )}
                
                {(job.status === 'pending' || job.status === 'failed') && (
                  <button
                    onClick={() => onRemove(job.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    aria-label={t('removeJob')}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Image Gallery Component
// ============================================================================

const ImageGallery: React.FC<{
  images: GeneratedImage[];
  onDownload: (image: GeneratedImage) => void;
  onFavorite: (imageId: string) => void;
  onShare: (image: GeneratedImage) => void;
  onView: (image: GeneratedImage) => void;
}> = ({ images, onDownload, onFavorite, onShare, onView }) => {
  const t = useTranslations('AIGenerationInterface');

  if (images.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">{t('results.emptyTitle')}</h3>
        <p className="text-gray-400">{t('results.emptyDescription')}</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold text-white mb-4">{t('results.title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group bg-gray-800 rounded-lg overflow-hidden"
          >
            <Image
              src={image.thumbnail}
              alt={image.prompt}
              width={300}
              height={300}
              className="w-full h-48 object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                <button
                  onClick={() => onView(image)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                  aria-label={t('viewImage')}
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDownload(image)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                  aria-label={t('downloadImage')}
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onFavorite(image.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    image.isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  aria-label={t('toggleFavorite')}
                >
                  <HeartIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onShare(image)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                  aria-label={t('shareImage')}
                >
                  <ShareIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Image Info */}
            <div className="p-3">
              <p className="text-white text-sm font-medium truncate">{image.prompt}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 capitalize">{image.style}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{image.quality}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {image.isFavorite && (
                    <HeartIcon className="w-4 h-4 text-red-400" />
                  )}
                  {image.isDownloaded && (
                    <CheckCircleIcon className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Generation Form Component
// ============================================================================

const GenerationForm: React.FC<{
  prompt: string;
  setPrompt: (prompt: string) => void;
  style: string;
  setStyle: (style: string) => void;
  quality: string;
  setQuality: (quality: string) => void;
  count: number;
  setCount: (count: number) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  costBreakdown: CostBreakdown;
}> = ({ 
  prompt, 
  setPrompt, 
  style, 
  setStyle, 
  quality, 
  setQuality, 
  count, 
  setCount, 
  onSubmit, 
  isGenerating,
  costBreakdown 
}) => {
  const t = useTranslations('AIGenerationInterface');

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold text-white mb-6">{t('generationForm.title')}</h2>
      
      <div className="space-y-6">
        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            {t('generationForm.prompt')}
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('generationForm.promptPlaceholder')}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            {t('generationForm.style')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {styleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setStyle(option.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    style === option.id
                      ? 'border-primaryOrange-500 bg-primaryOrange-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon className={`w-6 h-6 ${option.color}`} />
                    <div className="text-center">
                      <p className="text-white font-medium text-sm">{option.name}</p>
                      <p className="text-gray-400 text-xs">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quality and Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('generationForm.quality')}
            </label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
            >
              {qualityOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name} - {option.resolution} ({option.cost} credits)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('generationForm.count')}
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryOrange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {t('costCalculator.total')}: <span className="text-primaryOrange-400 font-semibold">{costBreakdown.total} credits</span>
          </div>
          
          <button
            onClick={onSubmit}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center space-x-2 bg-gradient-to-r from-primaryOrange-500 to-primaryOrange-600 hover:from-primaryOrange-600 hover:to-primaryOrange-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span>{t('generationForm.generating')}</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                <span>{t('generationForm.generate')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Keyboard Shortcuts Component
// ============================================================================

const KeyboardShortcuts: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const t = useTranslations('AIGenerationInterface');

  const shortcuts = [
    { key: 'Ctrl + Enter', action: t('shortcuts.generate') },
    { key: 'Ctrl + S', action: t('shortcuts.suggestions') },
    { key: 'Ctrl + H', action: t('shortcuts.history') }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{t('shortcuts.title')}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{shortcut.action}</span>
                    <kbd className="px-2 py-1 bg-gray-700 text-white text-sm rounded">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Main AIGenerationInterface Component
// ============================================================================

const AIGenerationInterface: React.FC = () => {
  const t = useTranslations('AIGenerationInterface');
  const { user } = useAuth();

  // State
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [quality, setQuality] = useState('standard');
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown>({
    baseCost: 1,
    styleMultiplier: 1,
    qualityMultiplier: 1,
    count: 1,
    total: 1
  });

  // Generation state
  const [jobs, setJobs] = useState<AIGenerationJob[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [suggestions, setSuggestions] = useState<PromptSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'gallery'>('generate');
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Mock data for development
  const mockSuggestions: PromptSuggestion[] = [
    {
      id: '1',
      text: 'A futuristic cityscape at sunset with flying cars',
      category: 'landscape',
      style: 'realistic',
      isPopular: true
    },
    {
      id: '2',
      text: 'Abstract geometric patterns in vibrant colors',
      category: 'abstract',
      style: 'artistic',
      isPopular: false
    },
    {
      id: '3',
      text: 'Professional headshot of a businesswoman',
      category: 'portrait',
      style: 'realistic',
      isPopular: true
    }
  ];

  const mockImages: GeneratedImage[] = [
    {
      id: '1',
      url: 'https://picsum.photos/1024/1024?random=1',
      thumbnail: 'https://picsum.photos/300/300?random=1',
      prompt: 'A futuristic cityscape at sunset',
      style: 'realistic',
      quality: 'high',
      createdAt: new Date().toISOString(),
      isFavorite: false,
      isDownloaded: false,
      downloadUrl: 'https://example.com/download/1',
      fileSize: '2.5 MB',
      dimensions: '1024x1024'
    },
    {
      id: '2',
      url: 'https://picsum.photos/1024/1024?random=2',
      thumbnail: 'https://picsum.photos/300/300?random=2',
      prompt: 'Abstract geometric patterns',
      style: 'artistic',
      quality: 'premium',
      createdAt: new Date().toISOString(),
      isFavorite: true,
      isDownloaded: true,
      downloadUrl: 'https://example.com/download/2',
      fileSize: '4.2 MB',
      dimensions: '2048x2048'
    }
  ];

  // Load suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSuggestions(mockSuggestions);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    loadSuggestions();
  }, [mockSuggestions]);

  // Load initial data
  useEffect(() => {
    setImages(mockImages);
  }, [mockImages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            handleGenerate();
            break;
          case 's':
            e.preventDefault();
            // Toggle suggestions
            break;
          case 'h':
            e.preventDefault();
            setActiveTab('history');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate]);

  // Handlers
  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    
    // Create new job
    const newJob: AIGenerationJob = {
      id: Date.now().toString(),
      prompt,
      style,
      quality,
      count,
      status: 'processing',
      progress: 0,
      createdAt: new Date().toISOString(),
      images: [],
      cost: costBreakdown.total
    };

    setJobs(prev => [...prev, newJob]);

    // Simulate generation process
    const interval = setInterval(() => {
      setJobs(prev => prev.map(job => {
        if (job.id === newJob.id) {
          const newProgress = Math.min(job.progress + Math.random() * 20, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsGenerating(false);
            return {
              ...job,
              progress: 100,
              status: 'completed' as const,
              completedAt: new Date().toISOString(),
              images: mockImages.slice(0, count)
            };
          }
          return { ...job, progress: newProgress };
        }
        return job;
      }));
    }, 1000);
  }, [prompt, style, quality, count, costBreakdown.total, isGenerating, mockImages]);

  const handleSuggestionSelect = useCallback((suggestion: PromptSuggestion) => {
    setPrompt(suggestion.text);
    setStyle(suggestion.style);
  }, []);

  const handleDownload = useCallback((image: GeneratedImage) => {
    if (image.downloadUrl) {
      window.open(image.downloadUrl, '_blank');
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, isDownloaded: true } : img
      ));
    }
  }, []);

  const handleFavorite = useCallback((imageId: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img
    ));
  }, []);

  const handleShare = useCallback((image: GeneratedImage) => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Generated Image',
        text: image.prompt,
        url: image.url
      });
    } else {
      navigator.clipboard.writeText(image.url);
    }
  }, []);

  const handleViewImage = useCallback((image: GeneratedImage) => {
    setSelectedImage(image);
  }, []);

  const handleRemoveJob = useCallback((jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  }, []);

  const handleViewJob = useCallback((job: AIGenerationJob) => {
    if (job.status === 'completed') {
      setImages(prev => [...prev, ...job.images]);
      setActiveTab('gallery');
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{t('authRequired')}</h2>
          <p className="text-gray-300 mb-6">{t('authRequiredMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{t('title')}</h1>
            <p className="text-gray-300">{t('subtitle')}</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowShortcuts(true)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <CommandLineIcon className="w-4 h-4" />
              <span>{t('shortcuts.title')}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'generate', label: t('generationForm.title'), icon: SparklesIcon },
            { id: 'history', label: t('history.title'), icon: ClockIcon },
            { id: 'gallery', label: t('results.title'), icon: PhotoIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'generate' | 'history' | 'gallery')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primaryOrange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Generation Form */}
          {activeTab === 'generate' && (
            <div className="lg:col-span-2">
              <GenerationForm
                prompt={prompt}
                setPrompt={setPrompt}
                style={style}
                setStyle={setStyle}
                quality={quality}
                setQuality={setQuality}
                count={count}
                setCount={setCount}
                onSubmit={handleGenerate}
                isGenerating={isGenerating}
                costBreakdown={costBreakdown}
              />
            </div>
          )}

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Cost Calculator */}
            <CostCalculator
              style={style}
              quality={quality}
              count={count}
              onUpdate={setCostBreakdown}
            />

            {/* Prompt Suggestions */}
            <PromptSuggestions
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
              isLoading={isLoadingSuggestions}
            />

            {/* Generation Queue */}
            <GenerationQueue
              jobs={jobs}
              onRemove={handleRemoveJob}
              onView={handleViewJob}
            />
          </div>
        </div>

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <ImageGallery
            images={images}
            onDownload={handleDownload}
            onFavorite={handleFavorite}
            onShare={handleShare}
            onView={handleViewImage}
          />
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">{t('history.title')}</h3>
            <div className="text-center py-8">
              <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">{t('history.empty')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
};

export default AIGenerationInterface;
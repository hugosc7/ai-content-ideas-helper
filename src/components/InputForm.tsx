import React, { useState } from 'react';
import { ContentInput } from '../types';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface InputFormProps {
  onSubmit: (input: ContentInput) => void;
  isLoading: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, isCollapsed = false, onToggleCollapse }) => {
  const [formData, setFormData] = useState<ContentInput>({
    website: '',
    websiteUrl: '',
    ica: '',
    services: '',
    keyTransformation: '',
    topPerformingBlogs: '',
    additionalContext: ''
  });
  
  const [isExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ContentInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear extraction error when user changes URL
    if (field === 'websiteUrl') {
      setExtractionError(null);
    }
  };

  return (
    <div className="bg-bg-primary p-6 rounded-lg border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">AI Content Ideas Generator</h2>
        </div>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title={isCollapsed ? "Expand form" : "Collapse form"}
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {!isCollapsed && (
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent"
              placeholder="e.g., TechStartup Inc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website URL (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.websiteUrl}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent"
                placeholder="yourwebsite.com or https://yourwebsite.com"
                disabled={isExtracting}
              />
              {isExtracting && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-accent-yellow border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              We'll automatically extract your website data to better understand your business. You can enter URLs with or without https://
            </p>
            {extractionError && (
              <p className="text-xs text-red-400 mt-1">
                {extractionError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ideal Customer Avatar (ICA) *
            </label>
            <input
              type="text"
              value={formData.ica}
              onChange={(e) => handleChange('ica', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent"
              placeholder="e.g., Small business owners aged 25-45"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Services/Products *
            </label>
            <input
              type="text"
              value={formData.services}
              onChange={(e) => handleChange('services', e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent"
              placeholder="e.g., Digital marketing, web design, consulting"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Key Transformation *
          </label>
          <textarea
            value={formData.keyTransformation}
            onChange={(e) => handleChange('keyTransformation', e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent"
            placeholder="e.g., From struggling to profitable in 90 days"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Audience Context: Your audience aspirations, desires and problems. Be as extensive as possible.
          </label>
          <textarea
            value={formData.additionalContext}
            onChange={(e) => handleChange('additionalContext', e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent"
            placeholder="Describe your audience's aspirations, desires, struggles, objections, language, and what success looks like for them."
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Top performing content title (if any, Optional)
          </label>
          <textarea
            value={formData.topPerformingBlogs}
            onChange={(e) => handleChange('topPerformingBlogs', e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent"
            placeholder="Share a few titles that performed well (posts, emails, videos, etc.)."
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || isExtracting}
          className="w-full bg-brand-gradient text-white font-semibold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Ideas...
            </>
          ) : isExtracting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Extracting Website Data...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate 15 Content Ideas
            </>
          )}
        </button>
      </form>
      )}
    </div>
  );
};

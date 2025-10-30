import React, { useState } from 'react';
import { ContentIdea } from '../types';
import { Download, RefreshCw, MessageSquare, X } from 'lucide-react';

interface ExportOptionsProps {
  selectedIdeas: ContentIdea[];
  onExportToTxt: (ideas: ContentIdea[]) => void;
  onGenerateMore: () => void;
  onProvideFeedback: (feedback: string) => void;
  isLoading: boolean;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  selectedIdeas,
  onExportToTxt,
  onGenerateMore,
  onProvideFeedback,
  isLoading
}) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onProvideFeedback(feedback.trim());
      setFeedback('');
      setShowFeedbackForm(false);
    }
  };

  if (selectedIdeas.length === 0) {
    return null;
  }

  return (
    <div className="bg-bg-primary p-6 rounded-lg border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">
        Export & Actions ({selectedIdeas.length} selected)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onExportToTxt(selectedIdeas)}
          className="bg-accent-yellow text-black px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download TXT
        </button>

        <button
          onClick={onGenerateMore}
          disabled={isLoading}
          className="bg-accent-pink text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          Generate More
        </button>

        <button
          onClick={() => setShowFeedbackForm(true)}
          className="bg-gray-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Provide Feedback
        </button>
      </div>

      {showFeedbackForm && (
        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white">Provide Feedback</h4>
            <button
              onClick={() => setShowFeedbackForm(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <form onSubmit={handleFeedbackSubmit}>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What would you like to improve? What style or topics work better for you?"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-transparent mb-3"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-accent-yellow text-black px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded font-medium hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

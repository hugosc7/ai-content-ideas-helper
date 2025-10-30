import React from 'react';
import { ContentIdea } from '../types';
import { Bookmark, BookmarkPlus, Copy } from 'lucide-react';

interface ContentIdeasProps {
  ideas: ContentIdea[];
  onToggleBookmark: (ideaId: string) => void;
}

export const ContentIdeas: React.FC<ContentIdeasProps> = ({
  ideas,
  onToggleBookmark
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (ideas.length === 0) {
    return (
      <div className="bg-bg-primary p-8 rounded-lg border border-gray-800 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Ideas Generated Yet</h3>
        <p className="text-gray-400">Fill out the form above to generate your first batch of content ideas!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Generated Ideas ({ideas.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {ideas.map((idea, index) => (
          <div
            key={idea.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              idea.isBookmarked
                ? 'bg-gray-800 border-accent-yellow'
                : 'bg-gray-900 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-accent-yellow bg-accent-yellow/10 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                  {idea.category && (
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      {idea.category}
                    </span>
                  )}
                </div>
                <h4 className="text-white font-medium mb-2 leading-relaxed">
                  {idea.title}
                </h4>
                {idea.description && (
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {idea.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(idea.title)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onToggleBookmark(idea.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    idea.isBookmarked
                      ? 'text-accent-yellow bg-accent-yellow/10'
                      : 'text-gray-400 hover:text-accent-yellow hover:bg-accent-yellow/10'
                  }`}
                  title={idea.isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                >
                  {idea.isBookmarked ? (
                    <BookmarkPlus className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { BookmarkGroup, ContentIdea } from '../types';
import { Bookmark, Download, Trash2 } from 'lucide-react';

interface BookmarkPanelProps {
  bookmarks: BookmarkGroup[];
  currentBookmarkedIdeas: ContentIdea[];
  onExportToTxt: (ideas: ContentIdea[]) => void;
  onDeleteGroup: (groupId: string) => void;
  onGenerateMore: () => void;
  onRemoveBookmark: (ideaId: string) => void;
  isLoading: boolean;
}

export const BookmarkPanel: React.FC<BookmarkPanelProps> = ({
  bookmarks,
  currentBookmarkedIdeas,
  onExportToTxt,
  onDeleteGroup,
  onGenerateMore,
  onRemoveBookmark,
  isLoading
}) => {

  const totalBookmarkedIdeas = currentBookmarkedIdeas.length + bookmarks.reduce((total, group) => total + group.ideas.length, 0);

  return (
    <div className="bg-bg-primary p-6 rounded-lg border border-gray-800 h-fit">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-accent-pink rounded-lg flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">Bookmarked Ideas</h3>
      </div>

      {totalBookmarkedIdeas === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 mb-4">No bookmarked ideas yet</p>
          <p className="text-sm text-gray-500">
            Click the bookmark icon on any idea to add it here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Current Bookmarked Ideas */}
          {currentBookmarkedIdeas.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">Current Bookmarks ({currentBookmarkedIdeas.length})</h4>
                <button
                  onClick={() => onExportToTxt(currentBookmarkedIdeas)}
                  className="p-1 text-gray-400 hover:text-accent-yellow transition-colors"
                  title="Export to TXT"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {currentBookmarkedIdeas.map((idea, index) => (
                  <div key={`current-${idea.id}`} className="bg-gray-800 p-3 rounded">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-2">
                        <span className="text-accent-yellow font-medium text-sm">#{index + 1}</span>
                        {idea.category && (
                          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                            {idea.category}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveBookmark(idea.id)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove from bookmarks"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <h5 className="text-white font-medium text-sm mb-2 leading-relaxed">
                      {idea.title}
                    </h5>
                    {idea.description && (
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {idea.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons for Current Bookmarks */}
          {currentBookmarkedIdeas.length > 0 && (
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => onExportToTxt(currentBookmarkedIdeas)}
                  className="bg-accent-yellow text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download TXT
                </button>
                
                <button
                  onClick={onGenerateMore}
                  disabled={isLoading}
                  className="bg-accent-pink text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  Generate More
                </button>
              </div>
            </div>
          )}

          {/* Saved Bookmark Groups */}
          <div className="space-y-4">
          {bookmarks.map((group) => (
            <div key={group.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">{group.name}</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onExportToTxt(group.ideas)}
                    className="p-1 text-gray-400 hover:text-accent-yellow transition-colors"
                    title="Export to TXT"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteGroup(group.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete group"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {group.ideas.map((idea, index) => (
                  <div key={`group-${group.id}-${idea.id}`} className="bg-gray-800 p-3 rounded">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-accent-yellow font-medium text-sm">#{index + 1}</span>
                      {idea.category && (
                        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                          {idea.category}
                        </span>
                      )}
                    </div>
                    <h5 className="text-white font-medium text-sm mb-2 leading-relaxed">
                      {idea.title}
                    </h5>
                    {idea.description && (
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {idea.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{group.ideas.length} ideas</span>
                  <span>{group.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}

          </div>
        </div>
      )}
    </div>
  );
};

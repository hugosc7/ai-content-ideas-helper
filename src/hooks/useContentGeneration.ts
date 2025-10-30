import { useState, useCallback } from 'react';
import { ContentInput, ContentIdea, BookmarkGroup } from '../types';
import { generateContentIdeas, generateMoreIdeas } from '../utils/api';

export const useContentGeneration = () => {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIdeas = useCallback(async (input: ContentInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generateContentIdeas(input);
      
      if (response.success && response.ideas) {
        // Ensure unique IDs for initial ideas
        const ideasWithUniqueIds = response.ideas.map((idea, index) => ({
          ...idea,
          id: `${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
        }));
        
        setIdeas(ideasWithUniqueIds);
      } else {
        setError(response.error || 'Failed to generate ideas');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateMore = useCallback(async (input: ContentInput, selectedIdeas: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generateMoreIdeas(input, selectedIdeas);
      
      if (response.success && response.ideas) {
        // Ensure unique IDs for new ideas
        const newIdeas = response.ideas.map((idea, index) => ({
          ...idea,
          id: `${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
        }));
        
        setIdeas(prev => [...prev, ...newIdeas]);
      } else {
        setError(response.error || 'Failed to generate more ideas');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleBookmark = useCallback((ideaId: string) => {
    setIdeas(prev => {
      const updatedIdeas = prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, isBookmarked: !idea.isBookmarked }
          : idea
      );
      
      // Debug: log the bookmark state
      const bookmarkedCount = updatedIdeas.filter(idea => idea.isBookmarked).length;
      console.log(`Bookmarked ideas: ${bookmarkedCount}, Toggled ID: ${ideaId}`);
      
      return updatedIdeas;
    });
  }, []);

  const createBookmarkGroup = useCallback((name: string) => {
    const bookmarkedIdeas = ideas.filter(idea => idea.isBookmarked);
    if (bookmarkedIdeas.length === 0) return;

    const newGroup: BookmarkGroup = {
      id: Date.now().toString(),
      name,
      ideas: bookmarkedIdeas,
      createdAt: new Date()
    };

    setBookmarks(prev => [...prev, newGroup]);
    
    // Clear bookmarks from main ideas
    setIdeas(prev => 
      prev.map(idea => ({ ...idea, isBookmarked: false }))
    );
  }, [ideas]);

  const exportToTxt = useCallback((ideas: ContentIdea[]) => {
    const content = ideas.map((idea, index) => {
      let ideaText = `${index + 1}. ${idea.title}`;
      
      if (idea.category) {
        ideaText += `\n   Category: ${idea.category}`;
      }
      
      if (idea.description) {
        ideaText += `\n   Description: ${idea.description}`;
      }
      
      return ideaText;
    }).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-ideas-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const clearAllBookmarks = useCallback(() => {
    setIdeas(prev => 
      prev.map(idea => ({ ...idea, isBookmarked: false }))
    );
  }, []);

  return {
    ideas,
    bookmarks,
    isLoading,
    error,
    generateIdeas,
    generateMore,
    toggleBookmark,
    createBookmarkGroup,
    exportToTxt,
    clearAllBookmarks
  };
};

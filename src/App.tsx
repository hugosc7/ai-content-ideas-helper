import { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { ContentIdeas } from './components/ContentIdeas';
import { BookmarkPanel } from './components/BookmarkPanel';
import { ProgressOverlay } from './components/ProgressOverlay';
import { OptInModal } from './components/OptInModal';
import { useContentGeneration } from './hooks/useContentGeneration';
import { ContentInput } from './types';
import { extractWebsiteData, formatWebsiteDataForAI } from './utils/websiteExtraction';

function App() {
  const {
    ideas,
    bookmarks,
    isLoading,
    error,
    generateIdeas,
    generateMore,
    toggleBookmark,
    exportToTxt
  } = useContentGeneration();

  const [lastInput, setLastInput] = useState<ContentInput | null>(null);
  const [isFormCollapsed, setIsFormCollapsed] = useState(false);
  const [showProgressOverlay, setShowProgressOverlay] = useState(false);
  const [showOptInModal, setShowOptInModal] = useState(false);
  const [pendingInput, setPendingInput] = useState<ContentInput | null>(null);
  const selectedIdeas = ideas.filter(idea => idea.isBookmarked);

  // Collapse form when ideas are successfully generated
  useEffect(() => {
    if (ideas.length > 0 && !isLoading && !error) {
      setIsFormCollapsed(true);
    }
  }, [ideas.length, isLoading, error]);

  const handleGenerateMore = () => {
    if (!lastInput) {
      // If no previous input, show an alert
      alert('Please generate ideas first by filling out the form.');
      return;
    }

    // If there are bookmarked ideas, use them as context for generating related ideas
    if (selectedIdeas.length > 0) {
      // Use the bookmarked ideas to generate more related content
      generateMore(lastInput, selectedIdeas.map(idea => idea.title));
    } else {
      // If no bookmarks, generate more ideas using the original input
      generateIdeas(lastInput);
    }
  };


  const handleGenerateIdeas = async (input: ContentInput) => {
    // Store the input and show opt-in modal first
    setPendingInput(input);
    setShowOptInModal(true);
  };

  const handleOptInComplete = async (name: string, email: string) => {
    if (!pendingInput) return;
    
    // Close opt-in modal and show progress overlay
    setShowOptInModal(false);
    setShowProgressOverlay(true);
    
    // Add user info to input
    const inputWithUser = { ...pendingInput, userName: name, userEmail: email };
    setLastInput(inputWithUser);
    
    // Extract website data if URL is provided
    let enhancedInput = { ...inputWithUser };
    if (inputWithUser.websiteUrl) {
      try {
        const websiteData = await extractWebsiteData(inputWithUser.websiteUrl);
        if (websiteData) {
          // Add extracted data to additional context
          const websiteContext = formatWebsiteDataForAI(websiteData);
          enhancedInput.additionalContext = 
            (inputWithUser.additionalContext || '') + websiteContext;
        }
      } catch (error) {
        console.error('Failed to extract website data:', error);
        // Continue with original input if extraction fails
      }
    }
    
    await generateIdeas(enhancedInput);
    setShowProgressOverlay(false);
    setPendingInput(null);
  };

  const handleToggleFormCollapse = () => {
    setIsFormCollapsed(!isFormCollapsed);
  };

  

  return (
    <div className="min-h-screen bg-bg-primary">
      {showOptInModal && (
        <OptInModal
          onComplete={handleOptInComplete}
          onClose={() => {
            setShowOptInModal(false);
            setPendingInput(null);
          }}
        />
      )}
      {showProgressOverlay && isLoading && <ProgressOverlay />}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Content Ideas Helper
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Generate high-engaging content ideas tailored to your business and audience. 
            Let AI help you create content that resonates and converts.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <InputForm 
              onSubmit={handleGenerateIdeas} 
              isLoading={isLoading}
              isCollapsed={isFormCollapsed}
              onToggleCollapse={handleToggleFormCollapse}
            />
            
            <ContentIdeas
              ideas={ideas}
              onToggleBookmark={toggleBookmark}
            />

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookmarkPanel
                bookmarks={bookmarks}
                currentBookmarkedIdeas={selectedIdeas}
                onExportToTxt={exportToTxt}
                onDeleteGroup={(groupId) => {
                  // In a real implementation, you'd have a delete function
                  console.log('Delete group:', groupId);
                }}
                onGenerateMore={handleGenerateMore}
                onRemoveBookmark={toggleBookmark}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            Powered by AI • Designed for WordPress • Responsive & SEO Optimized
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

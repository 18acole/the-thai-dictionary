import { useState, useEffect, useRef } from 'react';

import { Word } from '../pages/index';

interface StickySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language?: 'english' | 'chinese';
  allWords?: Word[];
}

export default function StickySearch({ searchQuery, setSearchQuery, language = 'english', allWords = [] }: StickySearchProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Word[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to handle scroll
    const handleScroll = () => {
      // Show sticky search when scrolled down 300px
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      
      // Using the threshold with a clean toggle
      setIsVisible(scrollPosition > 300);
    };

    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial position
    handleScroll();

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Filter suggestions based on search query
  useEffect(() => {
    // Only show suggestions when focused and typing
    const input = searchQuery.toLowerCase().trim();
    
    // Clear suggestions if input is empty or too short
    if (input.length < 2) {
      setFilteredSuggestions([]);
      return;
    }
    
    // Make sure allWords is available and not empty
    if (!allWords || allWords.length === 0) {
      return;
    }
    
    // Filter words based on language
    const matches = allWords.filter(word => {
      if (language === 'english' && word.english) {
        return word.english.toLowerCase().includes(input);
      } else if (language === 'chinese' && word.chinese) {
        return word.chinese.toLowerCase().includes(input);
      }
      return false;
    });
    
    // Limit to 5 results
    setFilteredSuggestions(matches.slice(0, 5));
  }, [searchQuery, language, allWords]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is real-time, this just prevents form submission
  };
  
  const handleSelectSuggestion = (suggestion: Word) => {
    // Set the search query to the selected suggestion's English or Chinese word
    setSearchQuery(language === 'english' ? suggestion.english : suggestion.chinese);
    // Clear the suggestions
    setFilteredSuggestions([]);
  };

  return (
    <div 
      className={`fixed top-14 left-0 right-0 z-30 w-full transition-all duration-200 ease-in-out ${
        isVisible 
          ? 'opacity-100 transform-none' 
          : 'opacity-0 -translate-y-5 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="bg-white/90 backdrop-blur-sm shadow-md border-b border-pink-200 py-2 px-4">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 items-center w-full">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={handleChange}
                placeholder={language === 'english' 
                  ? "🔍 Search Thai..."
                  : "🔍 搜索泰语..."}
                className="w-full rounded-full border border-pink-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              {/* Word prediction dropdown */}
              {filteredSuggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-pink-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="py-1">
                    {filteredSuggestions.map((item, idx) => (
                      <button
                        key={item._id || idx}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full text-left px-4 py-2 hover:bg-pink-50 transition-colors text-sm border-b last:border-b-0 border-pink-100"
                      >
                        <span className="font-medium">{language === 'english' ? item.english : item.chinese}</span>
                        <span className="mx-2 text-gray-400">—</span>
                        <span className="text-pink-600">{item.thai}</span>
                        {item.romanized && (
                          <span className="text-gray-500 ml-2 italic">({item.romanized})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 text-sm rounded-full font-medium flex-shrink-0"
            >
              {language === 'english' ? 'Search' : '搜索'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Word } from '../pages/index';

interface StickySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  language?: 'english' | 'chinese';
  allWords?: Word[];
}

export default function StickySearch({ 
  searchQuery, 
  setSearchQuery, 
  language = 'english', 
  allWords = [] 
}: StickySearchProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [stickyInputValue, setStickyInputValue] = useState(''); // Local state for sticky search
  const [suggestions, setSuggestions] = useState<Word[]>([]);
  
  // Handle scroll visibility
  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollPosition > 300);
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Sync input value with searchQuery when searchQuery changes externally
  useEffect(() => {
    setStickyInputValue(searchQuery);
  }, [searchQuery]);
  
  // Handle search suggestions based on local input value
  useEffect(() => {
    const input = stickyInputValue.toLowerCase().trim();
    
    // Only show suggestions when input is 2+ characters
    if (input.length < 2 || !allWords?.length) {
      setSuggestions([]);
      return;
    }
    
    // Filter based on the current language
    const matches = allWords.filter(word => {
      if (language === 'english' && word.english) {
        return word.english.toLowerCase().includes(input);
      } else if (language === 'chinese' && word.chinese) {
        return word.chinese.toLowerCase().includes(input);
      }
      return false;
    });
    
    setSuggestions(matches.slice(0, 5)); // Max 5 suggestions
  }, [stickyInputValue, language, allWords]);
  
  // Handle input change - only update local state
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStickyInputValue(e.target.value);
  }
  
  // Submit search function
  function submitSearch(value: string) {
    setSearchQuery(value); // Update global search query
    setSuggestions([]); // Close dropdown
  }
  
  // Handle suggestion selection
  function handleSelectSuggestion(word: Word) {
    const value = language === 'english' ? word.english : word.chinese;
    setStickyInputValue(value);
    submitSearch(value);
  }
  
  // Handle form submission
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitSearch(stickyInputValue);
  }
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleDocumentClick() {
      setSuggestions([]);
    }
    
    if (suggestions.length > 0) {
      document.addEventListener('click', handleDocumentClick);
      return () => document.removeEventListener('click', handleDocumentClick);
    }
  }, [suggestions.length]);
  
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
                value={stickyInputValue}
                onChange={handleChange}
                placeholder={language === 'english' 
                  ? "🔍 Search Thai..."
                  : "🔍 搜索泰语..."}
                className="w-full rounded-full border border-pink-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              {/* Word prediction dropdown */}
              {suggestions.length > 0 && (
                <div 
                  className="absolute top-full mt-2 w-full bg-white border border-pink-200 rounded-xl shadow-lg z-50 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    {suggestions.map((word, idx) => (
                      <button
                        key={word._id || idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSuggestion(word);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-pink-50 transition-colors text-sm border-b last:border-b-0 border-pink-100"
                      >
                        <span className="font-medium">
                          {language === 'english' ? word.english : word.chinese}
                        </span>
                        <span className="mx-2 text-gray-400">—</span>
                        <span className="text-pink-600">{word.thai}</span>
                        {word.romanized && (
                          <span className="text-gray-500 ml-2 italic">({word.romanized})</span>
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